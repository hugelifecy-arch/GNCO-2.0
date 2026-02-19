export type LPType =
  | 'US Pension Fund'
  | 'US ERISA Plan'
  | 'US Endowment'
  | 'US Foundation'
  | 'US Pension'
  | 'Institutional Investor'

export const LP_ENTITY_TYPES: LPType[] = [
  'US Pension Fund',
  'US ERISA Plan',
  'US Endowment',
  'US Foundation',
  'US Pension',
  'Institutional Investor',
]

export type ComplianceSeverity = 'green' | 'amber' | 'red'

export interface LPComplianceInput {
  legalName: string
  domicile: string
  lpType: LPType
  commitmentAmount: number
  hasUSBeneficialOwners: boolean
}

export interface FundComplianceProfile {
  fundDomicile: string
  usesLeverage: boolean
  hasUSAssets: boolean
  totalFundCommitments?: number
  existingERISACommitments?: number
}

export interface LPComplianceResult {
  status: ComplianceSeverity
  findings: string[]
  taxForms: string[]
  npprCountries: string[]
  erisaPlanPercentage: number
  requiresCounselReview: boolean
}

const EU_DOMICILES = new Set([
  'Germany',
  'France',
  'Netherlands',
  'Ireland',
  'Luxembourg',
  'Spain',
  'Italy',
  'Belgium',
])

const NON_EU_FUND_DOMICILES = new Set(['Cayman Islands', 'BVI', 'Jersey'])

export const FATCA_CLASSIFICATIONS = {
  US_LP: 'FATCA W-9 required',
  NON_US_WITH_US_BO: 'W-8BEN-E required',
  EU_CRS: 'CRS self-certification required',
}

function isUS(domicile: string) {
  return domicile === 'United States'
}

function isEU(domicile: string) {
  return EU_DOMICILES.has(domicile)
}

export function evaluateLPCompliance(lp: LPComplianceInput, fund: FundComplianceProfile): LPComplianceResult {
  const findings: string[] = []
  let hasWarn = false
  let hasError = false

  const totalCommitments = Math.max(fund.totalFundCommitments ?? 0, lp.commitmentAmount)
  const erisaCommitments =
    (fund.existingERISACommitments ?? 0) +
    (lp.lpType === 'US Pension Fund' || lp.lpType === 'US ERISA Plan' ? lp.commitmentAmount : 0)
  const erisaPlanPercentage = totalCommitments > 0 ? (erisaCommitments / totalCommitments) * 100 : 0

  if (lp.lpType === 'US Pension Fund' || lp.lpType === 'US ERISA Plan') {
    if (erisaPlanPercentage >= 25) {
      hasError = true
      findings.push(
        'ERISA plan assets threshold exceeded. Fund may be subject to ERISA — urgent counsel review required.'
      )
    } else if (erisaPlanPercentage >= 20) {
      hasWarn = true
      findings.push(
        'ERISA plan assets risk — benefit plan investors approaching 25% threshold. Review with ERISA counsel.'
      )
    }
  }

  if ((lp.lpType === 'US Endowment' || lp.lpType === 'US Foundation' || lp.lpType === 'US Pension') && fund.usesLeverage) {
    hasWarn = true
    findings.push('UBTI exposure likely for this LP given fund leverage. Consider blocker structure.')
  }

  if (fund.hasUSAssets && !isUS(lp.domicile)) {
    hasWarn = true
    findings.push('ECI risk for non-US LP. Review treaty protection and FIRPTA withholding obligations.')
  }

  const taxForms: string[] = []
  if (isUS(lp.domicile)) {
    taxForms.push(FATCA_CLASSIFICATIONS.US_LP)
  } else if (lp.hasUSBeneficialOwners) {
    taxForms.push(FATCA_CLASSIFICATIONS.NON_US_WITH_US_BO)
  }

  if (isEU(lp.domicile)) {
    taxForms.push(FATCA_CLASSIFICATIONS.EU_CRS)
  }

  const npprCountries: string[] = []
  if (NON_EU_FUND_DOMICILES.has(fund.fundDomicile) && isEU(lp.domicile)) {
    npprCountries.push(lp.domicile)
    hasWarn = true
    findings.push(`AIFMD NPPR registration required for ${lp.domicile} before subscription.`)
  }

  return {
    status: hasError ? 'red' : hasWarn ? 'amber' : 'green',
    findings,
    taxForms,
    npprCountries,
    erisaPlanPercentage,
    requiresCounselReview: hasError || hasWarn,
  }
}
