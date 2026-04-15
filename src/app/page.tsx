import { createClient } from '@supabase/supabase-js'
import GemachDirectory from '@/components/GemachDirectory'
import SuggestForm from '@/components/SuggestForm'
import Footer from '@/components/Footer'
import type { Gemach } from '@/lib/types'

async function getGemachs(): Promise<Gemach[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('gemachs')
    .select('*')
    .eq('verified', true)
    .order('name')

  if (error) {
    console.error('Error fetching gemachs:', error)
    return []
  }

  return data || []
}

export default async function Home() {
  const gemachs = await getGemachs()

  return (
    <>
      {/* Hero */}
      <section className="pt-12 pb-8 px-4 text-center bg-gradient-to-b from-cream to-cream/50">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
            Find What You Need.{' '}
            <span className="text-navy">Borrow It Free.</span>
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A community directory of gemachs &mdash; free lending services &mdash; across Bergen County.
            From baby gear to medical equipment, simcha supplies to interest-free loans.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sage" />
            </span>
            {gemachs.length} gemachs across Bergen County
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="px-4 pb-8 -mt-2">
        <div className="max-w-6xl mx-auto">
          <GemachDirectory gemachs={gemachs} />
        </div>
      </section>

      {/* Suggest Form */}
      <SuggestForm />

      {/* Footer */}
      <Footer gemachCount={gemachs.length} />
    </>
  )
}
