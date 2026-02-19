import type { Metadata } from 'next'
import { AnalyticsProvider } from '@/components/shared/AnalyticsProvider'
import { DisclaimerFooterBar } from '@/components/shared/DisclaimerFooterBar'
import { LayoutNavigation } from '@/components/navigation/LayoutNavigation'
import { LayoutPageFrame } from '@/components/navigation/LayoutPageFrame'
import './globals.css'

export const metadata: Metadata = {
  title: 'GNCO — Global Fund Architect',
  description: 'Institutional intelligence for fund architecture, operations, and investor reporting workflows.',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
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
