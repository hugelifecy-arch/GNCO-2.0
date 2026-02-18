'use client'

import { HeroSection } from '@/components/landing/HeroSection'
import { CredibilityStrip } from '@/components/landing/CredibilityStrip'
import { FeatureCards } from '@/components/landing/FeatureCards'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { RequestAccessCTA } from '@/components/landing/RequestAccessCTA'
import { MarketingFooter } from '@/components/landing/MarketingFooter'

export default function HomePage() {
  return (
    <>
      <main className="bg-bg-primary text-text-primary">
        <HeroSection />
        <CredibilityStrip />
        <FeatureCards />
        <HowItWorks />
        <RequestAccessCTA />
      </main>
      <MarketingFooter />

    </>
  )
}
