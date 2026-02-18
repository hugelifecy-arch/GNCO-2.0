'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ComingSoonButton } from '@/components/shared/ComingSoonButton'

type SharedResultsPayload = {
  primary?: { jurisdiction?: string; vehicleType?: string; scores?: { overallScore?: number } }
  alternatives?: Array<{ jurisdiction?: string; vehicleType?: string }>
  recommendations?: Array<{ jurisdiction?: string; vehicleType?: string; reasoning?: string }>
  brief?: { strategy?: string; fundSize?: string; gpDomicile?: string }
}

export default function SharedResultsPage() {
  const params = useParams<{ shareId: string }>()
  const [results, setResults] = useState<SharedResultsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadResults() {
      try {
        const response = await fetch(`/api/architect/share?id=${params.shareId}`)
        const data = (await response.json()) as { success?: boolean; data?: SharedResultsPayload }

        if (data.success && data.data) {
          setResults(data.data)
        } else {
          setError('Results not found or expired')
        }
      } catch {
        setError('Failed to load results')
      } finally {
        setLoading(false)
      }
    }

    if (params.shareId) loadResults()
  }, [params.shareId])

  const primary = useMemo(() => results?.primary ?? results?.recommendations?.[0], [results])

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-bg-primary text-text-secondary">Loading results...</div>

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary px-6">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-serif text-text-primary">Results Not Found</h1>
          <p className="mb-6 text-text-secondary">{error}</p>
          <Link href="/" className="inline-block rounded-sm bg-accent-gold px-6 py-3 text-bg-primary">Go to GNCO Home</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-bg-primary px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-lg border border-bg-border bg-bg-surface p-6">
          <p className="text-sm text-text-tertiary">Shared results (read-only)</p>
          <h1 className="mt-1 font-serif text-3xl">Architect Results Snapshot</h1>
          <p className="mt-2 text-text-secondary">Primary recommendation and assumptions are shown below. Exports are coming soon for shared links.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card label="Primary Jurisdiction" value={primary?.jurisdiction ?? 'Unavailable'} />
          <Card label="Vehicle" value={primary?.vehicleType ?? 'Unavailable'} />
          <Card label="Score" value={String(results?.primary?.scores?.overallScore ?? 'N/A')} />
        </section>

        <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
          <h2 className="text-lg font-semibold">Input assumptions</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-secondary">
            <li>Strategy: {results?.brief?.strategy ?? 'N/A'}</li>
            <li>Fund size: {results?.brief?.fundSize ?? 'N/A'}</li>
            <li>GP domicile: {results?.brief?.gpDomicile ?? 'N/A'}</li>
          </ul>
        </section>

        <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
          <h2 className="text-lg font-semibold">Alternatives</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-secondary">
            {(results?.alternatives ?? []).map((item, idx) => <li key={`${item.jurisdiction}-${idx}`}>{item.jurisdiction} — {item.vehicleType}</li>)}
          </ul>
        </section>

        <div className="flex flex-wrap gap-3">
          <ComingSoonButton>Export PDF (coming soon)</ComingSoonButton>
          <ComingSoonButton>Export Excel (coming soon)</ComingSoonButton>
          <Link href="/architect" className="rounded-sm bg-accent-gold px-6 py-2 text-sm font-semibold text-bg-primary">Run new analysis</Link>
        </div>
      </div>
    </main>
  )
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-bg-border bg-bg-surface p-4">
      <p className="text-xs uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="mt-1 text-lg">{value}</p>
    </div>
  )
}
