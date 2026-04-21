import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, BadgeCheck, MapPin } from 'lucide-react'
import { getAllLocations, getGemachsByLocation, siteUrl, townToSlug, slugToTown } from '@/lib/data'
import { getCategoryEmoji, CATEGORY_ACCENT_COLORS } from '@/lib/constants'
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

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, type: 'website', siteName: 'GemachFinder' },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locations = (await getAllLocations()).map((l) => l.location)
  const town = slugToTown(slug, locations)
  if (!town) notFound()

  const gemachs = await getGemachsByLocation(town)
  const byCategory = new Map<string, typeof gemachs>()
  for (const g of gemachs) {
    const arr = byCategory.get(g.category) || []
    arr.push(g)
    byCategory.set(g.category, arr)
  }
  const categories = Array.from(byCategory.entries()).sort(
    (a, b) => b[1].length - a[1].length
  )

  return (
    <>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-navy">
          <ChevronLeft className="w-3.5 h-3.5" /> Directory
        </Link>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-navy mt-3">
          Gemachs in {town}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          {gemachs.length} verified free community services in {town}.
        </p>
      </section>

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
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <MapPin className="w-4 h-4" /> Other nearby towns
          </div>
          <div className="flex flex-wrap gap-2">
            {locations
              .filter((l) => l !== town)
              .slice(0, 12)
              .map((l) => (
                <Link
                  key={l}
                  href={`/town/${townToSlug(l)}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:border-navy/40 hover:text-navy transition-colors"
                >
                  {l}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer gemachCount={gemachs.length} />
    </>
  )
}
