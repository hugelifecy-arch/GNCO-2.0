'use client'

import { useState } from 'react'

export function SharedComparisonView({ id }: { id: string }) {
  const [password, setPassword] = useState('')
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [message, setMessage] = useState('Enter password if link is protected.')

  const load = async () => {
    const url = `/api/compare/share?id=${id}${password ? `&password=${encodeURIComponent(password)}` : ''}`
    const response = await fetch(url)
    const json = (await response.json()) as { success?: boolean; payload?: Record<string, unknown>; message?: string }
    if (json.success && json.payload) {
      setData(json.payload)
      setMessage('Read-only comparison loaded.')
      return
    }
    setMessage(json.message || 'Unable to load shared comparison.')
  }

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-3xl font-serif">Shared comparison</h1>
      <div className="flex gap-2">
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (optional)" className="rounded border border-bg-border bg-bg-surface px-3 py-2" />
        <button onClick={load} className="rounded border border-bg-border px-3 py-2">Load</button>
      </div>
      <p className="text-sm text-text-secondary">{message}</p>
      {data ? <pre className="overflow-auto rounded-lg border border-bg-border bg-bg-surface p-3 text-xs">{JSON.stringify(data, null, 2)}</pre> : null}
    </main>
  )
}
