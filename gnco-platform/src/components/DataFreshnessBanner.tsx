interface DataFreshnessBannerProps {
  lastVerifiedDate: string
  jurisdictionName: string
}

const STALE_AFTER_DAYS = 90

function formatVerifiedDate(dateString: string) {
  const parsedDate = new Date(dateString)

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).format(parsedDate)
}

function isDateStale(dateString: string) {
  const parsedDate = new Date(dateString)

  if (Number.isNaN(parsedDate.getTime())) {
    return false
  }

  const millisecondsSinceVerification = Date.now() - parsedDate.getTime()
  const staleThreshold = STALE_AFTER_DAYS * 24 * 60 * 60 * 1000

  return millisecondsSinceVerification > staleThreshold
}

export default function DataFreshnessBanner({
  lastVerifiedDate,
  jurisdictionName,
}: DataFreshnessBannerProps) {
  const stale = isDateStale(lastVerifiedDate)
  const formattedDate = formatVerifiedDate(lastVerifiedDate)

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label={`Data freshness for ${jurisdictionName}`}
      className="rounded-md border border-bg-border bg-bg-surface/80 px-3 py-2 text-xs text-text-secondary"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className={stale ? 'text-yellow-600' : 'text-green-600'}>
          {stale ? '⚠️' : '✅'}
        </span>
        <p>
          Data verified: {formattedDate}. Verify all details with qualified advisors.
          {stale ? ' This data may be outdated. Please verify.' : ''}
        </p>
      </div>
    </aside>
  )
}
