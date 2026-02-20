import type { ReactNode } from 'react'

type CitationProps = {
  children: ReactNode
  source: string
  url: string
  marker?: string
  className?: string
}

export function Citation({ children, source, url, marker = '¹', className = '' }: CitationProps) {
  return (
    <span className={`inline-flex items-baseline gap-1 ${className}`.trim()}>
      <span>{children}</span>
      <span className="group relative inline-flex items-center">
        <button
          type="button"
          aria-label={`Citation: ${source}`}
          className="text-xs font-semibold text-accent-gold outline-none transition hover:text-accent-gold-light focus-visible:text-accent-gold-light"
        >
          [{marker}]
        </button>
        <span className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2 w-72 -translate-x-1/2 rounded-md border border-bg-border bg-bg-elevated p-3 text-left text-xs text-text-secondary opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <span className="block font-semibold text-text-primary">{source}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto mt-1 inline-block break-all text-accent-gold underline"
          >
            {url}
          </a>
        </span>
      </span>
    </span>
  )
}
