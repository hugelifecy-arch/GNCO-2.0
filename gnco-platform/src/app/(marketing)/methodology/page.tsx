import type { Metadata } from 'next'
import { MethodologyPageClient } from '@/components/marketing/MethodologyPageClient'

export const metadata: Metadata = {
  title: 'Methodology | GNCO',
  description:
    'Read GNCO methodology covering analytical framework, scoring model, tax impact estimation, performance standards, data sources, and interpretation guidance.',
}

export default function MethodologyPage() {
  return <MethodologyPageClient />
}
