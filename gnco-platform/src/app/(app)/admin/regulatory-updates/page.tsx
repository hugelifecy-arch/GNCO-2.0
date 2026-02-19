import Link from 'next/link'

import { AdminRegulatoryUpdatesClient } from '@/components/regulatory/AdminRegulatoryUpdatesClient'

export default function RegulatoryUpdatesAdminPage({ searchParams }: { searchParams?: { role?: string } }) {
  const isAdmin = searchParams?.role === 'admin'

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-6 py-12">
        <h1 className="font-serif text-3xl">Admin access required</h1>
        <p className="text-sm text-text-secondary">This page is restricted to admin users.</p>
        <p className="text-xs text-text-secondary">For demo access, use <code>?role=admin</code> in the URL.</p>
        <Link href="/dashboard" className="text-accent-gold">Return to dashboard →</Link>
      </main>
    )
  }

  return <AdminRegulatoryUpdatesClient />
}
