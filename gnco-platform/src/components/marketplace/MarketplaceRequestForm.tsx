'use client'

import { FormEvent, useState } from 'react'

type FormState = {
  jurisdiction: string
  fundType: string
  lpBase: string
  targetTimeline: string
  contactEmail: string
  notes: string
}

const initialState: FormState = {
  jurisdiction: '',
  fundType: '',
  lpBase: '',
  targetTimeline: '',
  contactEmail: '',
  notes: '',
}

export function MarketplaceRequestForm() {
  const [formState, setFormState] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage(null)

    const response = await fetch('/api/marketplace/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    })

    if (!response.ok) {
      setMessage('Unable to submit request. Please check your inputs and try again.')
      setSubmitting(false)
      return
    }

    setFormState(initialState)
    setMessage('Request submitted successfully. Our team will reach out shortly.')
    setSubmitting(false)
  }

  return (
    <form onSubmit={submitRequest} className="space-y-4 rounded-xl border border-bg-border bg-bg-surface p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-text-secondary">
          Jurisdiction
          <input
            required
            value={formState.jurisdiction}
            onChange={(event) => setFormState((prev) => ({ ...prev, jurisdiction: event.target.value }))}
            className="mt-1 w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2 text-text-primary"
          />
        </label>
        <label className="text-sm text-text-secondary">
          Fund type
          <input
            required
            value={formState.fundType}
            onChange={(event) => setFormState((prev) => ({ ...prev, fundType: event.target.value }))}
            className="mt-1 w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2 text-text-primary"
          />
        </label>
        <label className="text-sm text-text-secondary">
          LP base
          <input
            required
            value={formState.lpBase}
            onChange={(event) => setFormState((prev) => ({ ...prev, lpBase: event.target.value }))}
            className="mt-1 w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2 text-text-primary"
          />
        </label>
        <label className="text-sm text-text-secondary">
          Target timeline
          <input
            required
            value={formState.targetTimeline}
            onChange={(event) => setFormState((prev) => ({ ...prev, targetTimeline: event.target.value }))}
            className="mt-1 w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2 text-text-primary"
          />
        </label>
      </div>

      <label className="block text-sm text-text-secondary">
        Contact email
        <input
          type="email"
          required
          value={formState.contactEmail}
          onChange={(event) => setFormState((prev) => ({ ...prev, contactEmail: event.target.value }))}
          className="mt-1 w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2 text-text-primary"
        />
      </label>

      <label className="block text-sm text-text-secondary">
        Notes
        <textarea
          value={formState.notes}
          onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
          rows={4}
          className="mt-1 w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2 text-text-primary"
        />
      </label>

      <p className="text-xs text-text-tertiary">GNCO is not a broker; no endorsement; introductions only.</p>

      <button type="submit" disabled={submitting} className="rounded-md bg-accent-gold px-4 py-2 text-sm font-medium text-bg-primary disabled:opacity-70">
        {submitting ? 'Submitting...' : 'Submit introduction request'}
      </button>

      {message ? <p className="text-sm text-text-secondary">{message}</p> : null}
    </form>
  )
}
