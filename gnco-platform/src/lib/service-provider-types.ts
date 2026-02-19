import type { FundSize } from '@/lib/types'

export type ServiceProviderType =
  | 'Administrator'
  | 'Auditor'
  | 'Custodian'
  | 'Legal Counsel'
  | 'Company Secretary'
  | 'Registered Office'
  | 'Banking'

export type ServiceProviderFundType = 'PE' | 'RE' | 'VC' | 'Credit' | 'Hedge'

export interface ServiceProvider {
  id: string
  name: string
  type: ServiceProviderType
  jurisdictions: string[]
  fund_types: ServiceProviderFundType[]
  fund_sizes: FundSize[]
  description: string
  website: string
  contact_email: string
  fee_range: string
  response_time: string
  gnco_verified: boolean
  logo_url: string
  featured: boolean
}
