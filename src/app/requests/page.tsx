import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import WishlistSection from '@/components/WishlistSection'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Community Requests - GemachFinder',
  description: 'Vote for the gemachs your community needs most. Submit requests and help decide what to build next.',
}

async function getGemachCount(): Promise<number> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { count } = await supabase.from('gemachs').select('*', { count: 'exact', head: true }).eq('verified', true)
  return count || 0
}

export default async function RequestsPage() {
  const gemachCount = await getGemachCount()

  return (
    <>
      <div className="min-h-[calc(100vh-3.5rem)]">
        <WishlistSection />
      </div>
      <Footer gemachCount={gemachCount} />
    </>
  )
}
