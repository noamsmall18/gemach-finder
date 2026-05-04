import type { Metadata } from 'next'
import { Lora, Nunito } from 'next/font/google'
import Script from 'next/script'
import ScrollNav from '@/components/ScrollNav'
import RootNav from '@/components/RootNav'
import BackToTop from '@/components/BackToTop'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import { siteUrl } from '@/lib/data'
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

const OG_IMAGE = `${siteUrl()}/og?title=${encodeURIComponent('GemachFinder')}&sub=${encodeURIComponent('Free community lending across NY & NJ')}`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: 'GemachFinder - Gemach Directory for Bergen, Passaic & Rockland Counties',
  description:
    'Find free community lending services in Teaneck, Bergenfield, Fair Lawn, Passaic, Spring Valley, and beyond. Baby equipment, medical supplies, clothing, interest-free loans, and more.',
  manifest: '/manifest.json',
  alternates: { canonical: siteUrl() },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GemachFinder',
  },
  openGraph: {
    title: 'GemachFinder - Gemach Directory for Bergen, Passaic & Rockland Counties',
    description:
      'Find free community lending services across Bergen County, Passaic County, and Rockland County. Baby gear, medical equipment, simcha supplies, interest-free loans, and more.',
    url: siteUrl(),
    type: 'website',
    siteName: 'GemachFinder',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'GemachFinder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GemachFinder - Gemach Directory for Bergen, Passaic & Rockland Counties',
    description: 'Find free community lending services across Bergen County, Passaic County, and Rockland County.',
    images: [OG_IMAGE],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  return (
    <html lang="en" id="top" className={`${lora.variable} ${nunito.variable}`}>
      <body className="min-h-screen flex flex-col">
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
        <ScrollNav />
        <RootNav />

        <main className="flex-1">{children}</main>
        <BackToTop />
        <PWAInstallPrompt />
      </body>
    </html>
  )
}
