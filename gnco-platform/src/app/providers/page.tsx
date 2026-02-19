import { ProviderDirectoryClient } from '@/components/providers/ProviderDirectoryClient'
import { SERVICE_PROVIDERS } from '@/data/service-providers'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'

export default function ProvidersDirectoryPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-14">
      <header className="space-y-3">
        <h1 className="font-serif text-4xl">Service Provider Directory</h1>
        <p className="max-w-3xl text-sm text-text-secondary">
          Discover administrators, auditors, counsel, and infrastructure partners supporting private fund launches.
          Free listings include core profiles. Verified listings (€500/year) receive GNCO verification and inclusion in architect recommendations, while Featured listings (€2,000/year) are prioritized in directory placement.
        </p>
      </header>

      <ProviderDirectoryClient
        providers={SERVICE_PROVIDERS}
        jurisdictions={JURISDICTIONS.map((jurisdiction) => ({ id: jurisdiction.id, name: jurisdiction.name }))}
      />
    </main>
  )
}
