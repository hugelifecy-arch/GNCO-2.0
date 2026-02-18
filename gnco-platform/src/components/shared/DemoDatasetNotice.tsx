export function DemoDatasetNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-md border border-accent-gold/30 bg-accent-gold/10 px-3 py-2 text-sm text-accent-gold ${compact ? '' : 'mb-4'}`}>
      Demo dataset: values and people shown in this environment are sample data for product demonstration.
    </div>
  )
}
