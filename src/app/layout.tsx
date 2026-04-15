import type { Metadata } from 'next'
import { Lora, Nunito } from 'next/font/google'
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
  openGraph: {
    title: 'GemachFinder - Bergen County Gemach Directory',
    description:
      'Find free community lending services across Bergen County. Baby gear, medical equipment, simcha supplies, interest-free loans, and more.',
    type: 'website',
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
        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="#top" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-navy to-navy-deep flex items-center justify-center shadow-sm">
                <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
                  <path d="M50 20C35 20 25 32 25 44C25 65 50 82 50 82C50 82 75 65 75 44C75 32 65 20 50 20Z" fill="#D4A017" opacity="0.9"/>
                  <path d="M50 32C43 32 36 38 36 46C36 58 50 70 50 70C50 70 64 58 64 46C64 38 57 32 50 32Z" fill="white"/>
                </svg>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-xl font-bold text-navy">GemachFinder</span>
                <span className="text-[11px] text-slate-400 hidden sm:inline font-medium tracking-wide">Bergen County</span>
              </div>
            </a>
            <a
              href="#suggest"
              className="text-sm font-semibold text-gold hover:text-gold-bright transition-colors px-4 py-1.5 rounded-full border border-gold/20 hover:border-gold/40 hover:bg-gold/5"
            >
              + Suggest a Gemach
            </a>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
