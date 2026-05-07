import { listPublishedPostsAction } from '@/actions/posts/posts'
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/routing'
import { getAllAngelNumbers } from '@/lib/angel-numbers'
import { blogCms } from '@/lib/cms'
import { getPublicSiteUrl } from '@/lib/site-url'
import { MetadataRoute } from 'next'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getPublicSiteUrl()

  // Static pages
  const staticPages = [
    '',
  ]

  const pages = LOCALES.flatMap(locale => {
    return staticPages.map(page => ({
      url: `${siteUrl}${locale === DEFAULT_LOCALE ? '' : `/${locale}`}${page}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: page === '' ? 1.0 : 0.8,
    }))
  })

  const seoStaticPages = [
    '/angel-number',
    '/calculator',
    '/calculator/gematria',
    '/calculator/numerology',
    '/calculator/life-path',
  ].map(page => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: page === '/angel-number' ? 0.9 : 0.8,
  }))

  const angelNumberPages = getAllAngelNumbers().map((angelNumber) => ({
    url: `${siteUrl}/angel-number/${angelNumber.slug}`,
    lastModified: new Date(angelNumber.lastUpdated),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: angelNumber.isPriority ? 0.9 : 0.7,
  }))

  const allBlogSitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const { posts: localPosts } = await blogCms.getLocalList(locale);
    localPosts
      .filter((post) => post.slug && post.status !== "draft")
      .forEach((post) => {
        const slugPart = post.slug.replace(/^\//, "").replace(/^blogs\//, "");
        if (slugPart) {
          allBlogSitemapEntries.push({
            url: `${siteUrl}${locale === DEFAULT_LOCALE ? '' : `/${locale}`}/blog/${slugPart}`,
            lastModified: post.metadata?.updatedAt || post.publishedAt || new Date(),
            changeFrequency: 'daily' as ChangeFrequency,
            priority: 0.7,
          });
        }
      });
  }

  for (const locale of LOCALES) {
    const serverResult = await listPublishedPostsAction({
      locale: locale,
      pageSize: 1000,
      visibility: "public",
      postType: "blog",
    });
    if (serverResult.success && serverResult.data?.posts) {
      serverResult.data.posts.forEach((post) => {
        const slugPart = post.slug?.replace(/^\//, "").replace(/^blogs\//, "");
        if (slugPart) {
          allBlogSitemapEntries.push({
            url: `${siteUrl}${locale === DEFAULT_LOCALE ? '' : `/${locale}`}/blog/${slugPart}`,
            lastModified: post.publishedAt || new Date(),
            changeFrequency: 'daily' as ChangeFrequency,
            priority: 0.7,
          });
        }
      });
    }
  }

  const uniqueBlogPostEntries = Array.from(
    new Map(allBlogSitemapEntries.map((entry) => [entry.url, entry])).values()
  );

  // Glossary entries (server-side only, no local file system access)
  const allGlossarySitemapEntries: MetadataRoute.Sitemap = [];

  // Add glossary list page
  for (const locale of LOCALES) {
    allGlossarySitemapEntries.push({
      url: `${siteUrl}${locale === DEFAULT_LOCALE ? '' : `/${locale}`}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.8,
    });
  }

  // Add glossary entries
  for (const locale of LOCALES) {
    const serverResult = await listPublishedPostsAction({
      locale: locale,
      pageSize: 1000,
      visibility: "public",
      postType: "glossary",
    });
    if (serverResult.success && serverResult.data?.posts) {
      serverResult.data.posts.forEach((post) => {
        const slugPart = post.slug?.replace(/^\//, "").replace(/^glossary\//, "");
        if (slugPart) {
          allGlossarySitemapEntries.push({
            url: `${siteUrl}${locale === DEFAULT_LOCALE ? '' : `/${locale}`}/glossary/${slugPart}`,
            lastModified: post.publishedAt || new Date(),
            changeFrequency: 'daily' as ChangeFrequency,
            priority: 0.7,
          });
        }
      });
    }
  }

  const uniqueGlossaryEntries = Array.from(
    new Map(allGlossarySitemapEntries.map((entry) => [entry.url, entry])).values()
  );

  return [
    ...pages,
    ...seoStaticPages,
    ...angelNumberPages,
    ...uniqueBlogPostEntries,
    ...uniqueGlossaryEntries
  ]
}
