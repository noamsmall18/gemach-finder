import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Footer from '@/components/Footer'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Privacy - GemachFinder',
  description: 'How GemachFinder handles data and your privacy.',
}

async function getGemachCount(): Promise<number> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { count } = await supabase.from('gemachs').select('*', { count: 'exact', head: true }).eq('verified', true)
  return count || 0
}

export default async function PrivacyPage() {
  const gemachCount = await getGemachCount()

  return (
    <>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6">Privacy</h1>

        <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed">
          <p>
            GemachFinder is a free, community-sourced directory. The site is designed to be used anonymously -
            there are no user accounts, no logins, and nothing you have to sign up for.
          </p>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-navy pt-4">What we store</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-semibold text-navy">Gemach listings</span> - name, location, category, description,
              hours, and contact info, provided by volunteers and community submissions.
            </li>
            <li>
              <span className="font-semibold text-navy">Suggestions and requests</span> - if you submit a new gemach
              or a wishlist request, we store the text of that submission so it can be reviewed.
            </li>
            <li>
              <span className="font-semibold text-navy">Aggregate analytics</span> - we use Plausible, a privacy-first
              analytics tool that does not use cookies and does not track individuals. It counts pageviews in aggregate only.
            </li>
          </ul>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-navy pt-4">What we don&apos;t do</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>No cookies for tracking or advertising.</li>
            <li>No third-party ad networks.</li>
            <li>No selling or sharing of any data.</li>
            <li>No user accounts, passwords, or personal profiles.</li>
          </ul>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-navy pt-4">Contact info on listings</h2>
          <p>
            Phone numbers and addresses shown on gemach listings are submitted by volunteers for community use.
            If you run a gemach and want your info updated or removed, email us and we&apos;ll take care of it.
          </p>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-navy pt-4">Questions</h2>
          <p>
            Privacy questions, corrections, or takedown requests can be sent to the email on the suggestion form.
          </p>
        </div>
      </main>
      <Footer gemachCount={gemachCount} />
    </>
  )
}
