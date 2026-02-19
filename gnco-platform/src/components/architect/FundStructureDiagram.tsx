'use client'

import { useMemo, useRef, useState, type Dispatch, type DragEvent, type MouseEvent, type SetStateAction } from 'react'

import {
  STRUCTURE_DIAGRAM_STORAGE_KEY,
  type DiagramFlowType,
  type DiagramNodeType,
  type StructureDiagramEdge,
  type StructureDiagramNode,
  type StructureDiagramSnapshot,
} from '@/lib/structure-diagram'

type DiagramTemplate = {
  label: string
  nodes: StructureDiagramNode[]
  edges: StructureDiagramEdge[]
}

const NODE_STYLE: Record<DiagramNodeType, { shape: 'square' | 'circle' | 'diamond' | 'rectangle' | 'hexagon'; color: string }> = {
  gpEntity: { shape: 'square', color: '#3b82f6' },
  fundVehicle: { shape: 'circle', color: '#111827' },
  feederFund: { shape: 'diamond', color: '#6b7280' },
  lpPosition: { shape: 'rectangle', color: '#d1d5db' },
  managementCompany: { shape: 'hexagon', color: '#10b981' },
  carryVehicle: { shape: 'rectangle', color: '#f59e0b' },
}

const EDGE_STYLE: Record<DiagramFlowType, { color: string; dash?: string; label: string }> = {
  capital: { color: '#16a34a', label: 'Capital flow' },
  management: { color: '#2563eb', dash: '8 6', label: 'Management/control' },
  fee: { color: '#d4a017', dash: '2 6', label: 'Fee flow' },
}

const templates: DiagramTemplate[] = [
  {
    label: 'Standard Cayman PE Fund',
    nodes: [
      baseNode('1', 'Cayman GP', 'gpEntity', 160, 80, 'Cayman Islands', 'Exempted Company'),
      baseNode('2', 'Cayman Fund', 'fundVehicle', 440, 180, 'Cayman Islands', 'Exempted Limited Partnership'),
      baseNode('3', 'US Feeder', 'feederFund', 180, 240, 'Delaware', 'LP'),
      baseNode('4', 'LP Base', 'lpPosition', 160, 380, 'Global', 'LP Position'),
      baseNode('5', 'Manager Co', 'managementCompany', 720, 120, 'Cayman Islands', 'Company'),
      baseNode('6', 'Carry SPV', 'carryVehicle', 720, 280, 'Cayman Islands', 'LLC'),
    ],
    edges: [
      edge('e1', '4', '3', 'capital'),
      edge('e2', '3', '2', 'capital'),
      edge('e3', '2', '1', 'management'),
      edge('e4', '2', '5', 'fee'),
      edge('e5', '2', '6', 'fee'),
    ],
  },
  {
    label: 'Luxembourg RAIF with US Parallel',
    nodes: [
      baseNode('1', 'Lux GP', 'gpEntity', 140, 80, 'Luxembourg', 'SARL'),
      baseNode('2', 'Lux RAIF', 'fundVehicle', 420, 180, 'Luxembourg', 'RAIF'),
      baseNode('3', 'US Parallel', 'feederFund', 170, 260, 'Delaware', 'LP'),
      baseNode('4', 'LP Pool', 'lpPosition', 140, 390, 'US / EU', 'LP Position'),
      baseNode('5', 'AIFM / ManCo', 'managementCompany', 700, 110, 'Luxembourg', 'Management Company'),
      baseNode('6', 'Carry Plan', 'carryVehicle', 700, 280, 'Luxembourg', 'SCSp'),
    ],
    edges: [edge('e1', '4', '3', 'capital'), edge('e2', '3', '2', 'capital'), edge('e3', '5', '2', 'management'), edge('e4', '2', '6', 'fee')],
  },
  {
    label: 'Singapore VCC with Cayman GP',
    nodes: [
      baseNode('1', 'Cayman GP', 'gpEntity', 150, 80, 'Cayman Islands', 'Company'),
      baseNode('2', 'Singapore VCC', 'fundVehicle', 430, 180, 'Singapore', 'VCC'),
      baseNode('3', 'SEA Feeder', 'feederFund', 170, 260, 'Singapore', 'LP'),
      baseNode('4', 'LP Cohort', 'lpPosition', 160, 390, 'Asia', 'LP Position'),
      baseNode('5', 'SG ManCo', 'managementCompany', 700, 120, 'Singapore', 'Management Company'),
      baseNode('6', 'Carry Pool', 'carryVehicle', 700, 290, 'Cayman Islands', 'LLC'),
    ],
    edges: [edge('e1', '4', '3', 'capital'), edge('e2', '3', '2', 'capital'), edge('e3', '1', '2', 'management'), edge('e4', '2', '5', 'fee'), edge('e5', '2', '6', 'fee')],
  },
  {
    label: 'Ireland QIAIF with Delaware GP',
    nodes: [
      baseNode('1', 'Delaware GP', 'gpEntity', 150, 80, 'Delaware', 'LLC'),
      baseNode('2', 'Ireland QIAIF', 'fundVehicle', 440, 180, 'Ireland', 'ICAV'),
      baseNode('3', 'US Feeder', 'feederFund', 160, 260, 'Delaware', 'LP'),
      baseNode('4', 'LP Base', 'lpPosition', 140, 390, 'US / EU', 'LP Position'),
      baseNode('5', 'Irish ManCo', 'managementCompany', 710, 120, 'Ireland', 'Management Company'),
      baseNode('6', 'Carry SPV', 'carryVehicle', 710, 290, 'Ireland', 'DAC'),
    ],
    edges: [edge('e1', '4', '3', 'capital'), edge('e2', '3', '2', 'capital'), edge('e3', '1', '2', 'management'), edge('e4', '2', '5', 'management'), edge('e5', '2', '6', 'fee')],
  },
  {
    label: 'DIFC Fund with GCC LP Base',
    nodes: [
      baseNode('1', 'DIFC GP', 'gpEntity', 160, 80, 'UAE (DIFC)', 'Company'),
      baseNode('2', 'DIFC Fund', 'fundVehicle', 430, 180, 'UAE (DIFC)', 'Prescribed Company'),
      baseNode('3', 'GCC Feeder', 'feederFund', 160, 260, 'UAE', 'LP'),
      baseNode('4', 'GCC LP Base', 'lpPosition', 140, 390, 'GCC', 'LP Position'),
      baseNode('5', 'DIFC ManCo', 'managementCompany', 710, 120, 'UAE (DIFC)', 'Management Company'),
      baseNode('6', 'Carry Vehicle', 'carryVehicle', 710, 290, 'UAE', 'LLC'),
    ],
    edges: [edge('e1', '4', '3', 'capital'), edge('e2', '3', '2', 'capital'), edge('e3', '1', '2', 'management'), edge('e4', '2', '5', 'management'), edge('e5', '2', '6', 'fee')],
  },
]

