import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, BadgeCheck, MapPin, TrendingUp } from 'lucide-react'
import { getAllLocations, getGemachsByLocation, siteUrl, townToSlug, slugToTown } from '@/lib/data'
import { getCategoryEmoji, CATEGORY_ACCENT_COLORS } from '@/lib/constants'
import { TOWN_COORDS } from '@/lib/townCoords'
import Footer from '@/components/Footer'

export const revalidate = 300

export async function generateStaticParams() {
  const locations = await getAllLocations()
  return locations.map(({ location }) => ({ slug: townToSlug(location) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locations = (await getAllLocations()).map((l) => l.location)
  const town = slugToTown(slug, locations)
  if (!town) return { title: 'Town not found - GemachFinder' }

  const list = await getGemachsByLocation(town)
  const title = `${town} Gemachs - ${list.length} free community services - GemachFinder`
  const desc = `${list.length} free community lending gemachs in ${town}. Baby gear, medical equipment, simcha supplies, interest-free loans, and more.`
  const url = `${siteUrl()}/town/${slug}`
  const ogImage = `${siteUrl()}/og?title=${encodeURIComponent(town)}&sub=${encodeURIComponent(`${list.length} gemachs`)}`

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: 'website',
      siteName: 'GemachFinder',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${town} gemachs` }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [ogImage] },
  }
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const allLocations = (await getAllLocations()).map((l) => l.location)
  const town = slugToTown(slug, allLocations)
  if (!town) notFound()

  const gemachs = await getGemachsByLocation(town)
  const confirmedCount = gemachs.filter((g) => g.operator_confirmed).length
  const topUsed = [...gemachs]
    .filter((g) => (g.used_count ?? 0) > 0)
    .sort((a, b) => (b.used_count ?? 0) - (a.used_count ?? 0))
    .slice(0, 3)

  const byCategory = new Map<string, typeof gemachs>()
  for (const g of gemachs) {
    const arr = byCategory.get(g.category) || []
    arr.push(g)
    byCategory.set(g.category, arr)
  }
  const categories = Array.from(byCategory.entries()).sort(
    (a, b) => b[1].length - a[1].length
  )

  const townCoord = TOWN_COORDS[town]
  const nearby = allLocations
    .filter((l) => l !== town && TOWN_COORDS[l])
    .map((l) => ({ location: l, distance: townCoord ? haversineKm(townCoord, TOWN_COORDS[l]!) : 999 }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 8)

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Gemachs in ${town}`,
    description: `Free community lending gemachs in ${town}.`,
    url: `${siteUrl()}/town/${slug}`,
    hasPart: gemachs.slice(0, 20).map((g) => ({
      '@type': 'LocalBusiness',
      name: g.name,
      url: `${siteUrl()}/g/${g.slug}`,
      areaServed: g.location,
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Directory', item: siteUrl() },
      { '@type': 'ListItem', position: 2, name: town, item: `${siteUrl()}/town/${slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-navy"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Directory
        </Link>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy mt-3">
          Gemachs in {town}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          Free community lending services in {town}. Click any listing for full details, hours,
          and one-tap call or text.
        </p>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 max-w-md">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <div className="text-2xl font-heading font-bold text-navy tabular-nums">
              {gemachs.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
              Gemachs
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <div className="text-2xl font-heading font-bold text-sky-600 tabular-nums">
              {confirmedCount}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
              Verified
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <div className="text-2xl font-heading font-bold text-emerald-600 tabular-nums">
              {categories.length}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
              Categories
            </div>
          </div>
        </div>
      </section>

      {topUsed.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Community favorites in {town}
            </div>
            <div className="flex flex-wrap gap-2">
              {topUsed.map((g) => (
                <Link
                  key={g.id}
                  href={`/g/${g.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-amber-800 border border-amber-200 text-xs font-medium hover:bg-amber-50 transition-colors"
                >
                  <span>{getCategoryEmoji(g.category)}</span>
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 mt-6 space-y-8">
        {categories.map(([category, list]) => {
          const emoji = getCategoryEmoji(category)
          const accent = CATEGORY_ACCENT_COLORS[category] || '#64748B'
          return (
            <div key={category}>
              <h2
                className="font-heading text-base font-bold mb-3 flex items-center gap-2"
                style={{ color: accent }}
              >
                <span>{emoji}</span> {category}{' '}
                <span className="text-xs font-normal text-slate-400">· {list.length}</span>
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((g) => (
                  <Link
                    key={g.id}
                    href={`/g/${g.slug}`}
                    className="block p-3.5 rounded-xl bg-white border border-slate-200 hover:border-navy/40 hover:shadow-sm transition-all"
                  >
                    <div className="font-heading font-semibold text-sm text-slate-800 leading-snug">
                      {g.name}
                      {g.operator_confirmed && (
                        <BadgeCheck
                          className="inline-block w-3.5 h-3.5 ml-1 -mt-0.5 text-sky-500"
                          strokeWidth={2.25}
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {g.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <MapPin className="w-4 h-4" /> Nearby towns
          </div>
          <div className="flex flex-wrap gap-2">
            {nearby.map((n) => (
              <Link
                key={n.location}
                href={`/town/${townToSlug(n.location)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:border-navy/40 hover:text-navy transition-colors"
              >
                {n.location}
                {n.distance < 99 && (
                  <span className="text-[10px] text-slate-400">· {n.distance.toFixed(1)} km</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer gemachCount={gemachs.length} />
    </>
  )
}
