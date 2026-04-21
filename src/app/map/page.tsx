import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import GemachMapShell from '@/components/GemachMapShell'
import Footer from '@/components/Footer'
import type { Gemach } from '@/lib/types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Map - GemachFinder',
  description: 'Browse verified gemachs on a map of Bergen, Passaic, and Rockland Counties.',
}

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

export default async function MapPage() {
  const gemachs = await getGemachs()

  return (
    <>
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-6 pb-3">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-navy">
          Gemach Map
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          Each pin is a gemach. Zoom in to see individual locations, or click a cluster to expand it.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-10">
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100" style={{ height: 'min(75vh, 680px)' }}>
          <GemachMapShell gemachs={gemachs} />
        </div>
      </section>

      <Footer gemachCount={gemachs.length} />
    </>
  )
}
