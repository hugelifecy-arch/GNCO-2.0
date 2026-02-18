export function WhatsLiveToday() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-serif text-4xl text-text-primary">What’s live today (Open Beta)</h2>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-lg border border-bg-border bg-bg-surface p-6">
          <h3 className="text-xs uppercase tracking-[0.2em] text-accent-green">Live now</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text-secondary">
            <li>Guided Architect intake (8 steps): capture fund type, size, GP domicile, LP base, priorities.</li>
            <li>Coverage library (15 domiciles): directional formation cost + timeline ranges.</li>
            <li>Methodology &amp; Disclosures: how scoring is designed and how to interpret outputs.</li>
          </ul>
        </article>

        <article className="rounded-lg border border-bg-border bg-bg-surface p-6">
          <h3 className="text-xs uppercase tracking-[0.2em] text-accent-gold">Coming soon</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text-secondary">
            <li>Ranked Top 3 structures + explainability (“Why #1”).</li>
            <li>Regulatory Radar alerts.</li>
            <li>Scenario Stress Tester.</li>
            <li>ILPA report generator + export packs.</li>
          </ul>
        </article>
      </div>
    </section>
  )
}
