import { Skeleton } from '@/components/shared/Skeleton'

export default function MarketingLoading() {
  return (
    <main className="space-y-6 p-6">
      <Skeleton className="h-40" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </main>
  )
}
