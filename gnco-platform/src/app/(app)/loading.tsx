import { Skeleton } from '@/components/shared/Skeleton'

export default function AppLoading() {
  return (
    <main className="space-y-6 p-6 lg:p-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-80" />
      <Skeleton className="h-64" />
    </main>
  )
}
