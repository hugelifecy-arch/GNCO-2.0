import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | GNCO',
  description: 'Terms of service governing use of GNCO platform during open beta.'
}

const lastUpdated = '2026-02-18'

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-14">
      <h1 className="font-serif text-4xl">Terms of Service</h1>
      <p className="text-sm text-text-secondary">Last updated: {lastUpdated}</p>
      <p className="text-text-secondary">GNCO is an informational software platform. It does not provide legal, tax, or investment advice.</p>
      <ul className="list-disc space-y-2 pl-5 text-text-secondary">
        <li>Use outputs as planning support and validate with qualified counsel.</li>
        <li>Do not upload sensitive personal data unless required for a supported workflow.</li>
        <li>Beta features may change, pause, or be removed without notice.</li>
      </ul>
      <section className="rounded-lg border border-bg-border bg-bg-surface p-4">
        <h2 className="font-semibold">Sources</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
          <li><a className="text-accent-gold" href="https://www.lawinsider.com/resources/contracts/terms-of-service" target="_blank" rel="noreferrer">Industry contract drafting references</a></li>
        </ul>
      </section>
    </main>
  )
}
