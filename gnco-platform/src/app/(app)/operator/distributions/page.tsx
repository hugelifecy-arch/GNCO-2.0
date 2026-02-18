import dynamic from 'next/dynamic'

const WaterfallCalculator = dynamic(() => import('@/components/operator/WaterfallCalculator').then((mod) => mod.WaterfallCalculator))

export default function DistributionsPage() {
  return (
    <main className="space-y-6 p-6 lg:p-8">
      <h1 className="font-serif text-3xl">Distribution &amp; Waterfall Calculator</h1>
      <WaterfallCalculator />
    </main>
  )
}
