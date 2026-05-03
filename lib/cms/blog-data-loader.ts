type PrebuiltBlogPost = Record<string, any> & {
  content: string;
  locale?: string;
  slug: string;
  status?: string;
};

type BlogDataModule = {
  blogData?: Record<string, readonly PrebuiltBlogPost[]>;
};

function loadBlogDataModule(): BlogDataModule | null {
  if (typeof require === "undefined") {
    return null;
  }

  try {
    return require("./blog-data") as BlogDataModule;
  } catch {
    return null;
  }
}

export function getBlogData(locale: string) {
  return [...(loadBlogDataModule()?.blogData?.[locale] ?? [])];
}

export function getBlogPostBySlug(slug: string, locale: string) {
  const targetSlug = slug.replace(/^\//, "").replace(/\/$/, "");

  return getBlogData(locale).find((post) => {
    const localSlug = post.slug.replace(/^\//, "").replace(/\/$/, "");
    return localSlug === targetSlug;
  });
}
