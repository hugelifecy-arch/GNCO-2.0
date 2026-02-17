import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="hero-grid-bg min-h-screen bg-bg-primary p-12 text-text-primary">
      <h1 className="font-serif text-5xl">GNCO Platform</h1>
      <p className="mt-4 max-w-2xl text-text-secondary">A production-ready foundation for Architect, Operator, and Intelligence modules.</p>
      <div className="mt-8 flex gap-4">
        <Link className="rounded-md bg-accent-gold px-4 py-2 text-bg-primary" href="/dashboard">Enter Dashboard</Link>
        <Link className="rounded-md border border-bg-border px-4 py-2" href="/architect">Open Architect</Link>
      </div>
    </main>
  )
}
