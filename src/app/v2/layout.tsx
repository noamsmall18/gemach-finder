import type { Metadata } from 'next'
import Link from 'next/link'
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
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 11.5 7.68 12.07a.5.5 0 0 0 .64 0C13 21.5 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="#5E94B8"/>
                <circle cx="12" cy="10" r="3.5" fill="white"/>
              </svg>
            </div>
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
