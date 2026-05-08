import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { getGemachCount } from '@/lib/data'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'About - GemachFinder',
  description: 'GemachFinder is a free, community-sourced directory of gemachs across Bergen County and nearby communities.',
}

export default async function AboutPage() {
  const gemachCount = await getGemachCount()

  return (
    <>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6">About GemachFinder</h1>

        <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed">
          <p>
            GemachFinder is a free community directory of gemachs serving Bergen County and nearby
            communities. A gemach is a volunteer-run lending service that provides anything from baby
            gear to medical equipment to interest-free loans, at no cost.
          </p>

          <p>
            The goal is simple: make it easy to find the gemach you need, exactly when you need it.
            No ads. No accounts. No fees.
          </p>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-navy pt-4">How it works</h2>
          <p>
            Every gemach on the site is verified by hand before it goes live. Listings include contact info,
            location, hours, and a short description of what&apos;s available. Contact info can change, so
            please always verify before visiting or calling.
          </p>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-navy pt-4">Contributing</h2>
          <p>
            Know a gemach that&apos;s missing? <Link href="/suggest" className="text-sea hover:text-navy font-semibold underline underline-offset-2">Submit a suggestion</Link>.
            Looking for something the community doesn&apos;t have yet? <Link href="/requests" className="text-sea hover:text-navy font-semibold underline underline-offset-2">Post a request</Link>.
            Every entry is reviewed before being published.
          </p>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-navy pt-4">Credits</h2>
          <p>
            Built and maintained by Noam Small. Data is community-sourced. Categories, hours, and contact
            details come from public listings, shul bulletins, and direct submissions.
          </p>

          <div className="pt-6 border-t border-slate-200 text-sm text-slate-500">
            Currently listing <span className="font-semibold text-navy">{gemachCount}</span> verified gemachs.
          </div>
        </div>
      </main>
      <Footer gemachCount={gemachCount} />
    </>
  )
}
