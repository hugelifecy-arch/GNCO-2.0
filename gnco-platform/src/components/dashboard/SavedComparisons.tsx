'use client'

import { useEffect, useState } from 'react'

type SavedComparison = {
  id: string
  name: string
  createdAt: string
  columns: string[]
  scoreSummary: number
}

export function SavedComparisons() {
  const [items, setItems] = useState<SavedComparison[]>([])

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/compare/save')
      const data = (await response.json()) as { comparisons?: SavedComparison[] }
      setItems(data.comparisons || [])
    }
    void load()
  }, [])

  return (
    <section className="rounded-xl border border-bg-border bg-bg-surface p-5">
      <h3 className="text-lg font-semibold">Saved comparisons</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-text-secondary">No saved comparison yet. Build one in /compare.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.slice(0, 5).map((item) => (
            <li key={item.id} className="rounded border border-bg-border px-3 py-2">
              <p className="font-medium">{item.name}</p>
              <p className="text-text-secondary">{item.columns.join(' vs ')} · score {item.scoreSummary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
