'use client'

import { useMemo, useState } from 'react'

import { StatusBadge } from '@/components/shared/StatusBadge'
import type { LPEntry } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface LPRegistryTableProps {
  data: LPEntry[]
  search: string
  filters: {
    entityType: string
    domicile: string
    kycStatus: string
    commitmentRange: string
  }
}

type SortKey = 'commitmentAmount' | 'calledCapital' | 'domicile'

const flags: Record<string, string> = {
  'United States': '🇺🇸',
  Germany: '🇩🇪',
  'United Arab Emirates': '🇦🇪',
  Singapore: '🇸🇬',
  'Cayman Islands': '🇰🇾',
  Japan: '🇯🇵',
  Netherlands: '🇳🇱',
  Canada: '🇨🇦',
  'Saudi Arabia': '🇸🇦',
}

export function LPRegistryTable({ data, search, filters }: LPRegistryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('commitmentAmount')
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [activeLP, setActiveLP] = useState<LPEntry | null>(null)

  const rows = useMemo(() => {
    const filtered = data.filter((lp) => {
      const bySearch =
        lp.legalName.toLowerCase().includes(search.toLowerCase()) ||
        lp.relationshipManager.toLowerCase().includes(search.toLowerCase())
      const byEntity = filters.entityType === 'all' || lp.entityType === filters.entityType
      const byDomicile = filters.domicile === 'all' || lp.domicile === filters.domicile
      const byKyc = filters.kycStatus === 'all' || lp.kycStatus === filters.kycStatus
      const byCommitment =
        filters.commitmentRange === 'all' ||
        (filters.commitmentRange === 'under-25m' && lp.commitmentAmount < 25_000_000) ||
        (filters.commitmentRange === '25m-75m' && lp.commitmentAmount >= 25_000_000 && lp.commitmentAmount <= 75_000_000) ||
        (filters.commitmentRange === '75m-plus' && lp.commitmentAmount > 75_000_000)

      return bySearch && byEntity && byDomicile && byKyc && byCommitment
    })

    return filtered.sort((a, b) => {
      const modifier = sortAsc ? 1 : -1
      if (sortKey === 'domicile') {
        return a.domicile.localeCompare(b.domicile) * modifier
      }
      return (a[sortKey] - b[sortKey]) * modifier
    })
  }, [data, filters, search, sortAsc, sortKey])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev)
    } else {
      setSortKey(key)
      setSortAsc(key === 'domicile')
    }
  }

  const allSelected = rows.length > 0 && selected.length === rows.length

  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className="rounded border border-bg-border px-3 py-1 text-sm">
          Export Selected
        </button>
        <button type="button" className="rounded border border-bg-border px-3 py-1 text-sm">
          Send Notice
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-bg-border text-text-secondary">
            <tr>
              <th className="px-2 py-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) =>
                    setSelected(event.target.checked ? rows.map((lp) => lp.id) : [])
                  }
                />
              </th>
              <th className="px-3 py-2">LP Name</th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort('domicile')}>Domicile</th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort('commitmentAmount')}>Commitment</th>
              <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort('calledCapital')}>Called Capital</th>
              <th className="px-3 py-2">Distributions</th>
              <th className="px-3 py-2">KYC Status</th>
              <th className="px-3 py-2">Subscription</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lp) => {
              const calledPct = Math.min(100, (lp.calledCapital / lp.commitmentAmount) * 100)
              return (
                <tr
                  key={lp.id}
                  className="cursor-pointer border-b border-bg-border/40 hover:bg-bg-elevated/40"
                  onClick={() => setActiveLP(lp)}
                >
                  <td className="px-2 py-3" onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.includes(lp.id)}
                      onChange={(event) =>
                        setSelected((prev) =>
                          event.target.checked ? [...prev, lp.id] : prev.filter((id) => id !== lp.id)
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-3">
                    <p>{lp.legalName}</p>
                    <span className="mt-1 inline-block rounded bg-bg-elevated px-2 py-0.5 text-xs capitalize text-text-secondary">
                      {lp.entityType.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-3">{flags[lp.domicile] ?? '🌐'} {lp.domicile}</td>
                  <td className="px-3 py-3">{formatCurrency(lp.commitmentAmount)}</td>
                  <td className="px-3 py-3">
                    <p>{formatCurrency(lp.calledCapital)}</p>
                    <div className="mt-1 h-2 w-24 rounded bg-bg-border">
                      <div className="h-2 rounded bg-accent-gold" style={{ width: `${calledPct}%` }} />
                    </div>
                    <p className="text-xs text-text-secondary">{calledPct.toFixed(1)}% called</p>
                  </td>
                  <td className="px-3 py-3">{formatCurrency(lp.distributionsReceived)}</td>
                  <td className="px-3 py-3"><StatusBadge status={lp.kycStatus} /></td>
                  <td className="px-3 py-3"><StatusBadge status={lp.subscriptionStatus} /></td>
                  <td className="px-3 py-3" onClick={(event) => event.stopPropagation()}>
                    <select className="rounded border border-bg-border bg-bg-elevated px-2 py-1 text-xs">
                      <option>View</option>
                      <option>Edit</option>
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {activeLP ? (
        <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-md border-l border-bg-border bg-bg-surface p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl">LP Detail</h3>
            <button type="button" onClick={() => setActiveLP(null)} className="text-text-secondary">Close</button>
          </div>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-text-secondary">Name</dt><dd>{activeLP.legalName}</dd></div>
            <div><dt className="text-text-secondary">Entity Type</dt><dd className="capitalize">{activeLP.entityType.replace('-', ' ')}</dd></div>
            <div><dt className="text-text-secondary">Domicile</dt><dd>{activeLP.domicile}</dd></div>
            <div><dt className="text-text-secondary">Commitment</dt><dd>{formatCurrency(activeLP.commitmentAmount)}</dd></div>
            <div><dt className="text-text-secondary">Called Capital</dt><dd>{formatCurrency(activeLP.calledCapital)}</dd></div>
            <div><dt className="text-text-secondary">Distributions</dt><dd>{formatCurrency(activeLP.distributionsReceived)}</dd></div>
            <div><dt className="text-text-secondary">KYC Status</dt><dd>{activeLP.kycStatus}</dd></div>
            <div><dt className="text-text-secondary">Subscription</dt><dd>{activeLP.subscriptionStatus}</dd></div>
            <div><dt className="text-text-secondary">Relationship Manager</dt><dd>{activeLP.relationshipManager}</dd></div>
          </dl>
        </aside>
      ) : null}
    </section>
  )
}
