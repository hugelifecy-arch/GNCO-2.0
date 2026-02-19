import type { Metadata } from 'next'

import { CredibilityStrip } from '@/components/landing/CredibilityStrip'
import { FeatureCards } from '@/components/landing/FeatureCards'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { InstantCostCalculator } from '@/components/landing/InstantCostCalculator'
import { MarketingFooter } from '@/components/landing/MarketingFooter'
import { PartnerStrip } from '@/components/landing/PartnerStrip'
import { RequestAccessCTA } from '@/components/landing/RequestAccessCTA'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'GNCO — Global Fund Architect | Institutional Fund Structure Modeling',
  description:
    'Model, compare, and optimize fund structures across 15 jurisdictions. Built for family offices, GPs, and fund architects. Free during open beta.',
}

async function getOpenBetaPractitionerCount() {
  try {
    return await prisma.user.count()
  } catch {
    return null
  }
}

export default async function HomePage() {
  const openBetaPractitionerCount = await getOpenBetaPractitionerCount()

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
