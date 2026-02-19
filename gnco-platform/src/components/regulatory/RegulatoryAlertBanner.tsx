'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { getActiveHighImpactAlerts } from '@/lib/regulatory-alerts'
import { getRegulatoryUpdates, markStructuresAsViewed } from '@/lib/regulatory-updates-storage'

function formatEffectiveDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function RegulatoryAlertBanner({ jurisdictionId }: { jurisdictionId: string }) {
  const [dismissed, setDismissed] = useState(false)

  const alert = useMemo(() => {
    const active = getActiveHighImpactAlerts(jurisdictionId, getRegulatoryUpdates())
    return active[0]
  }, [jurisdictionId])

  if (!alert || dismissed) return null

  return (
    <section className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-100">
      <p className="text-xs font-semibold uppercase tracking-wide">
        ⚠️ {alert.title} — Effective {formatEffectiveDate(alert.effective_date)}
      </p>
      <p className="mt-2 text-sm">{alert.summary}</p>
      <div className="mt-3 flex items-center gap-4 text-sm">
        <Link href={alert.source_url} target="_blank" className="underline">
          Read more →
        </Link>
        <button
          type="button"
          onClick={() => {
            markStructuresAsViewed(jurisdictionId, new Date().toISOString())
            setDismissed(true)
          }}
          className="underline"
        >
          Dismiss
        </button>
      </div>
    </section>
  )
}
