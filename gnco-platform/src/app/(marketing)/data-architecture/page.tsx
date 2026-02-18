export default function DataArchitecturePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="font-serif text-4xl text-text-primary">Data Architecture</h1>
      <p className="mt-2 text-sm text-text-tertiary">Last updated: February 18, 2026</p>
      <div className="prose prose-invert mt-8 max-w-none text-sm text-text-secondary">
        <p>GNCO separates product metadata, synthetic demo records, and customer-provided content by environment.</p>
        <p>Open beta pages indicate demo datasets where synthetic records are displayed.</p>
        <p>Security and retention controls are evolving as production architecture is finalized.</p>
      </div>
    </main>
  )
}
