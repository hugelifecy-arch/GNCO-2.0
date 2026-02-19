import Link from 'next/link'

import { IntakeWizard } from '@/components/architect/IntakeWizard'

export default function ArchitectPage() {
  return (
    <main className="p-8">
      <h1 className="mb-2 text-3xl font-serif">Architect Engine</h1>
      <p className="mb-6 text-sm text-text-secondary">
        <Link href="/architect/structure" className="text-accent-gold">Open Interactive Fund Structure Diagram →</Link>
      </p>
      <IntakeWizard />
    </main>
  )
}
