export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-primary">
      <div className="h-10 w-10 rotate-45 rounded-md border-2 border-accent-gold/70 bg-accent-gold/10 animate-pulse" />
      <p className="text-sm text-text-secondary">Loading GNCO...</p>
    </div>
  )
}
