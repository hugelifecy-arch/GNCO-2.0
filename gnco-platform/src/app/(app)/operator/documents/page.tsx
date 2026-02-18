import { DocumentVault } from '@/components/operator/DocumentVault'
import { ComingSoonButton } from '@/components/shared/ComingSoonButton'

export default function DocumentsPage() {
  return (
    <main className="space-y-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Document Vault</h1>
        <div className="flex items-center gap-2">
          <span className="rounded border border-bg-border bg-bg-surface px-3 py-1 text-sm text-text-secondary">Storage Used: 18.3 GB / 100 GB</span>
          <ComingSoonButton className="border-accent-gold/40 bg-accent-gold/10 text-accent-gold">Upload Document (coming soon)</ComingSoonButton>
        </div>
      </header>

      <DocumentVault />
    </main>
  )
}
