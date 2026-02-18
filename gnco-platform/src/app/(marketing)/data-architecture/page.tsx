import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Architecture | GNCO',
  description: 'High-level overview of GNCO data architecture and environment handling.'
}

const lastUpdated = '2026-02-18'

export default function DataArchitecturePage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-14">
      <h1 className="font-serif text-4xl">Data Architecture</h1>
      <p className="text-sm text-text-secondary">Last updated: {lastUpdated}</p>
      <p className="text-text-secondary">GNCO separates marketing pages, authenticated app modules, and API endpoints with scoped access patterns.</p>
      <ul className="list-disc space-y-2 pl-5 text-text-secondary">
        <li>Application UI: Next.js App Router, server-rendered route groups for marketing and app modules.</li>
        <li>Persistence layer: Prisma ORM model with provider-backed database connections.</li>
        <li>Access controls: staged rollout in beta; role controls are coming soon.</li>
      </ul>
      <section className="rounded-lg border border-bg-border bg-bg-surface p-4">
        <h2 className="font-semibold">Sources</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
          <li><a className="text-accent-gold" href="https://nextjs.org/docs/app" target="_blank" rel="noreferrer">Next.js App Router documentation</a></li>
          <li><a className="text-accent-gold" href="https://www.prisma.io/docs/orm" target="_blank" rel="noreferrer">Prisma ORM documentation</a></li>
        </ul>
      </section>
    </main>
  )
}
