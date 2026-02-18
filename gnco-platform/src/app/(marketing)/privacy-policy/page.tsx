import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | GNCO',
  description: 'Privacy policy for GNCO open beta platform usage and data handling.'
}

const lastUpdated = '2026-02-18'

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-14">
      <h1 className="font-serif text-4xl">Privacy Policy</h1>
      <p className="text-sm text-text-secondary">Last updated: {lastUpdated}</p>
      <p className="text-text-secondary">GNCO collects account, usage, and workflow data required to run the product and improve model quality during beta.</p>
      <ul className="list-disc space-y-2 pl-5 text-text-secondary">
        <li>We store submitted form inputs, generated recommendations, and audit events.</li>
        <li>We do not sell personal data.</li>
        <li>You may request deletion of beta account records by contacting support.</li>
      </ul>
      <section className="rounded-lg border border-bg-border bg-bg-surface p-4">
        <h2 className="font-semibold">Sources</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
          <li><a className="text-accent-gold" href="https://gdpr.eu/what-is-gdpr/" target="_blank" rel="noreferrer">GDPR overview</a></li>
          <li><a className="text-accent-gold" href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noreferrer">CCPA overview</a></li>
        </ul>
      </section>
    </main>
  )
}
