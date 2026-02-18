import { WaterfallCalculator } from '@/components/operator/WaterfallCalculator'

export default function DistributionsPage() {
  return (
    <main className="space-y-6 p-6 lg:p-8">
      <h1 className="font-serif text-3xl">Distribution &amp; Waterfall Calculator</h1>
      <WaterfallCalculator />
    </main>
  )
}
