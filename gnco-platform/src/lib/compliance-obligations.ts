export type ComplianceFrequency = 'annual' | 'quarterly' | 'one-off'

export type VehicleApplicability = 'private-fund' | 'registered-fund' | 'lp' | 'company' | 'vcc' | 'raif' | 'qiaif'

export interface ComplianceObligation {
  obligation: string
  frequency: ComplianceFrequency
  typical_deadline: string
  consequence_of_miss: string
  applies_to: VehicleApplicability[]
  description: string
  preparation_lead_time_days: number
  deadline_reference: 'fye' | 'formation'
  deadline_offset_days: number
}

const fallbackObligations: ComplianceObligation[] = [
  {
    obligation: 'Annual Regulatory Return',
    frequency: 'annual',
    typical_deadline: 'Within 6 months of financial year end',
    consequence_of_miss: 'Late fees and supervisory follow-up',
    applies_to: ['private-fund', 'registered-fund', 'company', 'lp'],
    description: 'Prepare and submit annual regulator return and supporting schedules.',
    preparation_lead_time_days: 30,
    deadline_reference: 'fye',
    deadline_offset_days: 182,
  },
  {
    obligation: 'Annual Economic Substance / Corporate Filing',
    frequency: 'annual',
    typical_deadline: 'Within 12 months of financial year end',
    consequence_of_miss: 'Administrative penalties and standing issues',
    applies_to: ['private-fund', 'registered-fund', 'company', 'lp'],
    description: 'Deliver annual corporate and economic substance compliance submission.',
    preparation_lead_time_days: 30,
    deadline_reference: 'fye',
    deadline_offset_days: 365,
  },
  {
    obligation: 'Good Standing Renewal',
    frequency: 'annual',
    typical_deadline: 'On formation anniversary',
    consequence_of_miss: 'Loss of good standing and downstream banking friction',
    applies_to: ['private-fund', 'registered-fund', 'company', 'lp'],
    description: 'Pay annual government and registry fees for good standing.',
    preparation_lead_time_days: 21,
    deadline_reference: 'formation',
    deadline_offset_days: 365,
  },
]

export const COMPLIANCE_OBLIGATIONS_BY_JURISDICTION: Record<string, ComplianceObligation[]> = {
  'cayman-islands': [
    {
      obligation: 'CIMA Annual Return',
      frequency: 'annual',
      typical_deadline: 'Within 6 months of financial year end',
      consequence_of_miss: 'Late fees + potential CIMA action',
      applies_to: ['private-fund', 'registered-fund'],
      description: 'Submit the regulated fund annual return and prescribed fees to CIMA.',
      preparation_lead_time_days: 45,
      deadline_reference: 'fye',
      deadline_offset_days: 182,
    },
    ...fallbackObligations.slice(1),
  ],
  luxembourg: [
    {
      obligation: 'RAIF Annual Accounts Approval',
      frequency: 'annual',
      typical_deadline: 'Within 6 months of financial year end',
      consequence_of_miss: 'Regulatory findings and possible sanctions',
      applies_to: ['private-fund', 'raif'],
      description: 'Approve and file annual accounts in accordance with local law.',
      preparation_lead_time_days: 45,
      deadline_reference: 'fye',
      deadline_offset_days: 182,
    },
    ...fallbackObligations.slice(1),
  ],
  delaware: [
    {
      obligation: 'Form ADV Annual Amendment',
      frequency: 'annual',
      typical_deadline: 'Within 90 days of adviser fiscal year end',
      consequence_of_miss: 'Deficiency findings and enforcement risk',
      applies_to: ['registered-fund', 'private-fund'],
      description: 'Update adviser disclosure filing for SEC or state registration.',
      preparation_lead_time_days: 30,
      deadline_reference: 'fye',
      deadline_offset_days: 90,
    },
    ...fallbackObligations.slice(1),
  ],
  singapore: [
    {
      obligation: 'Annual Return with ACRA',
      frequency: 'annual',
      typical_deadline: 'Within 7 months of financial year end',
      consequence_of_miss: 'Late lodgement penalties and enforcement actions',
      applies_to: ['vcc', 'company', 'private-fund'],
      description: 'Submit annual return and financial statements to ACRA.',
      preparation_lead_time_days: 40,
      deadline_reference: 'fye',
      deadline_offset_days: 213,
    },
    ...fallbackObligations.slice(1),
  ],
  ireland: [
    {
      obligation: 'CBI Annual Report Filing',
      frequency: 'annual',
      typical_deadline: 'Within 4 months of financial year end',
      consequence_of_miss: 'Escalation with CBI and administrative sanction risk',
      applies_to: ['qiaif', 'registered-fund'],
      description: 'Submit audited financial statements and annual report package.',
      preparation_lead_time_days: 45,
      deadline_reference: 'fye',
      deadline_offset_days: 121,
    },
    ...fallbackObligations.slice(1),
  ],
  bvi: fallbackObligations,
  jersey: fallbackObligations,
  guernsey: fallbackObligations,
  mauritius: fallbackObligations,
  'hong-kong': fallbackObligations,
  netherlands: fallbackObligations,
  bermuda: fallbackObligations,
  switzerland: fallbackObligations,
  cyprus: fallbackObligations,
  difc: fallbackObligations,
}

export function getComplianceObligationsForJurisdiction(jurisdictionId: string): ComplianceObligation[] {
  return COMPLIANCE_OBLIGATIONS_BY_JURISDICTION[jurisdictionId] ?? fallbackObligations
}
