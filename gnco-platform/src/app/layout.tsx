import type { Metadata } from 'next'
import { AnalyticsProvider } from '@/components/shared/AnalyticsProvider'
import { DisclaimerFooterBar } from '@/components/shared/DisclaimerFooterBar'
import { LayoutNavigation } from '@/components/navigation/LayoutNavigation'
import { LayoutPageFrame } from '@/components/navigation/LayoutPageFrame'
import './globals.css'

export const metadata: Metadata = {
codex/create-favicon-and-add-ilpa-link
  title: 'GNCO — Global Fund Architect',
  description: 'Institutional intelligence for fund architecture, operations, and investor reporting workflows.',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',

  title: 'GNCO — Global Fund Architect | Institutional Fund Structure Modeling',
  description:
    'Model, compare, and optimize fund structures across 15 jurisdictions. Built for family offices, GPs, and fund architects. Free during open beta.',
  openGraph: {
    title: 'GNCO — Global Fund Architect',
    description: 'Model optimal fund structures across 15 jurisdictions in minutes, not months.',
    url: 'https://gnconew.vercel.app',
    images: [
      {
        url: 'https://gnconew.vercel.app/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'GNCO — Global Fund Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GNCO — Global Fund Architect',
    description: 'Model optimal fund structures across 15 jurisdictions in minutes, not months.',
    images: ['https://gnconew.vercel.app/og-image.svg'],
 main
  },
}

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
