import type { FundDocument } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface RecentDocumentsProps {
  documents: FundDocument[]
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
      <h3 className="mb-4 font-serif text-xl">Recent Documents</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-bg-border text-text-secondary">
              <th className="px-3 py-2">Document Name</th>
              <th className="px-3 py-2">Fund</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-bg-border/50">
                <td className="px-3 py-3">{doc.name}</td>
                <td className="px-3 py-3 text-text-secondary">{doc.fundName}</td>
                <td className="px-3 py-3 capitalize text-text-secondary">{doc.category.replace('-', ' ')}</td>
                <td className="px-3 py-3 text-text-secondary">{formatDate(doc.uploadedDate)}</td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    className="rounded border border-accent-gold/30 px-3 py-1 text-xs text-accent-gold hover:bg-accent-gold/10"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
