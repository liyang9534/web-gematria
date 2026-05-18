import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/',
        '/api/',
        '/auth/',
        '/dashboard/',
        '/_next/data/',
        '/error',
        '/redirect-error',
        '/stripe-error',
        '/*/404',
        '/*/500',
        '/*/403',
        '/*/401',
        '/*/400',
        '/cdn-cgi/',
      ],
    },
    sitemap: 'https://mynumberdecoder.com/sitemap.xml',
  }
}
