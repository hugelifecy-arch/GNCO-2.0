export function PartnerStrip() {
  return (
    <section className="w-full bg-bg-primary py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-text-tertiary">
          Powered by industry-leading partners
        </p>

        <div className="grid grid-cols-2 items-center gap-8 opacity-60 md:grid-cols-4">
          <div className="text-center font-sans text-sm text-text-tertiary">
            Carey Olsen
            <div className="mt-1 text-xs text-text-tertiary/60">Legal Partner</div>
          </div>
          <div className="text-center font-sans text-sm text-text-tertiary">
            Alter Domus
            <div className="mt-1 text-xs text-text-tertiary/60">Administration</div>
          </div>
          <div className="text-center font-sans text-sm text-text-tertiary">
            Mercury
            <div className="mt-1 text-xs text-text-tertiary/60">Banking</div>
          </div>
          <div className="text-center font-sans text-sm text-text-tertiary">
            DocuSign
            <div className="mt-1 text-xs text-text-tertiary/60">Execution</div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-text-tertiary">
          All legal opinions provided by licensed counsel. GNCO provides software infrastructure only.
        </p>
      </div>
    </section>
  )
}
