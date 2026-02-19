import Link from 'next/link'

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-bg-border bg-bg-primary py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-serif text-4xl text-text-primary">Pricing</h2>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-accent-gold/40 bg-bg-elevated p-8 shadow-[0_0_0_1px_rgba(212,175,55,0.08)]">
          <p className="inline-flex rounded-full border border-accent-green/30 bg-accent-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-green">
            Open Beta
          </p>
          <h3 className="mt-5 font-serif text-3xl text-text-primary">Open Beta</h3>
          <p className="mt-2 text-4xl font-semibold text-accent-gold">Free</p>
          <p className="mt-4 text-text-secondary">
            No credit card required. Full platform access during development.
          </p>
          <ul className="mt-6 space-y-3 text-text-secondary">
            <li>✓ Full Architect Engine (15 jurisdictions)</li>
            <li>✓ All 52 fund templates</li>
            <li>✓ LP registry &amp; capital call manager</li>
            <li>✓ ILPA-aligned reporting</li>
            <li>✓ Free lifetime access to core features at launch</li>
          </ul>
          <Link
            href="/architect"
            className="mt-8 inline-block rounded-sm bg-accent-gold px-6 py-3 text-base font-semibold text-bg-primary transition hover:bg-accent-gold-light"
          >
            Start Free →
          </Link>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-text-tertiary">
          Paid plans launching Q3 2026. Beta users receive free lifetime access to core features.{' '}
          <Link href="/disclosures" className="text-accent-gold transition hover:text-accent-gold-light">
            See full terms →
          </Link>
        </p>
      </div>
    </section>
  )
}
