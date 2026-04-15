import { createClient } from '@supabase/supabase-js'
import GemachDirectory from '@/components/GemachDirectory'
import SuggestForm from '@/components/SuggestForm'
import Footer from '@/components/Footer'
import HeroBadge from '@/components/HeroBadge'
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
      <section className="relative pt-16 pb-12 px-4 text-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-radial from-gold/[0.05] to-transparent rounded-full pointer-events-none" />
        <div className="absolute top-20 right-[10%] w-[300px] h-[300px] bg-gradient-radial from-navy/[0.03] to-transparent rounded-full pointer-events-none" />

        {/* Floating decorative emojis */}
        <div className="absolute top-8 left-[8%] text-2xl opacity-[0.08] select-none pointer-events-none hidden md:block">🏥</div>
        <div className="absolute top-16 right-[12%] text-3xl opacity-[0.06] select-none pointer-events-none hidden md:block">👶</div>
        <div className="absolute bottom-8 left-[15%] text-2xl opacity-[0.07] select-none pointer-events-none hidden md:block">🎉</div>
        <div className="absolute bottom-12 right-[8%] text-xl opacity-[0.06] select-none pointer-events-none hidden md:block">💰</div>

        <div className="relative max-w-3xl mx-auto">
          <HeroBadge count={gemachs.length} />
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-slate-800 leading-[1.12] tracking-tight">
            Find What You Need.{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-navy to-navy-light bg-clip-text text-transparent">Borrow It Free.</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The community directory of gemachs across Bergen County.
            Baby gear, medical equipment, simcha supplies, interest-free loans, and more.
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
