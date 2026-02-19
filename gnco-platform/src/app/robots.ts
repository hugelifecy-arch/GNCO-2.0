import type { MetadataRoute } from 'next'

const BASE_URL = 'https://gnconew.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/architect', '/dashboard', '/signin', '/api'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
