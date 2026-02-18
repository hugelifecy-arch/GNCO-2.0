'use client'

import { useMemo, useState } from 'react'

import { StatusBadge } from '@/components/shared/StatusBadge'
import { MOCK_DOCUMENTS } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

const categoryKeys = ['all', 'formation', 'lp-agreement', 'financial', 'capital-activity', 'regulatory', 'correspondence'] as const

type DemoMode = 'sample' | 'empty'

const auditEntries = Array.from({ length: 20 }).map((_, index) => ({
  user: ['A. Morgan', 'J. Patel', 'Compliance Bot', 'L. Chen'][index % 4],
  action: ['Viewed', 'Downloaded', 'Shared'][index % 3],
  document: MOCK_DOCUMENTS[index % MOCK_DOCUMENTS.length]?.name ?? 'Document',
  timestamp: new Date(Date.now() - index * 1000 * 60 * 42).toISOString(),
  ip: `203.0.113.${20 + index}`,
}))

interface DocumentVaultProps {
  demoMode?: DemoMode
}

export function DocumentVault({ demoMode = 'sample' }: DocumentVaultProps) {
  const [category, setCategory] = useState<(typeof categoryKeys)[number]>('all')
  const [gridMode, setGridMode] = useState(true)
  const [auditOpen, setAuditOpen] = useState(true)

  const documents = useMemo(() => (demoMode === 'sample' ? MOCK_DOCUMENTS : []), [demoMode])

  const categories = useMemo(
    () => [
      { key: 'all', label: `All Documents (${documents.length})` },
      { key: 'formation', label: `Formation (${documents.filter((doc) => doc.category === 'formation').length})` },
      { key: 'lp-agreement', label: `LP Agreements (${documents.filter((doc) => doc.category === 'lp-agreement').length})` },
      { key: 'financial', label: `Financial Reports (${documents.filter((doc) => doc.category === 'financial').length})` },
      { key: 'capital-activity', label: `Capital Activity (${documents.filter((doc) => doc.category === 'capital-activity').length})` },
      { key: 'regulatory', label: `Regulatory (${documents.filter((doc) => doc.category === 'regulatory').length})` },
      { key: 'correspondence', label: `Correspondence (${documents.filter((doc) => doc.category === 'correspondence').length})` },
    ],
    [documents]
  )

  const rows = useMemo(
    () =>
      documents
        .filter((doc) => category === 'all' || doc.category === category)
        .sort((a, b) => +new Date(b.uploadedDate) - +new Date(a.uploadedDate)),
    [category, documents]
  )

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const days = (+new Date(expiryDate) - Date.now()) / (1000 * 60 * 60 * 24)
    return days <= 30
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-lg border border-bg-border bg-bg-surface p-4">
          <h3 className="mb-3 font-serif text-lg">Categories</h3>
          <nav className="space-y-1">
            {categories.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setCategory(item.key as (typeof categoryKeys)[number])}
                className={`w-full rounded px-3 py-2 text-left text-sm ${category === item.key ? 'bg-accent-gold/15 text-accent-gold' : 'hover:bg-bg-elevated'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <button type="button" className="rounded border border-bg-border px-3 py-1.5 text-sm" onClick={() => setGridMode(true)}>Grid</button>
            <button type="button" className="rounded border border-bg-border px-3 py-1.5 text-sm" onClick={() => setGridMode(false)}>List</button>
          </div>
          <div className={gridMode ? 'grid gap-3 md:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
            {rows.map((doc) => (
              <article key={doc.id} className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <p className="text-xs uppercase text-text-secondary">{doc.fileType}</p>
                <h4 className="mt-1 text-sm">{doc.name}</h4>
                <p className="mt-1 text-xs text-text-secondary">{doc.fundName}</p>
                <p className="mt-2 text-xs text-text-secondary">{formatDate(doc.uploadedDate)} • v{doc.version} • {doc.fileSize}</p>
                {isExpiringSoon(doc.expiryDate) ? <div className="mt-2"><StatusBadge status="pending" label="Expiry Warning" /></div> : null}
                <div className="mt-3 flex flex-wrap gap-1 text-xs">
                  {['View', 'Download', 'Share', 'Version History'].map((action) => (
                    <button key={action} className="rounded border border-bg-border px-2 py-1">{action} (Demo)</button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-lg border border-bg-border bg-bg-surface p-4">
        <button type="button" className="mb-1 text-left font-serif text-lg" onClick={() => setAuditOpen((prev) => !prev)}>
          Recent Access Activity {auditOpen ? '▾' : '▸'}
        </button>
        <p className="mb-3 text-xs text-text-tertiary">Synthetic activity log (demo)</p>
        {auditOpen ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-bg-border text-text-secondary">
                <tr><th className="px-2 py-2">User</th><th className="px-2 py-2">Action</th><th className="px-2 py-2">Document</th><th className="px-2 py-2">Timestamp</th><th className="px-2 py-2">IP</th></tr>
              </thead>
              <tbody>
                {auditEntries.map((entry, index) => (
                  <tr key={`${entry.timestamp}-${index}`} className="border-b border-bg-border/30">
                    <td className="px-2 py-2">{entry.user}</td><td className="px-2 py-2">{entry.action}</td><td className="px-2 py-2">{entry.document}</td><td className="px-2 py-2">{formatDate(entry.timestamp, 'long')}</td><td className="px-2 py-2">{entry.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </section>
  )
}
