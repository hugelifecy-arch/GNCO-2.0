import Link from 'next/link'

import { IntakeWizard } from '@/components/architect/IntakeWizard'

export default function ArchitectPage() {
  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-serif">Architect Engine</h1>
        <Link href="/tools/lp-tax-modeler" className="rounded border border-bg-border px-3 py-2 text-sm">
          Open LP Tax Impact Modeler
        </Link>
      </div>
      <IntakeWizard />
    </main>
  )
}
