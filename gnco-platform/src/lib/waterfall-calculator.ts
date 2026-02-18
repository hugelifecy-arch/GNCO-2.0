import type { WaterfallInput, WaterfallOutput, WaterfallTier } from './types'

function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator
}

export function calculateWaterfall(input: WaterfallInput): WaterfallOutput {
  const totalCommittedCapital = input.lpCommitments.reduce((sum, lp) => sum + lp.commitment, 0)
  const tiers: WaterfallTier[] = []

  let remaining = Math.max(0, input.totalProceeds)
  let lpTotal = 0
  let gpTotal = 0

  // Tier 1: Return of Capital
  const tier1Amount = Math.min(remaining, totalCommittedCapital)
  remaining -= tier1Amount
  lpTotal += tier1Amount
  tiers.push({
    tierName: 'Tier 1 — Return of Capital',
    totalAmount: tier1Amount,
    description: '100% to LPs until contributed/committed capital is returned.',
    recipient: 'lp',
  })

  // Tier 2: Preferred Return (annual compounding, 1-year approximation with available inputs)
  const prefRate = input.preferredReturn / 100
  const preferredReturnTarget = totalCommittedCapital * (Math.pow(1 + prefRate, 1) - 1)
  const tier2Amount = Math.min(remaining, preferredReturnTarget)
  remaining -= tier2Amount
  lpTotal += tier2Amount
  tiers.push({
    tierName: 'Tier 2 — Preferred Return',
    totalAmount: tier2Amount,
    description: `100% to LPs until preferred return hurdle (${input.preferredReturn}%) is met.`,
    recipient: 'lp',
  })

  const profitDistributedSoFar = Math.max(0, lpTotal - totalCommittedCapital)
  const carryRate = input.carriedInterest / 100

  // Tier 3: GP Catch-Up
  const targetGpShareOfCurrentProfits = safeDivide(carryRate * profitDistributedSoFar, 1 - carryRate)
  const catchUpCap = Math.max(0, targetGpShareOfCurrentProfits - gpTotal)
  const catchUpRate = Math.max(0, Math.min(1, input.catchUpPercent / 100))
  const effectiveCatchUp = catchUpRate === 0 ? 0 : Math.min(remaining, catchUpCap / catchUpRate)
  const tier3GpAmount = effectiveCatchUp * catchUpRate
  const tier3LpAmount = effectiveCatchUp - tier3GpAmount

  remaining -= effectiveCatchUp
  gpTotal += tier3GpAmount
  lpTotal += tier3LpAmount
  tiers.push({
    tierName: 'Tier 3 — GP Catch-Up',
    totalAmount: effectiveCatchUp,
    description: `GP receives ${input.catchUpPercent}% catch-up distributions until carry entitlement is aligned.`,
    recipient: 'split',
    splitRatio: { lp: 100 - input.catchUpPercent, gp: input.catchUpPercent },
  })

  // Tier 4: Residual carry split
  const adjustedCarryRate = input.managementFeeOffset ? carryRate * 0.9 : carryRate
  const tier4GpAmount = remaining * adjustedCarryRate
  const tier4LpAmount = remaining - tier4GpAmount

  gpTotal += tier4GpAmount
  lpTotal += tier4LpAmount

  tiers.push({
    tierName: 'Tier 4 — Carried Interest Split',
    totalAmount: remaining,
    description: `Residual proceeds split ${Math.round((1 - adjustedCarryRate) * 100)}% to LPs and ${Math.round(adjustedCarryRate * 100)}% to GP.`,
    recipient: 'split',
    splitRatio: { lp: Math.round((1 - adjustedCarryRate) * 100), gp: Math.round(adjustedCarryRate * 100) },
  })

  const lpDistributions = input.lpCommitments.map((lp) => {
    const share = safeDivide(lp.commitment, totalCommittedCapital)
    const amount = lpTotal * share
    const gain = Math.max(0, amount - lp.commitment)
    const effectiveReturn = safeDivide(gain, lp.commitment) * 100

    return {
      lpId: lp.lpId,
      lpName: lp.lpName,
      amount: Number(amount.toFixed(2)),
      effectiveReturn: Number(effectiveReturn.toFixed(2)),
    }
  })

  return {
    tiers,
    lpDistributions,
    gpCarry: Number(gpTotal.toFixed(2)),
    totalDistributed: Number((lpTotal + gpTotal).toFixed(2)),
  }
}
