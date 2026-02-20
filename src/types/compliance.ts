export type ObligationFrequency = 'annual' | 'semi-annual' | 'quarterly' | 'monthly'
export type ObligationCategory = 'regulatory-filing' | 'tax-filing' | 'audit' | 'aml-kyc' | 'lp-reporting' | 'government-fee'
export type DeadlineStatus = 'upcoming' | 'due-soon' | 'overdue'

export interface ComplianceObligation {
  id: string
  jurisdiction_id: string
  vehicle_types: string[]
  title: string
  description: string
  category: ObligationCategory
  frequency: ObligationFrequency
  typical_deadline: string
  deadline_rule: string
  consequence: string
  source_url: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface FundProfile {
  fund_name: string
  jurisdiction_id: string
  vehicle_type: string
  financial_year_end_month: number
  financial_year_end_day: number
}

export interface CalendarEvent {
  id: string
  obligation: ComplianceObligation
  due_date: Date
  status: DeadlineStatus
  days_until_due: number
}
