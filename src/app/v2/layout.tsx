import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import DarkNavLinks from './DarkNavLinks'
import DarkScrollNav from './DarkScrollNav'
import DarkBackToTop from './DarkBackToTop'

export const metadata: Metadata = {
  title: 'GemachFinder (Dark) - Gemach Directory for Bergen, Passaic & Rockland Counties',
}

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark-mode">
      <DarkScrollNav />
      <nav className="sticky top-0 z-40 bg-[#0B0F1A] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/v2" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="GemachFinder"
              width={36}
              height={36}
              priority
              className="w-9 h-9"
            />
            <span className="font-heading text-xl font-bold text-white">GemachFinder</span>
          </Link>
          <DarkNavLinks />
        </div>
      </nav>

      <main className="flex-1 bg-[#0B0F1A]">{children}</main>
      <DarkBackToTop />
    </div>
  )
}
