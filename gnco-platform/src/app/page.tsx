'use client'

import { useEffect, useState } from 'react'

import { HeroSection } from '@/components/landing/HeroSection'
import { CredibilityStrip } from '@/components/landing/CredibilityStrip'
import { FeatureCards } from '@/components/landing/FeatureCards'
import { InstantCostCalculator } from '@/components/landing/InstantCostCalculator'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { PartnerStrip } from '@/components/landing/PartnerStrip'
import { RequestAccessCTA } from '@/components/landing/RequestAccessCTA'
import { MarketingFooter } from '@/components/landing/MarketingFooter'

type MarketingStatsResponse = {
  openBetaPractitionerCount: number | null
}

export default function HomePage() {
  const [openBetaPractitionerCount, setOpenBetaPractitionerCount] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchMarketingStats = async () => {
      try {
        const response = await fetch('/api/marketing/stats', {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!response.ok) {
          return
        }

        const payload: MarketingStatsResponse = await response.json()
        setOpenBetaPractitionerCount(payload.openBetaPractitionerCount)
      } catch {
        // Intentionally swallow errors so marketing page still renders.
      }
    }

    fetchMarketingStats()

    return () => controller.abort()
  }, [])

  return (
    <>
      <main className="bg-bg-primary text-text-primary">
        <HeroSection />
        <CredibilityStrip />
        <InstantCostCalculator />
        <FeatureCards />
        <PartnerStrip />
        <HowItWorks />
        <RequestAccessCTA openBetaPractitionerCount={openBetaPractitionerCount} />
      </main>
      <MarketingFooter />
    </>
  )
}
