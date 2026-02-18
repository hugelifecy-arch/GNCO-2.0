import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import { DisclaimerFooterBar } from '@/components/shared/DisclaimerFooterBar'
import { LayoutNavigation } from '@/components/navigation/LayoutNavigation'
import { LayoutPageFrame } from '@/components/navigation/LayoutPageFrame'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
})

export const metadata: Metadata = {
  title: 'GNCO — Global Fund Architect',
  description: 'Institutional intelligence for fund architecture, operations, and investor reporting workflows.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        <LayoutNavigation />
        <LayoutPageFrame>{children}</LayoutPageFrame>
        <DisclaimerFooterBar />
      </body>
    </html>
  )
}
