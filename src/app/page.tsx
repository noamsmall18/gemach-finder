import { createClient } from '@supabase/supabase-js'
import GemachDirectory from '@/components/GemachDirectory'
import SuggestForm from '@/components/SuggestForm'
import WishlistSection from '@/components/WishlistSection'
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
      {/* Hero - full viewport landing */}
      <section className="relative min-h-[85vh] md:min-h-[80vh] flex items-center justify-center px-4 text-center overflow-hidden">
        <HeroBackground />
        <AnimatedHero count={gemachs.length} />
      </section>

      {/* Directory */}
      <section id="directory" className="px-4 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <GemachDirectory gemachs={gemachs} />
        </div>
      </section>

      {/* Community Wishlist */}
      <WishlistSection />

      {/* Suggest Form */}
      <SuggestForm />

      {/* Footer */}
      <Footer gemachCount={gemachs.length} />
    </>
  )
}