const palette: { type: DiagramNodeType; label: string }[] = [
  { type: 'gpEntity', label: 'GP Entity' },
  { type: 'fundVehicle', label: 'Fund Vehicle' },
  { type: 'feederFund', label: 'Feeder Fund' },
  { type: 'lpPosition', label: 'LP Position' },
  { type: 'managementCompany', label: 'Management Company' },
  { type: 'carryVehicle', label: 'Carry Vehicle' },
]

export function FundStructureDiagram() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].label)
  const [nodes, setNodes] = useState(templates[0].nodes)
  const [edges, setEdges] = useState(templates[0].edges)
  const [selectedNodeId, setSelectedNodeId] = useState(nodes[0]?.id ?? null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null

  const connections = useMemo(() => {
    if (!selectedNode) return []
    return edges.filter((edgeItem) => edgeItem.source === selectedNode.id || edgeItem.target === selectedNode.id)
      .map((edgeItem) => {
        const counterpartId = edgeItem.source === selectedNode.id ? edgeItem.target : edgeItem.source
        const counterpart = nodes.find((node) => node.id === counterpartId)
        return `${EDGE_STYLE[edgeItem.flowType].label} ↔ ${counterpart?.label ?? counterpartId}`
      })
  }, [edges, nodes, selectedNode])

  const applyTemplate = (label: string) => {
    const template = templates.find((item) => item.label === label)
    if (!template) return
    setSelectedTemplate(label)
    setNodes(template.nodes)
    setSelectedNodeId(template.nodes[0]?.id ?? null)
    setEdges(template.edges)
  }

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!draggingId || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(20, Math.min(event.clientX - rect.left, rect.width - 120))
    const y = Math.max(20, Math.min(event.clientY - rect.top, rect.height - 60))

    setNodes((current) => current.map((node) => (node.id === draggingId ? { ...node, x, y } : node)))
  }

  const exportSvg = () => {
    const content = buildSvg(nodes, edges)
    downloadBlob(new Blob([content], { type: 'image/svg+xml;charset=utf-8' }), 'gnco-fund-structure.svg')
  }

  const exportPng = async () => {
    const svgContent = buildSvg(nodes, edges)
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 960
      canvas.height = 560
      const context = canvas.getContext('2d')
      if (context) {
        context.fillStyle = '#0b1020'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0)
        canvas.toBlob((pngBlob) => {
          if (pngBlob) downloadBlob(pngBlob, 'gnco-fund-structure.png')
        })
      }
      URL.revokeObjectURL(url)
    }
    image.src = url
  }

  const saveForBrief = () => {
    const snapshot: StructureDiagramSnapshot = {
      template: selectedTemplate,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      exportedAt: new Date().toISOString(),
      nodes,
      edges,
    }
    window.localStorage.setItem(STRUCTURE_DIAGRAM_STORAGE_KEY, JSON.stringify(snapshot))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-text-secondary">Template:</label>
        <select value={selectedTemplate} onChange={(event) => applyTemplate(event.target.value)} className="rounded-md border border-bg-border bg-bg-surface px-3 py-2 text-sm">
          {templates.map((template) => <option key={template.label}>{template.label}</option>)}
        </select>
        <button type="button" onClick={exportPng} className="rounded-md border border-bg-border px-3 py-2 text-sm">Export PNG</button>
        <button type="button" onClick={exportSvg} className="rounded-md border border-bg-border px-3 py-2 text-sm">Export SVG</button>
        <button type="button" onClick={saveForBrief} className="rounded-md border border-accent-gold px-3 py-2 text-sm text-accent-gold">Include in Attorney Brief PDF</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr_280px]">
        <aside className="rounded-lg border border-bg-border bg-bg-surface p-3">
          <h3 className="text-sm font-semibold">Node palette (drag)</h3>
          <ul className="mt-2 space-y-2 text-xs">
            {palette.map((item) => (
              <li
                key={item.type}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('application/gnco-node-type', item.type)}
                className="cursor-grab rounded border border-bg-border p-2 active:cursor-grabbing"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </aside>

        <div
          ref={canvasRef}
          className="relative h-[560px] rounded-xl border border-bg-border bg-[#0b1020]"
          onMouseMove={onMouseMove}
          onMouseUp={() => setDraggingId(null)}
          onMouseLeave={() => setDraggingId(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => addNodeFromPalette(event, canvasRef.current, setNodes)}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#fff" />
              </marker>
            </defs>
            {edges.map((edgeItem) => {
              const source = nodes.find((node) => node.id === edgeItem.source)
              const target = nodes.find((node) => node.id === edgeItem.target)
              if (!source || !target) return null
              const sx = source.x + 56
              const sy = source.y + 28
              const tx = target.x + 56
              const ty = target.y + 28
              return <line key={edgeItem.id} x1={sx} y1={sy} x2={tx} y2={ty} stroke={EDGE_STYLE[edgeItem.flowType].color} strokeWidth={2.6} strokeDasharray={EDGE_STYLE[edgeItem.flowType].dash} markerEnd="url(#arrow)" />
            })}
          </svg>

          {nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              onMouseDown={() => setDraggingId(node.id)}
              onClick={() => setSelectedNodeId(node.id)}
              className="absolute h-14 w-28 text-[11px] font-semibold text-white"
              style={{ left: node.x, top: node.y }}
            >
              <NodeShape node={node} isActive={node.id === selectedNodeId} />
            </button>
          ))}
        </div>

        <aside className="rounded-lg border border-bg-border bg-bg-surface p-4 text-sm">
          <h3 className="font-semibold">Node Properties</h3>
          {selectedNode ? (
            <dl className="mt-2 space-y-2 text-text-secondary">
              <div><dt className="font-medium text-text-primary">Name</dt><dd>{selectedNode.label}</dd></div>
              <div><dt className="font-medium text-text-primary">Jurisdiction</dt><dd>{selectedNode.jurisdiction}</dd></div>
              <div><dt className="font-medium text-text-primary">Entity type</dt><dd>{selectedNode.entityType}</dd></div>
              <div><dt className="font-medium text-text-primary">Tax treatment</dt><dd>{selectedNode.taxTreatment}</dd></div>
              <div><dt className="font-medium text-text-primary">Regulatory status</dt><dd>{selectedNode.regulatoryStatus}</dd></div>
              <div><dt className="font-medium text-text-primary">Estimated annual cost</dt><dd>{selectedNode.annualCost}</dd></div>
              <div><dt className="font-medium text-text-primary">Connections</dt><dd>{connections.join(', ') || 'No direct connections'}</dd></div>
            </dl>
          ) : <p className="mt-2 text-text-secondary">Select a node to inspect entity details.</p>}
        </aside>
      </div>
    </div>
  )
}

