import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GNCO Platform',
  description: 'Institutional fund structuring and operations platform by GNCO.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
