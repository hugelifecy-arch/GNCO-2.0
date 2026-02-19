import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://gnconew.vercel.app',
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://gnconew.vercel.app/coverage',
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://gnconew.vercel.app/methodology',
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://gnconew.vercel.app/disclosures',
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://gnconew.vercel.app/privacy',
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://gnconew.vercel.app/terms',
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://gnconew.vercel.app/data-architecture',
      lastModified: new Date('2026-02-19'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]
}
