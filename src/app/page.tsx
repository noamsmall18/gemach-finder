export const revalidate = 300 // refresh data every 5 minutes

import GemachDirectory from '@/components/GemachDirectory'
import Footer from '@/components/Footer'
import AnimatedHero from '@/components/AnimatedHero'
import HeroBackground from '@/components/HeroBackground'
import { getAllGemachs, siteUrl } from '@/lib/data'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const gemachs = await getAllGemachs()
  const initialSearch = (q || '').slice(0, 200)

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GemachFinder',
    url: siteUrl(),
    logo: `${siteUrl()}/logo.png`,
    description: `Free community lending directory with ${gemachs.length} verified gemachs across Bergen County and nearby communities.`,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Bergen County, NJ' },
    ],
  }

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GemachFinder',
    url: siteUrl(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl()}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />

      <section className="relative min-h-[45vh] sm:min-h-[60vh] md:min-h-[55vh] flex items-center justify-center px-4 text-center overflow-hidden">
        <HeroBackground />
        <AnimatedHero count={gemachs.length} />
      </section>

      <section id="directory" className="px-3 sm:px-4 md:px-6 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          <GemachDirectory gemachs={gemachs} initialSearch={initialSearch} />
        </div>
      </section>

      <Footer gemachCount={gemachs.length} />
    </>
  )
}
