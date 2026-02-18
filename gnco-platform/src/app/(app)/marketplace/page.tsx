import { MarketplaceRequestForm } from '@/components/marketplace/MarketplaceRequestForm'

export default function MarketplacePage() {
  return (
    <main className="space-y-5 p-6 lg:p-8">
      <p className="text-xs uppercase tracking-[0.14em] text-text-tertiary">Marketplace</p>
      <h1 className="font-serif text-3xl text-text-primary">Request an Intro</h1>
      <p className="max-w-3xl text-sm text-text-secondary">
        Share your target profile and timeline. We will use this request to coordinate non-exclusive introduction pathways.
      </p>
      <MarketplaceRequestForm />
    </main>
  )
}
