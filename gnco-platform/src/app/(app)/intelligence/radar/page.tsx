const sampleAlerts = [
  {
    jurisdiction: 'Luxembourg',
    date: '2026-02-10',
    whatChanged: 'Template update to filing checklist language for reserved alternative funds.',
    whyItMatters: 'Fund launch workstreams may need revised drafting and final sign-off sequencing.',
    checklist: ['Confirm counsel interpretation', 'Update launch task owner list', 'Reconfirm regulator filing package fields'],
    sources: ['CSSF update bulletin (sample)', 'Local counsel note (sample)'],
    lastUpdated: '2026-02-12',
  },
  {
    jurisdiction: 'Singapore',
    date: '2026-02-03',
    whatChanged: 'Expanded FAQ notes on manager substance expectations for selected structures.',
    whyItMatters: 'Teams with lean local operations may need to adjust operating model assumptions.',
    checklist: ['Map current substance footprint', 'Validate board and signatory cadence', 'Confirm service-provider scope'],
    sources: ['MAS FAQ (sample)', 'Administrator operations memo (sample)'],
    lastUpdated: '2026-02-11',
  },
  {
    jurisdiction: 'Cayman Islands',
    date: '2026-01-28',
    whatChanged: 'Updated wording around document retention and designated contact controls.',
    whyItMatters: 'Document vault standards and onboarding checklists may need slight adjustment.',
    checklist: ['Refresh records policy', 'Confirm compliance owner', 'Update onboarding packet language'],
    sources: ['CIMA circular summary (sample)', 'Law firm briefing (sample)'],
    lastUpdated: '2026-02-09',
  },
]

export default function IntelligenceRadarPage() {
  return (
    <main className="space-y-4 p-6 lg:p-8">
      <p className="text-xs uppercase tracking-[0.14em] text-text-tertiary">Module 3 — Intelligence</p>
      <h1 className="font-serif text-3xl text-text-primary">Regulatory Radar</h1>
      <p className="text-sm text-text-secondary">Sample alerts (synthetic)</p>
      <p className="rounded-md border border-bg-border bg-bg-surface p-3 text-xs text-text-tertiary">
        Strict disclaimer: This page is informational only and not legal, tax, regulatory, compliance, or investment advice.
      </p>

      <section className="space-y-4">
        {sampleAlerts.map((alert) => (
          <article key={`${alert.jurisdiction}-${alert.date}`} className="rounded-xl border border-bg-border bg-bg-surface p-5">
            <p className="text-xs text-text-tertiary">{alert.jurisdiction} • {alert.date}</p>
            <h2 className="mt-2 text-lg font-semibold text-text-primary">{alert.whatChanged}</h2>
            <p className="mt-2 text-sm text-text-secondary"><span className="font-medium text-text-primary">Why it matters:</span> {alert.whyItMatters}</p>
            <div className="mt-3 text-sm text-text-secondary">
              <p className="font-medium text-text-primary">Checklist</p>
              <ul className="list-disc space-y-1 pl-5">
                {alert.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-sm text-text-secondary"><span className="font-medium text-text-primary">Sources:</span> {alert.sources.join('; ')}</p>
            <p className="mt-1 text-xs text-text-tertiary">Last updated: {alert.lastUpdated}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
