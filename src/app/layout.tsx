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
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="#top" className="flex items-baseline gap-2">
              <span className="font-heading text-xl font-bold text-navy">GemachFinder</span>
              <span className="text-xs text-slate-400 hidden sm:inline">Bergen County</span>
            </a>
            <a
              href="#suggest"
              className="text-sm font-medium text-gold hover:text-gold-bright transition-colors"
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