function NodeShape({ node, isActive }: { node: StructureDiagramNode; isActive: boolean }) {
  const style = NODE_STYLE[node.type]
  const stroke = isActive ? '#f8fafc' : 'transparent'
  return (
    <svg viewBox="0 0 112 56" className="h-full w-full">
      {style.shape === 'square' ? <rect x="8" y="4" width="96" height="48" rx="4" fill={style.color} stroke={stroke} strokeWidth="2" /> : null}
      {style.shape === 'circle' ? <ellipse cx="56" cy="28" rx="44" ry="22" fill={style.color} stroke={stroke} strokeWidth="2" /> : null}
      {style.shape === 'diamond' ? <polygon points="56,4 100,28 56,52 12,28" fill={style.color} stroke={stroke} strokeWidth="2" /> : null}
      {style.shape === 'rectangle' ? <rect x="8" y="10" width="96" height="36" rx="6" fill={style.color} stroke={stroke} strokeWidth="2" /> : null}
      {style.shape === 'hexagon' ? <polygon points="24,6 88,6 106,28 88,50 24,50 6,28" fill={style.color} stroke={stroke} strokeWidth="2" /> : null}
      <text x="56" y="32" textAnchor="middle" fill={node.type === 'lpPosition' ? '#111827' : '#fff'} fontSize="10">{node.label}</text>
    </svg>
  )
}

