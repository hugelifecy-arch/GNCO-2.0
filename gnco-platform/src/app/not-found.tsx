import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-7xl text-accent-gold">404</h1>
      <p className="text-text-secondary">This page does not exist.</p>
      <Link href="/" className="rounded-md border border-accent-gold/40 bg-accent-gold/10 px-4 py-2 text-sm text-accent-gold">
        Back to Home
      </Link>
    </main>
  )
}
