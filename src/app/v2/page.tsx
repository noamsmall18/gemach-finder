import V2Directory from './V2Directory'
import { getAllGemachs } from '@/lib/data'

export default async function V2Page() {
  const gemachs = await getAllGemachs()
  return <V2Directory gemachs={gemachs} />
}
