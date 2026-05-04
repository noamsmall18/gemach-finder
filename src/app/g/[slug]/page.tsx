import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Phone, Mail, Globe, MapPin, Clock, User, FileText, AlertCircle, ArrowUpRight, ChevronLeft, ChevronRight, BadgeCheck, MessageSquare, TrendingUp } from 'lucide-react'
import { getAllSlugs, getGemachBySlug, getGemachsByLocation, getSiblings, siteUrl, townToSlug } from '@/lib/data'
import { getCategoryEmoji, CATEGORY_ACCENT_COLORS } from '@/lib/constants'
import GemachPageActions from '@/components/GemachPageActions'
import OpenNowBadge from '@/components/OpenNowBadge'
import Footer from '@/components/Footer'

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const gemach = await getGemachBySlug(slug)
  if (!gemach) return { title: 'Gemach not found - GemachFinder' }

  const title = `${gemach.name} - ${gemach.location} - GemachFinder`
  const desc =
    gemach.description.length > 160
      ? gemach.description.slice(0, 157) + '...'
      : gemach.description
  const url = `${siteUrl()}/g/${slug}`
  const ogImage = gemach.photo_url || `${siteUrl()}/og?title=${encodeURIComponent(gemach.name)}&sub=${encodeURIComponent(gemach.location + ' · ' + gemach.category)}`

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: gemach.name,
      description: desc,
      url,
      type: 'website',
      siteName: 'GemachFinder',
      images: [{ url: ogImage, width: 1200, height: 630, alt: gemach.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: gemach.name,
      description: desc,
      images: [ogImage],
    },
  }
}

