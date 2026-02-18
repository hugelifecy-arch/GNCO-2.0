import type {
  ArchitectBrief,
  FundStructureRecommendation,
  JurisdictionProfile,
  JurisdictionScore,
  Priority,
} from './types'

const PRIORITY_TO_SCORE_KEY: Record<Priority, keyof Omit<JurisdictionScore, 'overallScore'>> = {
  'tax-efficiency': 'taxEfficiency',
  'speed-to-close': 'speedToClose',
  'regulatory-simplicity': 'regulatorySimplicity',
  'lp-familiarity': 'lpFamiliarity',
  'cost-of-formation': 'costScore',
  privacy: 'privacyScore',
  'fundraising-flexibility': 'lpFamiliarity',
}

const BASE_WEIGHTS = [3, 2, 1.5, 1.2, 1]

function buildBaseScore(j: JurisdictionProfile): JurisdictionScore {
  const treatyScore = j.taxTreatyStrength === 'high' ? 88 : j.taxTreatyStrength === 'medium' ? 70 : 48
  const setupAvg = (j.setupTimeWeeks.min + j.setupTimeWeeks.max) / 2
  const costAvg = (j.formationCostRange.min + j.formationCostRange.max) / 2

  return {
    taxEfficiency: treatyScore,
    lpFamiliarity: ['Cayman Islands', 'Luxembourg', 'Delaware, USA', 'United Kingdom'].includes(j.name) ? 88 : 72,
    regulatorySimplicity: setupAvg <= 7 ? 85 : setupAvg <= 11 ? 74 : 62,
    speedToClose: Math.max(35, 100 - setupAvg * 6),
    costScore: Math.max(30, 100 - costAvg / 6000),
    privacyScore: ['Cayman Islands', 'British Virgin Islands (BVI)', 'Delaware, USA', 'Jersey (Channel Islands)'].includes(j.name) ? 84 : 68,
    overallScore: 0,
  }
}

function applyBriefRules(base: JurisdictionScore, brief: ArchitectBrief, j: JurisdictionProfile): JurisdictionScore {
  const score = { ...base }

  if (brief.gpDomicile.toLowerCase().includes('usa') || brief.gpDomicile.toLowerCase().includes('united states')) {
    if (['Luxembourg', 'Netherlands', 'Ireland'].includes(j.name)) {
      score.taxEfficiency -= 8
      score.regulatorySimplicity -= 4
    }
  }

  if (brief.lpProfile.includes('us-tax-exempt') && ['Cayman Islands', 'Delaware, USA'].includes(j.name)) {
    score.taxEfficiency += 14
    score.lpFamiliarity += 10
  }

  if (brief.lpProfile.some((p) => p === 'middle-eastern' || p === 'sovereign-wealth')) {
    if (['Cayman Islands', 'Mauritius'].includes(j.name)) {
      score.taxEfficiency += 10
      score.lpFamiliarity += 6
    }
  }

  if (brief.fundSize === 'under-50m' && j.name === 'Luxembourg') {
    score.costScore -= 20
  }

  if (brief.fundSize === '1b-plus' && j.name === 'Luxembourg') {
    score.lpFamiliarity += 14
    score.taxEfficiency += 8
  }

  if (brief.priorities[0] === 'speed-to-close' && ['Cayman Islands', 'British Virgin Islands (BVI)'].includes(j.name)) {
    score.speedToClose += 18
  }

  if (brief.priorities[0] === 'tax-efficiency' && ['Luxembourg', 'Netherlands'].includes(j.name)) {
    score.taxEfficiency += 14
  }

  ;(Object.keys(score) as (keyof JurisdictionScore)[]).forEach((key) => {
    if (key !== 'overallScore') {
      score[key] = Math.min(100, Math.max(0, score[key]))
    }
  })

  return score
}

function weightedOverallScore(score: JurisdictionScore, priorities: Priority[]): number {
  let weightedTotal = 0
  let divisor = 0

  priorities.forEach((priority, index) => {
    const weight = BASE_WEIGHTS[index] ?? 1
    const key = PRIORITY_TO_SCORE_KEY[priority]
    weightedTotal += score[key] * weight
    divisor += weight
  })

  if (divisor === 0) {
    const avg = (score.taxEfficiency + score.lpFamiliarity + score.regulatorySimplicity + score.speedToClose + score.costScore + score.privacyScore) / 6
    return Number(avg.toFixed(1))
  }

  return Number((weightedTotal / divisor).toFixed(1))
}

function buildConsiderations(brief: ArchitectBrief, j: JurisdictionProfile, score: JurisdictionScore): string[] {
  const points: string[] = [
    `Setup expectations are approximately ${j.setupTimeWeeks.min}-${j.setupTimeWeeks.max} weeks with formation costs around $${(j.formationCostRange.min / 1000).toFixed(0)}k-$${(j.formationCostRange.max / 1000).toFixed(0)}k.`,
    `Jurisdiction coverage status in the platform is currently marked as ${j.coverageStatus}.`,
  ]

  if (brief.lpProfile.includes('us-tax-exempt')) {
    points.push('Model blocker and UBTI/ECI leakage early in fund documentation for tax-exempt LP classes.')
  }

  if (brief.lpProfile.includes('middle-eastern') || brief.lpProfile.includes('sovereign-wealth')) {
    points.push('For GCC sovereign capital, confirm treaty routing and evaluate ADGM feeder alignment as a parallel option.')
  }

  if (score.costScore < 55) {
    points.push('Operating and governance costs are relatively high versus faster offshore alternatives.')
  }

  points.push(`Primary implementation vehicle is typically ${j.primaryVehicles[0]}.`)

  return points.slice(0, 5)
}

export function generateRecommendations(
  brief: ArchitectBrief,
  jurisdictions: JurisdictionProfile[]
): FundStructureRecommendation[] {
  const ranked = jurisdictions
    .map((j) => {
      const scored = applyBriefRules(buildBaseScore(j), brief, j)
      scored.overallScore = weightedOverallScore(scored, brief.priorities)
      return { jurisdiction: j, scores: scored }
    })
    .sort((a, b) => b.scores.overallScore - a.scores.overallScore)
    .slice(0, 3)

  return ranked.map((entry, index) => {
    const recommendation: FundStructureRecommendation = {
      jurisdiction: entry.jurisdiction.name,
      vehicleType: entry.jurisdiction.primaryVehicles[0],
      rank: (index + 1) as 1 | 2 | 3,
      reasoning:
        index === 0
          ? `${entry.jurisdiction.name} ranks highest because it aligns strongly with your top priorities (${brief.priorities.join(', ')}) while balancing launch timing, investor familiarity, and tax position.`
          : `${entry.jurisdiction.name} is a competitive alternative with solid alignment to your target LP base and execution profile.`,
      scores: entry.scores,
      estimatedFormationCost: entry.jurisdiction.formationCostRange,
      estimatedTimelineWeeks: entry.jurisdiction.setupTimeWeeks,
      bestFor: entry.jurisdiction.bestFor,
      notIdealFor: entry.jurisdiction.notIdealFor,
      keyConsiderations: buildConsiderations(brief, entry.jurisdiction, entry.scores),
    }

    return recommendation
  })
}
