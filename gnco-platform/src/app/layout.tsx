import type { Metadata } from 'next'
import { AnalyticsProvider } from '@/components/shared/AnalyticsProvider'
import { DisclaimerFooterBar } from '@/components/shared/DisclaimerFooterBar'
import { LayoutNavigation } from '@/components/navigation/LayoutNavigation'
import { LayoutPageFrame } from '@/components/navigation/LayoutPageFrame'
import './globals.css'

export const metadata: Metadata = {
  title: 'GNCO — Global Fund Architect | Model Fund Structures in 15 Jurisdictions',
  description:
    'GNCO gives family offices, GPs, and fund architects the intelligence layer to model, compare, and optimize fund structures across 15 jurisdictions — from Cayman to Luxembourg to Singapore. Free during open beta.',

  openGraph: {
    title: 'GNCO — Global Fund Architect',
    description: 'Model optimal fund structures across 15 jurisdictions in minutes, not months. Free during open beta.',
    url: 'https://gnconew.vercel.app',
    siteName: 'GNCO',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'GNCO Global Fund Architect',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'GNCO — Global Fund Architect',
    description: 'Model fund structures across 15 jurisdictions. Free beta access.',
    images: ['/og-image.svg'],
  },

  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        <AnalyticsProvider />
        <LayoutNavigation />
        <LayoutPageFrame>{children}</LayoutPageFrame>
        <DisclaimerFooterBar />
      </body>
    </html>
  )
}
