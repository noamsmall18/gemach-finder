import type { MetadataRoute } from 'next'
import { getAllGemachs, getAllLocations, siteUrl, townToSlug } from '@/lib/data'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/map`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/requests`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/suggest`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const gemachs = await getAllGemachs()
  const gemachRoutes: MetadataRoute.Sitemap = gemachs
    .filter((g) => g.slug)
    .map((g) => ({
      url: `${base}/g/${g.slug}`,
      lastModified: g.created_at ? new Date(g.created_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const locations = await getAllLocations()
  const townRoutes: MetadataRoute.Sitemap = locations.map(({ location }) => ({
    url: `${base}/town/${townToSlug(location)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...gemachRoutes, ...townRoutes]
}
