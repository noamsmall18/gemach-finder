import type { Metadata } from 'next'
import { Lora, Nunito } from 'next/font/google'
import Link from 'next/link'
import ScrollNav from '@/components/ScrollNav'
import NavLinks from '@/components/NavLinks'
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
  title: 'GemachFinder - Gemach Directory for Bergen, Passaic & Rockland Counties',
  description:
    'Find free community lending services in Teaneck, Bergenfield, Fair Lawn, Passaic, Monsey and beyond. Baby equipment, medical supplies, clothing, interest-free loans, and more.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GemachFinder',
  },
  openGraph: {
    title: 'GemachFinder - Gemach Directory for Bergen, Passaic & Rockland Counties',
    description:
      'Find free community lending services across Bergen County, Passaic County, and Rockland County. Baby gear, medical equipment, simcha supplies, interest-free loans, and more.',
    type: 'website',
    siteName: 'GemachFinder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GemachFinder - Gemach Directory for Bergen, Passaic & Rockland Counties',
    description: 'Find free community lending services across Bergen County, Passaic County, and Rockland County.',
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
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 11.5 7.68 12.07a.5.5 0 0 0 .64 0C13 21.5 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="#C9971A"/>
                  <circle cx="12" cy="10" r="3.5" fill="white"/>
                </svg>
              </div>
              <span className="font-heading text-xl font-bold text-navy">GemachFinder</span>
            </Link>

            <NavLinks />
          </div>
        </nav>

        <main className="flex-1">{children}</main>
        <BackToTop />
      </body>
    </html>
  )
}
