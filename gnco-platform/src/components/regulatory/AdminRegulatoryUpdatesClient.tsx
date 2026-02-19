'use client'

import { useMemo, useState } from 'react'

import { JURISDICTIONS_CANONICAL } from '@/data/jurisdictions'
import { getRegulatoryUpdates, saveRegulatoryUpdate } from '@/lib/regulatory-updates-storage'
import type { RegulatoryImpactLevel, RegulatoryUpdate, RegulatoryUpdateStatus } from '@/lib/regulatory-updates'

const VEHICLE_OPTIONS = ['RAIF', 'SIF', 'ELP', 'SPC', 'ICAV', 'VCC']

export function AdminRegulatoryUpdatesClient() {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>(() => getRegulatoryUpdates())
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [jurisdictionId, setJurisdictionId] = useState(JURISDICTIONS_CANONICAL[0]?.id ?? 'cayman-islands')
  const [impactLevel, setImpactLevel] = useState<RegulatoryImpactLevel>('MEDIUM')
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10))
  const [vehicleTypes, setVehicleTypes] = useState<string[]>(['RAIF'])
  const [sourceUrl, setSourceUrl] = useState('https://')
  const [status, setStatus] = useState<RegulatoryUpdateStatus>('DRAFT')

  const sortedUpdates = useMemo(
    () => updates.slice().sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [updates]
  )

  const toggleVehicle = (vehicle: string) => {
    setVehicleTypes((prev) => (prev.includes(vehicle) ? prev.filter((item) => item !== vehicle) : [...prev, vehicle]))
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const update: RegulatoryUpdate = {
      id: `reg-${Date.now()}`,
      jurisdiction_id: jurisdictionId,
      title,
      summary,
      impact_level: impactLevel,
      effective_date: effectiveDate,
      affects_vehicle_types: vehicleTypes,
      source_url: sourceUrl,
      created_at: new Date().toISOString(),
      status,
    }

    saveRegulatoryUpdate(update)
    setUpdates((prev) => [update, ...prev])
    setTitle('')
    setSummary('')
    setVehicleTypes(['RAIF'])
    setStatus('DRAFT')
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-10">
      <h1 className="font-serif text-3xl">Admin · Regulatory Updates</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-bg-border bg-bg-surface p-6">
        <input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Update title" className="w-full rounded border border-bg-border bg-transparent p-2" />
        <textarea value={summary} onChange={(event) => setSummary(event.target.value)} required placeholder="Plain-language summary" className="h-24 w-full rounded border border-bg-border bg-transparent p-2" />
        <div className="grid gap-3 md:grid-cols-2">
          <select value={jurisdictionId} onChange={(event) => setJurisdictionId(event.target.value)} className="rounded border border-bg-border bg-transparent p-2">
            {JURISDICTIONS_CANONICAL.map((jurisdiction) => (
              <option key={jurisdiction.id} value={jurisdiction.id}>{jurisdiction.name}</option>
            ))}
          </select>
          <select value={impactLevel} onChange={(event) => setImpactLevel(event.target.value as RegulatoryImpactLevel)} className="rounded border border-bg-border bg-transparent p-2">
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
          <input type="date" value={effectiveDate} onChange={(event) => setEffectiveDate(event.target.value)} className="rounded border border-bg-border bg-transparent p-2" />
          <input type="url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} className="rounded border border-bg-border bg-transparent p-2" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-text-secondary">Affected vehicle types</p>
          <div className="flex flex-wrap gap-3">
            {VEHICLE_OPTIONS.map((vehicle) => (
              <label key={vehicle} className="text-sm">
                <input type="checkbox" checked={vehicleTypes.includes(vehicle)} onChange={() => toggleVehicle(vehicle)} className="mr-1" />
                {vehicle}
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={status === 'PUBLISHED'} onChange={(event) => setStatus(event.target.checked ? 'PUBLISHED' : 'DRAFT')} />
          Publish now
        </label>

        <button type="submit" className="rounded bg-accent-gold px-4 py-2 text-sm font-semibold text-bg-primary">Save update</button>
      </form>

      <section className="space-y-3 rounded-xl border border-bg-border bg-bg-surface p-6">
        <h2 className="text-xl font-semibold">Recent updates</h2>
        {sortedUpdates.map((update) => (
          <article key={update.id} className="rounded border border-bg-border p-3">
            <p className="text-xs text-text-secondary">{update.status} · {update.impact_level} · {update.jurisdiction_id}</p>
            <p className="font-medium">{update.title}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
