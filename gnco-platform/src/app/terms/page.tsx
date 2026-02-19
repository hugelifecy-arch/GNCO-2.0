import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingFooter } from '@/components/landing/MarketingFooter'

export const metadata: Metadata = {
  title: 'Terms of Service | GNCO',
  description: 'Terms of Service information for GNCO.',
}

export default function TermsPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-14">
        <h1 className="font-serif text-4xl">Terms of Service</h1>
        <p className="text-text-secondary">
          This page is being finalized. Please contact contact@gnco.io for the current version.
        </p>
        <Link href="/" className="inline-block text-accent-gold transition hover:text-accent-gold-light">
          Back to Home
        </Link>
      </main>
      <MarketingFooter />
    </>
  )
}
