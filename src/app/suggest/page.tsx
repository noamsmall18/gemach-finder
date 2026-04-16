import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import SuggestForm from '@/components/SuggestForm'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Suggest a Gemach - GemachFinder',
  description: 'Know a gemach we\'re missing? Help us grow the Bergen County directory by submitting a suggestion.',
}

async function getGemachCount(): Promise<number> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { count } = await supabase.from('gemachs').select('*', { count: 'exact', head: true }).eq('verified', true)
  return count || 0
}

export default async function SuggestPage() {
  const gemachCount = await getGemachCount()

  return (
    <>
      <div className="min-h-[calc(100vh-3.5rem)]">
        <SuggestForm />
      </div>
      <Footer gemachCount={gemachCount} />
    </>
  )
}
