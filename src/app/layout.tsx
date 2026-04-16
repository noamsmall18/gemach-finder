import type { Metadata } from 'next'
import { Lora, Nunito } from 'next/font/google'
import ScrollNav from '@/components/ScrollNav'
import RootNav from '@/components/RootNav'
import BackToTop from '@/components/BackToTop'
import ThemeRedirect from '@/components/ThemeRedirect'
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
        <ThemeRedirect />
        <ScrollNav />
        <RootNav />

        <main className="flex-1">{children}</main>
        <BackToTop />
      </body>
    </html>
  )
}
