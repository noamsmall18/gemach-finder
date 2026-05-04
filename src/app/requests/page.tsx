import type { Metadata } from 'next'
import WishlistSection from '@/components/WishlistSection'
import Footer from '@/components/Footer'
import { getGemachCount } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Community Requests - GemachFinder',
  description: 'Vote for the gemachs your community needs most. Submit requests and help decide what to build next.',
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
