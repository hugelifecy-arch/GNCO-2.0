export type UpdateImpact = 'HIGH' | 'MEDIUM' | 'LOW'
export type UpdateStatus = 'active' | 'draft' | 'archived'

export interface RegulatoryUpdate {
  id: string
  jurisdiction_id: string
  jurisdiction_name: string
  title: string
  summary: string
  detail: string
  impact: UpdateImpact
  status: UpdateStatus
  effective_date: string
  published_date: string
  affects_vehicle_types: string[]
  affects_lp_types: string[]
  action_required: boolean
  action_description?: string
  source_url: string
  source_title: string
  tags: string[]
}
