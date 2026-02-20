import type { Metadata } from 'next'
import { GPRelocationAdvisor } from '@/components/marketing/GPRelocationAdvisor'

export const metadata: Metadata = {
  title: 'GP Relocation Advisor | GNCO',
  description:
    'Compare GP relocation destinations across tax impact, visa pathways, and quality-of-life fit with a ranked 5-year analysis.',
}

export default function GPRelocationToolPage() {
  return <GPRelocationAdvisor />
}