function baseNode(id: string, label: string, type: DiagramNodeType, x: number, y: number, jurisdiction: string, entityType: string): StructureDiagramNode {
  return {
    id,
    label,
    type,
    x,
    y,
    jurisdiction,
    entityType,
    taxTreatment: 'Pass-through assumptions; verify by LP profile and treaty matrix.',
    regulatoryStatus: 'Manager authorization and AML/KYC controls required.',
    annualCost: 'USD 35k-120k (estimate)',
  }
}

function edge(id: string, source: string, target: string, flowType: DiagramFlowType): StructureDiagramEdge {
  return { id, source, target, flowType }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}


function addNodeFromPalette(
  event: DragEvent<HTMLDivElement>,
  canvas: HTMLDivElement | null,
  setNodes: Dispatch<SetStateAction<StructureDiagramNode[]>>,
) {
  event.preventDefault()
  if (!canvas) return

  const nodeType = event.dataTransfer.getData('application/gnco-node-type') as DiagramNodeType
  if (!nodeType) return

  const rect = canvas.getBoundingClientRect()
  const x = Math.max(20, Math.min(event.clientX - rect.left, rect.width - 120))
  const y = Math.max(20, Math.min(event.clientY - rect.top, rect.height - 60))

  setNodes((current) => {
    const id = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const label = palette.find((item) => item.type === nodeType)?.label ?? 'Entity'
    return [
      ...current,
      baseNode(id, label, nodeType, x, y, 'TBD', 'TBD'),
    ]
  })
}

function buildSvg(nodes: StructureDiagramNode[], edges: StructureDiagramEdge[]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="560" viewBox="0 0 960 560"><rect width="960" height="560" fill="#0b1020"/>${edges
    .map((edgeItem) => {
      const source = nodes.find((node) => node.id === edgeItem.source)
      const target = nodes.find((node) => node.id === edgeItem.target)
      if (!source || !target) return ''
      const style = EDGE_STYLE[edgeItem.flowType]
      const dash = style.dash ? `stroke-dasharray="${style.dash}"` : ''
      return `<line x1="${source.x + 56}" y1="${source.y + 28}" x2="${target.x + 56}" y2="${target.y + 28}" stroke="${style.color}" stroke-width="2.5" ${dash}/>`
    })
    .join('')}${nodes.map((node) => `<g><rect x="${node.x}" y="${node.y}" width="112" height="56" fill="${NODE_STYLE[node.type].color}" rx="8"/><text x="${node.x + 56}" y="${node.y + 32}" fill="#fff" text-anchor="middle" font-size="10">${node.label}</text></g>`).join('')}</svg>`
}
