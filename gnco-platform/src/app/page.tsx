import type { Metadata } from 'next'

import { HeroSection } from '@/components/landing/HeroSection'
import { CredibilityStrip } from '@/components/landing/CredibilityStrip'
import { FeatureCards } from '@/components/landing/FeatureCards'
import { InstantCostCalculator } from '@/components/landing/InstantCostCalculator'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { PartnerStrip } from '@/components/landing/PartnerStrip'
import { PricingSection } from '@/components/landing/PricingSection'
import { RequestAccessCTA } from '@/components/landing/RequestAccessCTA'
import { MarketingFooter } from '@/components/landing/MarketingFooter'

export const metadata: Metadata = {
  title: 'GNCO — Global Fund Architect | Institutional Fund Structure Modeling',
  description:
    'Model, compare, and optimize fund structures across 15 jurisdictions. Built for family offices, GPs, and fund architects. Free during open beta.',
}

export default function HomePage() {
  return (
    <>
      <main className="bg-bg-primary text-text-primary">
        <HeroSection />
        <CredibilityStrip />
        <InstantCostCalculator />
        <FeatureCards />
        <PartnerStrip />
        <HowItWorks />
        <PricingSection />
        <RequestAccessCTA />
      </main>
      <MarketingFooter />

    </>
  )
}
