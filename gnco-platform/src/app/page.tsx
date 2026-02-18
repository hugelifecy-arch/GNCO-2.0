'use client'

import { useState } from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { CredibilityStrip } from '@/components/landing/CredibilityStrip'
import { FeatureCards } from '@/components/landing/FeatureCards'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { RequestAccessCTA } from '@/components/landing/RequestAccessCTA'
import { MarketingFooter } from '@/components/landing/MarketingFooter'
import { RequestAccessModal } from '@/components/shared/RequestAccessModal'

export default function HomePage() {
  const [requestAccessOpen, setRequestAccessOpen] = useState(false)

  return (
    <>
      <main className="bg-bg-primary text-text-primary">
        <HeroSection onRequestAccess={() => setRequestAccessOpen(true)} />
        <CredibilityStrip />
        <FeatureCards />
        <HowItWorks />
        <RequestAccessCTA onRequestAccess={() => setRequestAccessOpen(true)} />
      </main>
      <MarketingFooter />

      <RequestAccessModal open={requestAccessOpen} onOpenChange={setRequestAccessOpen} />
    </>
  )
}
