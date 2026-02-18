'use client'

import { useMemo, useState } from 'react'

import type { CapitalCall } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface CapitalActivityTableProps {
  calls: CapitalCall[]
}

export function CapitalActivityTable({ calls }: CapitalActivityTableProps) {
  const [page, setPage] = useState(1)
  const pageSize = 5

  const rows = useMemo(() => {
    return calls
      .slice()
      .sort((a, b) => +new Date(b.callDate) - +new Date(a.callDate))
      .slice(0, 10)
      .map((row) => ({
        ...row,
        type: /distribution|return/i.test(row.purpose) ? 'Distribution' : 'Call',
      }))
  }, [calls])

  const paged = rows.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))

  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
      <h3 className="mb-4 font-serif text-xl">Capital Activity</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-text-secondary">
            <tr className="border-b border-bg-border">
              <th className="px-3 py-2 font-medium">Fund</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.id} className="border-b border-bg-border/50">
                <td className="px-3 py-3 text-text-primary">{row.fundName}</td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      row.type === 'Call'
                        ? 'bg-accent-amber/15 text-accent-amber'
                        : 'bg-accent-green/15 text-accent-green'
                    }`}
                  >
                    {row.type}
                  </span>
                </td>
                <td className="px-3 py-3">{formatCurrency(row.totalAmount)}</td>
                <td className="px-3 py-3 text-text-secondary">{formatDate(row.callDate)}</td>
                <td className="px-3 py-3 capitalize text-text-secondary">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="rounded border border-bg-border px-3 py-1 disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-text-secondary">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="rounded border border-bg-border px-3 py-1 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  )
}
