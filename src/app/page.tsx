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
      <section className="relative pt-14 pb-10 px-4 text-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-white pointer-events-none" />
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-gold/[0.04] to-transparent rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/5 text-navy text-xs font-medium mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sage" />
            </span>
            {gemachs.length} gemachs across Bergen County
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-slate-800 leading-[1.15] tracking-tight">
            Find What You Need.{' '}
            <span className="text-navy">Borrow It Free.</span>
          </h1>
          <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A community directory of gemachs &mdash; free lending services &mdash; across Bergen County.
            From baby gear to medical equipment, simcha supplies to interest-free loans.
          </p>
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
