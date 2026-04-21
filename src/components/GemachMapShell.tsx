'use client'

import dynamic from 'next/dynamic'
import type { Gemach } from '@/lib/types'

const GemachMap = dynamic(() => import('./GemachMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500">
      Loading map...
    </div>
  ),
})

export default function GemachMapShell({ gemachs }: { gemachs: Gemach[] }) {
  return <GemachMap gemachs={gemachs} />
}
