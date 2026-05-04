import type { Metadata } from 'next'
import SuggestForm from '@/components/SuggestForm'
import Footer from '@/components/Footer'
import { getGemachCount } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Suggest a Gemach - GemachFinder',
  description: 'Know a gemach we\'re missing? Help us grow the directory by submitting a suggestion.',
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
