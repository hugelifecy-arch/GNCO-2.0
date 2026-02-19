import Link from 'next/link'

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <div className="rounded-xl border border-bg-border bg-bg-surface p-8 text-center">
        <h1 className="font-serif text-3xl text-text-primary">Sign In</h1>
        <p className="mt-3 text-text-secondary">
          Authentication is coming soon. During open beta, start with the Architect demo directly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/architect" className="rounded-sm bg-accent-gold px-5 py-2 text-sm font-semibold text-bg-primary">
            Go to Architect
          </Link>
          <Link href="/" className="rounded-sm border border-bg-border px-5 py-2 text-sm text-text-secondary">
            Back Home
          </Link>
        </div>
      </div>
    </main>
  )
}
