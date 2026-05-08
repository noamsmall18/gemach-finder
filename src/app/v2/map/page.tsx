import type { Metadata } from 'next'
import GemachMapShell from '@/components/GemachMapShell'
import { getAllGemachs } from '@/lib/data'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Map (Dark) - GemachFinder',
  description: 'Browse verified gemachs on the dark-mode map for Bergen County and nearby communities.',
}

export default async function V2MapPage() {
  const gemachs = await getAllGemachs()

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10">
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
          Gemach Map
        </h1>
        <p className="text-sm sm:text-base text-white/45 mt-2">
          Each pin is a gemach. Zoom in for individual locations, or open a cluster to fan them out.
        </p>
      </div>

      <div
        className="mt-5 rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(2,6,23,0.35)] bg-[#0F172A]"
        style={{ height: 'min(75vh, 680px)' }}
      >
        <GemachMapShell gemachs={gemachs} theme="dark" />
      </div>

      <p className="text-xs text-white/25 mt-3">
        Showing {gemachs.length} verified gemachs.
      </p>
    </section>
  )
}
