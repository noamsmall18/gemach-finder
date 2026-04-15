import type { Metadata } from 'next'
import { Lora, Nunito } from 'next/font/google'
import ScrollNav from '@/components/ScrollNav'
import BackToTop from '@/components/BackToTop'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GemachFinder - Bergen County Gemach Directory',
  description:
    'Find free community lending services in Teaneck, Bergenfield, Englewood, Fair Lawn and beyond. Baby equipment, medical supplies, clothing, interest-free loans, and more.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GemachFinder',
  },
  openGraph: {
    title: 'GemachFinder - Bergen County Gemach Directory',
    description:
      'Find free community lending services across Bergen County. Baby gear, medical equipment, simcha supplies, interest-free loans, and more.',
    type: 'website',
    siteName: 'GemachFinder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GemachFinder - Bergen County Gemach Directory',
    description: 'Find free community lending services across Bergen County.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" id="top" className={`${lora.variable} ${nunito.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ScrollNav />
        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-white/50 shadow-[0_1px_0_rgba(0,0,0,0.03),0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <a href="#top" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-navy via-navy to-navy-deep flex items-center justify-center shadow-[0_2px_8px_rgba(30,42,94,0.3)] group-hover:shadow-[0_4px_16px_rgba(30,42,94,0.4)] transition-shadow duration-300">
                <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                  <path d="M50 20C35 20 25 32 25 44C25 65 50 82 50 82C50 82 75 65 75 44C75 32 65 20 50 20Z" fill="#D4A017" opacity="0.95"/>
                  <path d="M50 32C43 32 36 38 36 46C36 58 50 70 50 70C50 70 64 58 64 46C64 38 57 32 50 32Z" fill="white" opacity="0.9"/>
                </svg>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/10" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-[22px] font-bold text-navy tracking-tight">GemachFinder</span>
                <span className="text-[10px] text-navy/30 hidden sm:inline font-bold tracking-[0.15em] uppercase">Bergen County</span>
              </div>
            </a>
            <a
              href="#suggest"
              className="text-sm font-bold text-navy bg-gold/10 hover:bg-gold/20 px-5 py-2 rounded-full border border-gold/25 hover:border-gold/40 transition-all duration-300 hover:shadow-[0_2px_12px_rgba(201,151,26,0.15)]"
            >
              <span className="hidden sm:inline">+ Suggest a Gemach</span>
              <span className="sm:hidden">+ Suggest</span>
            </a>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">{children}</main>
        <BackToTop />
      </body>
    </html>
  )
}