export default async function GemachPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const gemach = await getGemachBySlug(slug)
  if (!gemach) notFound()

  const townList = await getGemachsByLocation(gemach.location)
  const related = townList.filter((g) => g.id !== gemach.id).slice(0, 6)
  const { prev, next } = getSiblings(gemach, townList)
  const isPopular = (gemach.used_count ?? 0) >= 5

  const emoji = getCategoryEmoji(gemach.category)
  const accentColor = CATEGORY_ACCENT_COLORS[gemach.category] || '#64748B'
  const hasContact = gemach.contact_phone || gemach.contact_email || gemach.contact_website
  const url = `${siteUrl()}/g/${slug}`
  const townSlug = townToSlug(gemach.location)

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name: gemach.name,
    description: gemach.description,
    url,
    areaServed: gemach.location,
    telephone: gemach.contact_phone || undefined,
    email: gemach.contact_email || undefined,
    sameAs: gemach.contact_website || undefined,
    address: gemach.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: gemach.address,
          addressLocality: gemach.location,
          addressRegion: gemach.location.includes('NY') ? 'NY' : 'NJ',
          addressCountry: 'US',
        }
      : { '@type': 'PostalAddress', addressLocality: gemach.location, addressCountry: 'US' },
    geo:
      gemach.lat != null && gemach.lng != null
        ? { '@type': 'GeoCoordinates', latitude: gemach.lat, longitude: gemach.lng }
        : undefined,
    openingHours: gemach.hours || undefined,
    priceRange: 'Free',
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Directory', item: siteUrl() },
      {
        '@type': 'ListItem',
        position: 2,
        name: gemach.location,
        item: `${siteUrl()}/town/${townSlug}`,
      },
      { '@type': 'ListItem', position: 3, name: gemach.name, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-navy flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Directory
          </Link>
          <span className="text-slate-300">/</span>
          <Link href={`/town/${townSlug}`} className="hover:text-navy">
            {gemach.location}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 truncate">{gemach.name}</span>
        </nav>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 pt-4">
        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div
            className="relative h-28 sm:h-36 flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 55%, ${accentColor}88 100%)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3), transparent 45%)',
              }}
            />
            <span
              className="relative text-[72px] sm:text-[96px] leading-none select-none"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
              aria-hidden="true"
            >
              {emoji}
            </span>
            {isPopular && (
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-amber-700 shadow-sm">
                <TrendingUp className="w-3 h-3" />
                Community favorite
              </div>
            )}
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
              >
                {gemach.category}
              </span>
              <OpenNowBadge hours={gemach.hours} />
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800 mt-3 leading-tight">
              {gemach.name}
              {gemach.operator_confirmed && (
                <BadgeCheck
                  className="inline-block w-6 h-6 ml-1.5 -mt-1 text-sky-500 align-middle"
                  strokeWidth={2.25}
                  aria-label="Confirmed by operator"
                />
              )}
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5 text-sm text-slate-500">
              <MapPin className="w-4 h-4" />
              <Link href={`/town/${townSlug}`} className="hover:text-navy">
                {gemach.location}
              </Link>
            </div>

            <p className="text-sm sm:text-base text-slate-700 mt-5 leading-relaxed">
              {gemach.description}
            </p>

            <GemachPageActions gemach={gemach} />

            {hasContact ? (
              <div className="mt-6 space-y-2">
                {gemach.contact_phone && (
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${gemach.contact_phone.replace(/[^+\d]/g, '')}`}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors min-w-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Call</div>
                        <div className="text-xs font-medium truncate">{gemach.contact_phone}</div>
                      </div>
                    </a>
                    <a
                      href={`sms:${gemach.contact_phone.replace(/[^+\d]/g, '')}`}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors min-w-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-sky-500 font-semibold uppercase tracking-wider">Text</div>
                        <div className="text-xs font-medium truncate">{gemach.contact_phone}</div>
                      </div>
                    </a>
                  </div>
                )}

                {gemach.contact_email && (
                  <a
                    href={`mailto:${gemach.contact_email}`}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider">Email</div>
                      <div className="text-sm font-medium truncate">{gemach.contact_email}</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-30" />
                  </a>
                )}

                {gemach.contact_website && (
                  <a
                    href={gemach.contact_website.startsWith('http') ? gemach.contact_website : `https://${gemach.contact_website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Website</div>
                      <div className="text-sm font-medium truncate">{gemach.contact_website.replace(/^https?:\/\//, '')}</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-30" />
                  </a>
                )}
              </div>
            ) : (
              <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 text-amber-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Limited contact info.{' '}
                  {gemach.notes ? 'See notes below.' : 'Check community boards for current contact.'}
                </span>
              </div>
            )}

            {(gemach.contact_name || gemach.address || gemach.hours || gemach.notes) && (
              <div className="mt-7 pt-6 border-t border-slate-100 space-y-4">
                {gemach.contact_name && (
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Contact</div>
                      <div className="text-sm text-slate-700 mt-0.5">{gemach.contact_name}</div>
                    </div>
                  </div>
                )}

                {gemach.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Address</div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gemach.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-navy hover:underline mt-0.5 block"
                      >
                        {gemach.address}
                      </a>
                    </div>
                  </div>
                )}

                {gemach.hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hours</div>
                      <div className="text-sm text-slate-700 mt-0.5">{gemach.hours}</div>
                    </div>
                  </div>
                )}

                {gemach.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Additional Info</div>
                      <div className="text-sm text-slate-600 mt-0.5 leading-relaxed">{gemach.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {(prev || next) && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {prev ? (
              <Link
                href={`/g/${prev.slug}`}
                prefetch={false}
                className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-navy/40 hover:shadow-sm transition-all min-w-0"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Previous</div>
                  <div className="text-sm font-medium text-slate-700 truncate">{prev.name}</div>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/g/${next.slug}`}
                prefetch={false}
                className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-navy/40 hover:shadow-sm transition-all min-w-0 text-right ml-auto w-full"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Next</div>
                  <div className="text-sm font-medium text-slate-700 truncate">{next.name}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-lg font-bold text-slate-800">
                More in {gemach.location}
              </h2>
              <Link
                href={`/town/${townSlug}`}
                className="text-xs font-semibold text-navy hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {related.map((g) => (
                <Link
                  key={g.id}
                  href={`/g/${g.slug}`}
                  className="block p-3 rounded-xl bg-white border border-slate-200 hover:border-navy/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>{getCategoryEmoji(g.category)}</span>
                    <span>{g.category}</span>
                  </div>
                  <div className="font-heading font-semibold text-sm text-slate-800">
                    {g.name}
                    {g.operator_confirmed && (
                      <BadgeCheck className="inline-block w-3.5 h-3.5 ml-1 -mt-0.5 text-sky-500" strokeWidth={2.25} />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer gemachCount={townList.length} />
    </>
  )
}
