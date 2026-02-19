export const STRUCTURE_DIAGRAM_STORAGE_KEY = 'gnco:structure-diagram'

export type DiagramNodeType =
  | 'gpEntity'
  | 'fundVehicle'
  | 'feederFund'
  | 'lpPosition'
  | 'managementCompany'
  | 'carryVehicle'

export type DiagramFlowType = 'capital' | 'management' | 'fee'

export type StructureDiagramNode = {
  id: string
  label: string
  type: DiagramNodeType
  x: number
  y: number
  jurisdiction: string
  entityType: string
  taxTreatment: string
  regulatoryStatus: string
  annualCost: string
}

export type StructureDiagramEdge = {
  id: string
  source: string
  target: string
  flowType: DiagramFlowType
}

export type StructureDiagramSnapshot = {
  template: string
  nodeCount: number
  edgeCount: number
  exportedAt: string
  nodes: StructureDiagramNode[]
  edges: StructureDiagramEdge[]
}
