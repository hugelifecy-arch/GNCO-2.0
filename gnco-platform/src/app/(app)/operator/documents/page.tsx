'use client'

import { FileText } from 'lucide-react'

import { DemoDataToggle } from '@/components/DemoDataToggle'
import { DemoDatasetBadge } from '@/components/DemoDatasetBadge'
import { DocumentVault } from '@/components/operator/DocumentVault'
import { EmptyState } from '@/components/shared/EmptyState'
import { useDemoMode } from '@/hooks/useDemoMode'

export default function DocumentsPage() {
  const { mode, setMode } = useDemoMode()
  const hasSampleData = mode === 'sample'

  return (
    <main className="space-y-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-3xl">Document Vault</h1>
          <DemoDatasetBadge />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DemoDataToggle mode={mode} onChange={setMode} />
          <span className="rounded border border-bg-border bg-bg-surface px-3 py-1 text-sm text-text-secondary">
            Storage Used: {hasSampleData ? '18.3 GB / 100 GB' : '0 GB / 100 GB'}
          </span>
          <button className="rounded border border-accent-gold/40 bg-accent-gold/10 px-4 py-2 text-sm text-accent-gold">
            Upload Document (Demo)
          </button>
        </div>
      </header>

      {hasSampleData ? (
        <DocumentVault demoMode={mode} />
      ) : (
        <EmptyState
          icon={FileText}
          message="No documents loaded in Start empty mode."
          actionLabel="Load sample data"
          onAction={() => setMode('sample')}
        />
      )}
    </main>
  )
}
