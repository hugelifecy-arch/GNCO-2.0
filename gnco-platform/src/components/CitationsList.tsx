'use client'

import { useState } from 'react'

type Citation = {
  title: string
  url: string
  publisher: string
  access_date: string
}

type CitationsListProps = {
  citations: Citation[]
}

export default function CitationsList({ citations }: CitationsListProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
      <button
        type="button"
        className="w-full text-left text-lg font-semibold"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        📄 Sources & Official References
      </button>

      {isOpen ? (
        <div className="mt-4 space-y-3">
          <ul className="space-y-3">
            {citations.map((citation) => (
              <li key={`${citation.publisher}-${citation.title}`}>
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-gold underline"
                >
                  {citation.publisher} — {citation.title}
                </a>
                <p className="mt-1 text-xs text-text-secondary">Accessed: {citation.access_date}</p>
              </li>
            ))}
          </ul>

          <p className="pt-2 text-xs text-text-secondary">
            All links point to official government, regulatory, or statutory sources.
          </p>
        </div>
      ) : null}
    </section>
  )
}
