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
      <section className="relative pt-14 pb-14 md:pt-20 md:pb-16 px-4 text-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-cream-dark/50 pointer-events-none" />

        {/* Large radial glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-gold/[0.06] via-gold/[0.02] to-transparent rounded-full pointer-events-none" />
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-gradient-radial from-navy/[0.04] to-transparent rounded-full pointer-events-none hidden md:block" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-gradient-radial from-sage/[0.04] to-transparent rounded-full pointer-events-none hidden md:block" />

        {/* Decorative grid dots (desktop only) */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{
          backgroundImage: 'radial-gradient(circle, rgba(30,42,94,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative max-w-3xl mx-auto">
          <HeroBadge count={gemachs.length} />

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold leading-[1.08] tracking-tight">
            <span className="text-slate-800">Find What You Need.</span>
            <br />
            <span className="bg-gradient-to-r from-navy via-navy-light to-navy bg-clip-text text-transparent">Borrow It Free.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
            The community directory of gemachs across Bergen County.
            Baby gear, medical equipment, simcha supplies, interest-free loans, and more.
          </p>
        </div>
      </section>

      {/* Directory */}
      <section className="px-4 sm:px-6 pb-10 -mt-2">
        <div className="max-w-7xl mx-auto">
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
