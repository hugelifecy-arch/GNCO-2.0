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
          By using GNCO during the open beta period, you agree to these terms and any updates posted on this page.
        </p>

        <section className="space-y-3 text-text-secondary">
          <h2 className="font-serif text-2xl text-text-primary">Beta Access Commitment</h2>
          <p>
            Users who create an account and use GNCO during the open beta will receive free lifetime access to GNCO core
            features, even after paid plans launch.
          </p>
          <p>
            This commitment applies to core feature access only and does not include future premium, enterprise, or
            add-on services that may be introduced separately.
          </p>
        </section>

        <p className="text-text-secondary">
          Questions about these terms can be sent to contact@gnco.io.
        </p>

        <Link href="/" className="inline-block text-accent-gold transition hover:text-accent-gold-light">
          Back to Home
        </Link>
      </main>
      <MarketingFooter />
    </>
  )
}
