import { createClient } from '@supabase/supabase-js'
import V2Directory from './V2Directory'
import type { Gemach } from '@/lib/types'

async function getGemachs(): Promise<Gemach[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.from('gemachs').select('*').eq('verified', true).order('priority', { ascending: false })
  return data || []
}

export default async function V2Page() {
  const gemachs = await getGemachs()
  return <V2Directory gemachs={gemachs} />
}
