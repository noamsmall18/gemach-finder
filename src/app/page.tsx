export const revalidate = 300 // refresh data every 5 minutes

import { createClient } from '@supabase/supabase-js'
import GemachDirectory from '@/components/GemachDirectory'
import Footer from '@/components/Footer'
import AnimatedHero from '@/components/AnimatedHero'
import HeroBackground from '@/components/HeroBackground'
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
    .order('priority', { ascending: false })

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
      <section className="relative min-h-[45vh] sm:min-h-[60vh] md:min-h-[55vh] flex items-center justify-center px-4 text-center overflow-hidden">
        <HeroBackground />
        <AnimatedHero count={gemachs.length} />
      </section>

      <section id="directory" className="px-3 sm:px-4 md:px-6 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto">
          <GemachDirectory gemachs={gemachs} />
        </div>
      </section>

      <Footer gemachCount={gemachs.length} />
    </>
  )
}
