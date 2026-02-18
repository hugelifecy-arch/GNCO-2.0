import Link from 'next/link'

export function DisclaimerFooterBar() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 h-9 border-t border-bg-border bg-bg-primary/98">
      <div className="flex h-full items-center justify-between px-6">
        <p className="font-sans text-[11px] text-text-tertiary">
          🎉 Open Beta — Free access during development phase | GNCO is provided for informational purposes only. Not investment, legal, tax, or accounting advice. Verify all outputs with qualified professionals.
        </p>
        <Link href="/disclosures" className="text-[11px] text-text-tertiary transition hover:text-accent-gold">
          Full Disclosures →
        </Link>
      </div>
    </footer>
  )
}
