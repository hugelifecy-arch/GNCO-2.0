import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/architect', '/dashboard', '/signin', '/api/'],
    },
    sitemap: 'https://gnconew.vercel.app/sitemap.xml',
  }
}
