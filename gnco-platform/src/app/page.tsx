'use client'

import { HeroSection } from '@/components/landing/HeroSection'
import { CredibilityStrip } from '@/components/landing/CredibilityStrip'
import { FeatureCards } from '@/components/landing/FeatureCards'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { PartnerStrip } from '@/components/landing/PartnerStrip'
import { RequestAccessCTA } from '@/components/landing/RequestAccessCTA'
import { MarketingFooter } from '@/components/landing/MarketingFooter'

export default function HomePage() {
  return (
    <>
      <main className="bg-bg-primary text-text-primary">
        <HeroSection />
        <CredibilityStrip />
        <FeatureCards />
        <PartnerStrip />
        <HowItWorks />
        <RequestAccessCTA />
      </main>
      <MarketingFooter />

    </>
  )
}
