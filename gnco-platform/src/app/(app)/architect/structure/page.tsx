import { FundStructureDiagram } from '@/components/architect/FundStructureDiagram'

export default function ArchitectStructurePage() {
  return (
    <main className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-serif">Interactive Fund Structure Diagram</h1>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">Build and export attorney-ready entity maps with node-level legal/tax metadata and flow overlays.</p>
      </header>
      <FundStructureDiagram />
    </main>
  )
}
