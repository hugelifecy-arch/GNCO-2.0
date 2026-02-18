export function CredibilityStrip() {
  return (
    <section className="w-full border-y border-bg-border bg-bg-surface py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-text-tertiary">Designed for teams evaluating fund setup options</p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {['Single Family Office', 'Multi-Family Office', 'Private Equity GP', 'Real Assets Fund', 'Endowment & Foundation'].map((type) => (
            <span
              key={type}
              className="rounded-full border border-bg-border px-5 py-2 font-sans text-sm text-text-secondary transition-all duration-200 hover:border-accent-gold/30 hover:text-text-primary"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
