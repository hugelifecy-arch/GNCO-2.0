import Link from 'next/link'

interface FundDetailPageProps {
  params: {
    slug: string
  }
}

function humanize(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function FundDetailPage({ params }: FundDetailPageProps) {
  const fundName = humanize(params.slug)

  return (
    <main className="space-y-6 p-6 lg:p-8">
      <div className="rounded-lg border border-bg-border bg-bg-surface p-6">
        <p className="text-xs uppercase tracking-wide text-text-secondary">Fund detail</p>
        <h1 className="mt-2 font-serif text-3xl text-text-primary">{fundName}</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">
          This detail view is the destination for heatmap drill-through. Connect this route to your portfolio database to render
          full fund facts, attribution, cash-flow history, and supporting documents.
        </p>
        <Link href="/dashboard" className="mt-4 inline-flex rounded border border-bg-border px-3 py-1.5 text-sm text-text-primary hover:bg-bg-elevated">
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}
