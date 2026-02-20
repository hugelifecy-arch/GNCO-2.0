export type EntityType =
  | 'gp-entity'
  | 'fund-vehicle'
  | 'feeder-fund'
  | 'lp-position'
  | 'management-company'
  | 'carry-vehicle'

export type EdgeType = 'capital' | 'control' | 'fee'

export interface StructureNode {
  id: string
  type: EntityType
  label: string
  jurisdiction: string
  entityForm: string
  taxTreatment: string
  estimatedAnnualCost: string
  notes: string
}

export interface StructureEdge {
  id: string
  source: string
  target: string
  edgeType: EdgeType
  label?: string
}

export interface FundStructureTemplate {
  id: string
  name: string
  description: string
  nodes: StructureNode[]
  edges: StructureEdge[]
}
