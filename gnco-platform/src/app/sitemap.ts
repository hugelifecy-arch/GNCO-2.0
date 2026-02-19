import type { MetadataRoute } from 'next'

const BASE_URL = 'https://gnconew.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/coverage',
    '/methodology',
    '/disclosures',
    '/privacy',
    '/terms',
    '/data-architecture',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
  }))
}
