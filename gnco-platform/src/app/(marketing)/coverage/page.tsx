import type { Metadata } from 'next'
import { CoveragePageClient } from '@/components/marketing/CoveragePageClient'

export const metadata: Metadata = {
  title: 'Coverage | GNCO',
  description:
    "Explore GNCO's jurisdiction coverage with operational intelligence across fund domiciles, including formation costs, timelines, tax treaties, and service provider depth.",
}

export default function CoveragePage() {
  return <CoveragePageClient />
}
