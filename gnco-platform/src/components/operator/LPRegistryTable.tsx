'use client'

import { ArrowDownUp, Building2, Download } from 'lucide-react'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/shared/EmptyState'
import { calculateLPAttribution, DEFAULT_HURDLE_RATE } from '@/lib/lp-attribution'
import type { LPEntry } from '@/lib/types'
import { formatPercent } from '@/lib/utils'
import { usePrivacyMode } from '@/components/shared/PrivacyModeContext'

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

type TableRow = LPEntry & ReturnType<typeof calculateLPAttribution>

type SortKey =
  | 'legalName'
  | 'domicile'
  | 'entityType'
  | 'commitmentAmount'
  | 'calledCapital'
  | 'distributionsReceived'
  | 'currentNav'
  | 'grossIrr'
  | 'netIrr'
  | 'afterWhtIrr'
  | 'afterTaxIrr'
  | 'dpi'
  | 'rvpi'
  | 'tvpi'
  | 'moic'

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
  const { formatPrivate, isPrivacyMode } = usePrivacyMode()
  const [sortKey, setSortKey] = useState<SortKey>('netIrr')
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

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

    const withMetrics: TableRow[] = filtered.map((lp) => ({
      ...lp,
      ...calculateLPAttribution(lp),
    }))

    return withMetrics.sort((a, b) => {
      const modifier = sortAsc ? 1 : -1
      if (typeof a[sortKey] === 'string' && typeof b[sortKey] === 'string') {
        return (a[sortKey] as string).localeCompare(b[sortKey] as string) * modifier
      }
      return ((a[sortKey] as number) - (b[sortKey] as number)) * modifier
    })
  }, [data, filters, search, sortAsc, sortKey])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev)
    } else {
      setSortKey(key)
      setSortAsc(['legalName', 'domicile', 'entityType'].includes(key))
    }
  }

  const exportLPReport = async (lp: TableRow) => {
    const payload = {
      generatedAt: new Date().toISOString().slice(0, 10),
      lpName: formatPrivate(lp.legalName, 'name', 'lp'),
      domicile: lp.domicile,
      entityType: lp.entityType,
      rows: [
        { label: 'Commitment (€)', value: formatPrivate(lp.commitmentAmount, 'currency') },
        { label: 'Called Capital (€)', value: formatPrivate(lp.calledCapital, 'currency') },
        { label: 'Distributions Received (€)', value: formatPrivate(lp.distributionsReceived, 'currency') },
        { label: 'Current NAV (€)', value: formatPrivate(lp.currentNav, 'currency') },
        { label: 'Gross IRR', value: formatPercent(lp.grossIrr, 2) },
        { label: 'Net IRR', value: formatPercent(lp.netIrr, 2) },
        { label: 'After-WHT IRR', value: formatPercent(lp.afterWhtIrr, 2) },
        { label: 'After-Tax IRR', value: formatPercent(lp.afterTaxIrr, 2) },
        { label: 'DPI', value: lp.dpi.toFixed(2) },
        { label: 'RVPI', value: lp.rvpi.toFixed(2) },
        { label: 'TVPI', value: lp.tvpi.toFixed(2) },
        { label: 'MOIC', value: lp.moic.toFixed(2) },
      ],
    }

    const response = await fetch('/api/export/lp-attribution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, privacyMode: isPrivacyMode }),
    })

    if (!response.ok) return

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lp-attribution-${payload.lpName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${payload.generatedAt}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const allSelected = rows.length > 0 && selected.length === rows.length

  const headerCell = (label: string, key: SortKey) => (
    <th className="px-3 py-2" key={key}>
      <button type="button" className="inline-flex items-center gap-1 text-left" onClick={() => toggleSort(key)}>
        {label}
        <ArrowDownUp className="h-3 w-3" />
      </button>
    </th>
  )

  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className="rounded border border-bg-border px-3 py-1 text-sm">
          Export Selected
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1700px] text-left text-sm">
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
              {headerCell('LP Name', 'legalName')}
              {headerCell('Domicile', 'domicile')}
              {headerCell('Entity Type', 'entityType')}
              {headerCell('Commitment (€)', 'commitmentAmount')}
              {headerCell('Called Capital (€)', 'calledCapital')}
              {headerCell('Distributions Received (€)', 'distributionsReceived')}
              {headerCell('Current NAV (€)', 'currentNav')}
              {headerCell('Gross IRR', 'grossIrr')}
              {headerCell('Net IRR', 'netIrr')}
              {headerCell('After-WHT IRR', 'afterWhtIrr')}
              {headerCell('After-Tax IRR', 'afterTaxIrr')}
              {headerCell('DPI', 'dpi')}
              {headerCell('RVPI', 'rvpi')}
              {headerCell('TVPI', 'tvpi')}
              {headerCell('MOIC', 'moic')}
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={17} className="p-4">
                  <EmptyState
                    icon={Building2}
                    message="No LPs onboarded yet. Import from Excel or add manually."
                    actionLabel="Add LP"
                  />
                </td>
              </tr>
            ) : null}
            {rows.map((lp) => (
              <tr key={lp.id} className="border-b border-bg-border/40 hover:bg-bg-elevated/30">
                <td className="px-2 py-3">
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
                <td className="px-3 py-3 font-medium">{formatPrivate(lp.legalName, 'name', 'lp')}</td>
                <td className="px-3 py-3">{flags[lp.domicile] ?? '🌐'} {lp.domicile}</td>
                <td className="px-3 py-3 capitalize">{lp.entityType.replace('-', ' ')}</td>
                <td className="px-3 py-3">{formatPrivate(lp.commitmentAmount, 'currency')}</td>
                <td className="px-3 py-3">{formatPrivate(lp.calledCapital, 'currency')}</td>
                <td className="px-3 py-3">{formatPrivate(lp.distributionsReceived, 'currency')}</td>
                <td className="px-3 py-3">{formatPrivate(lp.currentNav, 'currency')}</td>
                <td className="px-3 py-3">{formatPercent(lp.grossIrr, 2)}</td>
                <td className={`px-3 py-3 font-semibold ${lp.netIrr > DEFAULT_HURDLE_RATE ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatPercent(lp.netIrr, 2)}
                </td>
                <td className="px-3 py-3">{formatPercent(lp.afterWhtIrr, 2)}</td>
                <td className="px-3 py-3">{formatPercent(lp.afterTaxIrr, 2)}</td>
                <td className="px-3 py-3">{lp.dpi.toFixed(2)}</td>
                <td className="px-3 py-3">{lp.rvpi.toFixed(2)}</td>
                <td className="px-3 py-3">{lp.tvpi.toFixed(2)}</td>
                <td className="px-3 py-3">{lp.moic.toFixed(2)}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded border border-bg-border px-2 py-1 text-xs"
                    onClick={() => exportLPReport(lp)}
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-text-secondary">Net IRR is color-coded against an {DEFAULT_HURDLE_RATE}% hurdle rate.</p>
    </section>
  )
}
