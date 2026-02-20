export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type ObligationFrequency = 'annual' | 'semi-annual' | 'quarterly' | 'monthly' | 'one-time'
export type ObligationCategory =
  | 'regulatory-filing'
  | 'tax-filing'
  | 'audit'
  | 'aml-kyc'
  | 'lp-reporting'
  | 'government-fee'

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
  impact: ImpactLevel
}

export interface FundProfile {
  fund_name: string
  jurisdiction_id: string
  vehicle_type: string
  financial_year_end_month: number
  financial_year_end_day: number
  formation_date: string
}

export interface CalendarEvent {
  id: string
  obligation: ComplianceObligation
  due_date: Date
  status: 'upcoming' | 'due-soon' | 'overdue'
  days_until_due: number
}
