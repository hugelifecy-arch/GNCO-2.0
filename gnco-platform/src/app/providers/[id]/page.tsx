import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SERVICE_PROVIDERS } from '@/data/service-providers'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'

export default function ProviderProfilePage({ params }: { params: { id: string } }) {
  const provider = SERVICE_PROVIDERS.find((item) => item.id === params.id)
  if (!provider) {
    notFound()
  }

  const jurisdictionNames = provider.jurisdictions
    .map((id) => JURISDICTIONS.find((jurisdiction) => jurisdiction.id === id)?.name ?? id)
    .join(', ')

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-14">
      <Link href="/providers" className="text-sm text-accent-gold">← Back to directory</Link>

      <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-secondary">{provider.type}</p>
            <h1 className="mt-1 font-serif text-4xl">{provider.name}</h1>
            <p className="mt-3 text-sm text-text-secondary">{provider.description}</p>
          </div>
          <div className="space-y-2 text-xs">
            {provider.gnco_verified ? <p className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-400">GNCO Verified</p> : null}
            {provider.featured ? <p className="rounded-full bg-accent-gold/20 px-3 py-1 text-accent-gold">Featured Placement</p> : null}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 text-sm text-text-secondary md:grid-cols-2">
          <div>
            <dt className="font-medium text-text-primary">Jurisdictions served</dt>
            <dd>{jurisdictionNames}</dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">Fund types</dt>
            <dd>{provider.fund_types.join(', ')}</dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">Indicative fees</dt>
            <dd>{provider.fee_range}</dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">Typical response time</dt>
            <dd>{provider.response_time}</dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">Website</dt>
            <dd><a href={provider.website} target="_blank" rel="noreferrer" className="text-accent-gold">{provider.website}</a></dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">Contact</dt>
            <dd><a href={`mailto:${provider.contact_email}`} className="text-accent-gold">{provider.contact_email}</a></dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
