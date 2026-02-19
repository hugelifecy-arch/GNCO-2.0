export type FundStrategy = 'private-equity' | 'real-estate' | 'venture-capital' | 'private-credit'

export type ScoringInputs = {
  fundSize: number
  lpCount: number
  strategy: FundStrategy
}

export const defaultScoringInputs: ScoringInputs = {
  fundSize: 100,
  lpCount: 15,
  strategy: 'private-equity',
}

const BASE_SCORES: Record<string, number> = {
  ireland: 87,
  bvi: 71,
  jersey: 79,
  'cayman-islands': 89,
  luxembourg: 82,
  'delaware-usa': 87,
  singapore: 85,
  cyprus: 83,
}

const STRATEGY_OFFSETS: Record<FundStrategy, Partial<Record<string, number>>> = {
  'private-equity': {
    ireland: 0,
    bvi: 0,
    jersey: 0,
  },
  'real-estate': {
    ireland: -2,
    bvi: -4,
    jersey: -1,
  },
  'venture-capital': {
    ireland: -1,
    bvi: 2,
    jersey: 1,
  },
  'private-credit': {
    ireland: 1,
    bvi: -2,
    jersey: 1,
  },
}

export function scoreJurisdiction(jurisdictionId: string, inputs: ScoringInputs): number {
  const baseScore = BASE_SCORES[jurisdictionId] ?? 75

  const strategyOffset = STRATEGY_OFFSETS[inputs.strategy][jurisdictionId] ?? 0

  const scalePenalty = inputs.fundSize >= 250 ? 2 : 0
  const lpComplexityPenalty = inputs.lpCount >= 30 ? 2 : 0

  return Math.max(40, Math.min(100, baseScore + strategyOffset - scalePenalty - lpComplexityPenalty))
}
