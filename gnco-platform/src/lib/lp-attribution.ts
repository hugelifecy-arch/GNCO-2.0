import type { LPEntry } from '@/lib/types'

export const DEFAULT_HURDLE_RATE = 8

const WITHHOLDING_TAX_BY_DOMICILE: Record<string, number> = {
  'United States': 30,
  Germany: 26.375,
  'United Arab Emirates': 0,
  Singapore: 15,
  'Cayman Islands': 0,
  Japan: 20.315,
  Netherlands: 15,
  Canada: 25,
  'Saudi Arabia': 5,
}

const MANAGEMENT_FEE_DRAG = 2

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export interface LPAttributionMetrics {
  currentNav: number
  grossIrr: number
  netIrr: number
  afterWhtIrr: number
  afterTaxIrr: number
  dpi: number
  rvpi: number
  tvpi: number
  moic: number
}

export function getWithholdingTaxRate(domicile: string) {
  return WITHHOLDING_TAX_BY_DOMICILE[domicile] ?? 15
}

export function calculateLPAttribution(lp: LPEntry, hurdleRate = DEFAULT_HURDLE_RATE): LPAttributionMetrics {
  const calledCapital = Math.max(lp.calledCapital, 1)
  const ageInYears = clamp((Date.now() - new Date(lp.onboardedDate).getTime()) / (1000 * 60 * 60 * 24 * 365), 1, 12)

  const accruedGain = lp.calledCapital * (0.16 + ageInYears * 0.01)
  const currentNav = Math.max(0, lp.calledCapital - lp.distributionsReceived + accruedGain)

  const dpi = lp.distributionsReceived / calledCapital
  const rvpi = currentNav / calledCapital
  const tvpi = dpi + rvpi
  const moic = tvpi

  const grossIrr = (Math.pow(Math.max(tvpi, 0.01), 1 / ageInYears) - 1) * 100
  const carryDrag = Math.max(0, grossIrr - hurdleRate) * 0.2
  const netIrr = grossIrr - MANAGEMENT_FEE_DRAG - carryDrag

  const whtRate = getWithholdingTaxRate(lp.domicile)
  const afterWhtIrr = netIrr * (1 - whtRate / 100)

  const effectiveTaxRate = lp.estimatedTaxRate ?? 20
  const afterTaxIrr = afterWhtIrr * (1 - effectiveTaxRate / 100)

  return {
    currentNav,
    grossIrr,
    netIrr,
    afterWhtIrr,
    afterTaxIrr,
    dpi,
    rvpi,
    tvpi,
    moic,
  }
}
