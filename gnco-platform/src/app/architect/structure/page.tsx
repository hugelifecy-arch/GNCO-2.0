'use client'

import { useState, useCallback } from 'react'
import ReactFlow, {
  Node, Edge, Background, Controls, MiniMap,
  addEdge, Connection, useNodesState, useEdgesState,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { STRUCTURE_TEMPLATES } from '@/data/structure-templates'
import { FundStructureTemplate, StructureNode, EntityType } from '@/types/structure-diagram'

const NODE_COLORS: Record<EntityType, string> = {
  'gp-entity': '#1e3a5f',
  'fund-vehicle': '#0f2027',
  'feeder-fund': '#374151',
  'lp-position': '#1a3a2a',
  'management-company': '#1a2e1a',
  'carry-vehicle': '#3d2a00',
}

const NODE_BORDER: Record<EntityType, string> = {
  'gp-entity': '#3b82f6',
  'fund-vehicle': '#a78bfa',
  'feeder-fund': '#9ca3af',
  'lp-position': '#34d399',
  'management-company': '#4ade80',
  'carry-vehicle': '#f59e0b',
}

const ENTITY_LABELS: Record<EntityType, string> = {
  'gp-entity': 'General Partner',
  'fund-vehicle': 'Fund Vehicle',
  'feeder-fund': 'Feeder Fund',
  'lp-position': 'LP Position',
  'management-company': 'Management Company',
  'carry-vehicle': 'Carry Vehicle',
}

function toRFNode(sn: StructureNode, index: number): Node {
  const x = (index % 3) * 290 + 60
  const y = Math.floor(index / 3) * 200 + 60
  return {
    id: sn.id,
    position: { x, y },
    data: {
      label: (
        <div style={{ textAlign: 'center', fontSize: 12 }}>
          <div style={{ fontWeight: 700 }}>{sn.label}</div>
          <div style={{ opacity: 0.7, fontSize: 10 }}>{sn.jurisdiction}</div>
          <div style={{ opacity: 0.55, fontSize: 10 }}>{sn.entityForm}</div>
        </div>
      ),
      raw: sn,
    },
    style: {
      background: NODE_COLORS[sn.type],
      border: `2px solid ${NODE_BORDER[sn.type]}`,
      borderRadius: 8,
      color: '#fff',
      padding: '10px 14px',
      minWidth: 175,
      minHeight: 75,
    },
  }
}

function toRFEdge(se: StructureEdge): Edge {
  const styles: Record<string, { stroke: string; strokeDasharray?: string }> = {
    capital:  { stroke: '#34d399' },
    control:  { stroke: '#60a5fa', strokeDasharray: '5 5' },
    fee:      { stroke: '#f59e0b', strokeDasharray: '3 3' },
  }
  return {
    id: se.id,
    source: se.source,
    target: se.target,
    label: se.label,
    animated: se.edgeType === 'capital',
    style: styles[se.edgeType] ?? { stroke: '#9ca3af' },
    labelStyle: { fill: '#d1d5db', fontSize: 10 },
    labelBgStyle: { fill: '#111827', fillOpacity: 0.8 },
  }
}

// need to import StructureEdge for the toRFEdge function
import { StructureEdge } from '@/types/structure-diagram'

export default function StructureDiagramPage() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<FundStructureTemplate>(STRUCTURE_TEMPLATES[0])
  const [selectedNode, setSelectedNode] = useState<StructureNode | null>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState(
    selectedTemplate.nodes.map(toRFNode)
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    selectedTemplate.edges.map(toRFEdge)
  )

  const loadTemplate = useCallback(
    (t: FundStructureTemplate) => {
      setSelectedTemplate(t)
      setSelectedNode(null)
      setNodes(t.nodes.map(toRFNode))
      setEdges(t.edges.map(toRFEdge))
    },
    [setNodes, setEdges]
  )

  const onConnect = useCallback(
    (c: Connection) => setEdges((eds) => addEdge(c, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.data?.raw) setSelectedNode(node.data.raw as StructureNode)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif' }}>

      {/* Sidebar */}
      <aside style={{ width: 255, borderRight: '1px solid #1f2937', overflowY: 'auto', padding: 16 }}>
        <p style={{ fontSize: 11, letterSpacing: 2, color: '#6b7280', margin: '0 0 12px' }}>
          STRUCTURE TEMPLATES
        </p>
        {STRUCTURE_TEMPLATES.map((t) => (
          <button key={t.id} onClick={() => loadTemplate(t)} style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '10px 12px', marginBottom: 6, borderRadius: 6, cursor: 'pointer',
            border: selectedTemplate.id === t.id ? '1px solid #3b82f6' : '1px solid #1f2937',
            background: selectedTemplate.id === t.id ? '#1e3a5f' : '#111827', color: '#fff',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 600 }}>{t.name}</div>
            <div style={{ color: '#9ca3af', fontSize: 10, marginTop: 3 }}>{t.description}</div>
          </button>
        ))}

        <p style={{ fontSize: 11, letterSpacing: 2, color: '#6b7280', margin: '20px 0 8px' }}>LEGEND</p>
        {(Object.keys(NODE_COLORS) as EntityType[]).map((type) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <div style={{ width: 11, height: 11, borderRadius: 2, background: NODE_COLORS[type], border: `1px solid ${NODE_BORDER[type]}` }} />
            <span style={{ fontSize: 11, color: '#d1d5db' }}>{ENTITY_LABELS[type]}</span>
          </div>
        ))}
        <div style={{ marginTop: 14, fontSize: 10, color: '#6b7280', lineHeight: 1.7 }}>
          <div>── Capital flow</div>
          <div>- - Control / Management</div>
          <div>··· Fee flow</div>
        </div>
      </aside>

      {/* Diagram */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: '#111827', border: '1px solid #1f2937', borderRadius: 8, padding: '8px 14px' }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedTemplate.name}</div>
          <div style={{ color: '#9ca3af', fontSize: 11 }}>{selectedTemplate.description}</div>
        </div>

        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect} onNodeClick={onNodeClick}
          fitView attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} color="#1f2937" />
          <Controls style={{ background: '#111827', border: '1px solid #1f2937' }} />
          <MiniMap style={{ background: '#111827', border: '1px solid #1f2937' }}
            nodeColor={(n) => {
              const raw = n.data?.raw as StructureNode | undefined
              return raw ? NODE_BORDER[raw.type] : '#374151'
            }}
          />
        </ReactFlow>

        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: '#111827', border: '1px solid #1f2937', borderRadius: 6, padding: '5px 14px', fontSize: 10, color: '#6b7280' }}>
          Illustrative structures only. Not legal advice. Verify with qualified counsel.
        </div>
      </div>

      {/* Detail panel */}
      {selectedNode && (
        <aside style={{ width: 275, borderLeft: '1px solid #1f2937', padding: 16, overflowY: 'auto', background: '#0d1117' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, letterSpacing: 2, color: '#6b7280' }}>ENTITY DETAIL</span>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 6, marginBottom: 14, background: NODE_COLORS[selectedNode.type], border: `1px solid ${NODE_BORDER[selectedNode.type]}` }}>
            <div style={{ fontWeight: 700 }}>{selectedNode.label}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{ENTITY_LABELS[selectedNode.type]}</div>
          </div>
          {[
            ['JURISDICTION', selectedNode.jurisdiction],
            ['ENTITY FORM', selectedNode.entityForm],
            ['TAX TREATMENT', selectedNode.taxTreatment],
            ['EST. ANNUAL COST', selectedNode.estimatedAnnualCost],
            ['NOTES', selectedNode.notes],
          ].map(([label, value]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: 1, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, color: '#e5e7eb', lineHeight: 1.5 }}>{value}</div>
            </div>
          ))}
        </aside>
      )}
    </div>
  )
}
