import { JURISDICTIONS } from '@/lib/jurisdiction-data'
import { getComplianceObligationsForJurisdiction } from '@/lib/compliance-obligations'
import { JURISDICTION_METADATA } from '@/lib/jurisdiction-metadata'

export const JURISDICTIONS_CANONICAL = JURISDICTIONS.map((jurisdiction) => ({
  ...jurisdiction,
  ...JURISDICTION_METADATA[jurisdiction.id],
  compliance_obligations: getComplianceObligationsForJurisdiction(jurisdiction.id),
}))
