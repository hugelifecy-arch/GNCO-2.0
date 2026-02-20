'use client'

import { sankey, sankeyLinkHorizontal, type SankeyGraph, type SankeyLink, type SankeyNode } from 'd3-sankey'
import { useEffect, useMemo, useRef, useState } from 'react'

type CashFlowNode = SankeyNode<CashFlowNode, CashFlowLink> & {
  id: string
  name: string
}

type CashFlowLink = SankeyLink<CashFlowNode, CashFlowLink> & {
  id: string
  color: string
  flowType: 'capital' | 'fees' | 'returns' | 'carry'
  value: number
}

interface HoverState {
  x: number
  y: number
  name: string
  value: number
}

const FLOW_COLORS: Record<CashFlowLink['flowType'], string> = {
  capital: '#3b82f6',
  fees: '#ef4444',
  returns: '#34d399',
  carry: '#f59e0b',
}

const NODES: Array<Pick<CashFlowNode, 'id' | 'name'>> = [
  { id: 'lp_commitments', name: 'LP Commitments' },
  { id: 'management_fees', name: 'Management Fees' },
  { id: 'fund_capital', name: 'Fund Capital' },
  { id: 'portfolio_companies', name: 'Portfolio Companies' },
  { id: 'realized_proceeds', name: 'Realized Proceeds' },
  { id: 'carried_interest', name: 'Carried Interest' },
  { id: 'lp_distributions', name: 'LP Distributions' },
  { id: 'unrealized_nav', name: 'Unrealized NAV' },
]

const LINKS: CashFlowLink[] = [
  { id: 'l1', source: 'lp_commitments', target: 'management_fees', value: 10000000, flowType: 'fees', color: FLOW_COLORS.fees },
  { id: 'l2', source: 'lp_commitments', target: 'fund_capital', value: 90000000, flowType: 'capital', color: FLOW_COLORS.capital },
  { id: 'l3', source: 'fund_capital', target: 'portfolio_companies', value: 90000000, flowType: 'capital', color: FLOW_COLORS.capital },
  {
    id: 'l4',
    source: 'portfolio_companies',
    target: 'realized_proceeds',
    value: 120000000,
    flowType: 'returns',
    color: FLOW_COLORS.returns,
  },
  {
    id: 'l5',
    source: 'realized_proceeds',
    target: 'carried_interest',
    value: 18000000,
    flowType: 'carry',
    color: FLOW_COLORS.carry,
  },
  {
    id: 'l6',
    source: 'realized_proceeds',
    target: 'lp_distributions',
    value: 102000000,
    flowType: 'returns',
    color: FLOW_COLORS.returns,
  },
  {
    id: 'l7',
    source: 'portfolio_companies',
    target: 'unrealized_nav',
    value: 35000000,
    flowType: 'returns',
    color: FLOW_COLORS.returns,
  },
]

const formatEuro = (amount: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)

export function CashFlowSankey() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null)
  const [hoverState, setHoverState] = useState<HoverState | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  const height = 480
  const totalCommitments = LINKS.filter((link) => link.source === 'lp_commitments').reduce((sum, link) => sum + link.value, 0)

  const getLocalPointer = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()

    if (!rect) {
      return { x: clientX, y: clientY }
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const graph = useMemo(() => {
    if (!width) {
      return null
    }

    const generator = sankey<CashFlowNode, CashFlowLink>()
      .nodeId((node) => node.id)
      .nodeWidth(18)
      .nodePadding(22)
      .nodeSort(null)
      .extent([
        [20, 20],
        [Math.max(width - 20, 300), height - 20],
      ])

    return generator({
      nodes: NODES.map((node) => ({ ...node })),
      links: LINKS.map((link) => ({ ...link })),
    } as SankeyGraph<CashFlowNode, CashFlowLink>)
  }, [width])

  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
      <div className="mb-4">
        <h2 className="font-serif text-2xl text-text-primary">Cash Flow Waterfall</h2>
        <p className="text-sm text-text-secondary">Sankey view of commitment deployment, fees, and distribution outcomes.</p>
      </div>

      <div ref={containerRef} className="relative h-[480px] w-full overflow-hidden rounded-md border border-bg-border/80 bg-[#0D1520] p-2">
        {graph ? (
          <svg width="100%" height="100%" viewBox={`0 0 ${Math.max(width, 320)} ${height}`} role="img" aria-label="Cash flow Sankey diagram">
            {graph.links.map((link) => {
              const path = sankeyLinkHorizontal<CashFlowNode, CashFlowLink>()(link)
              const isHovered = hoveredLinkId === link.id

              return (
                <path
                  key={link.id}
                  d={path ?? undefined}
                  fill="none"
                  stroke={link.color}
                  strokeOpacity={isHovered ? 0.95 : 0.7}
                  strokeWidth={Math.max(link.width ?? 0, 1)}
                  onMouseEnter={(event) => {
                    setHoveredLinkId(link.id)
                    const pointer = getLocalPointer(event.clientX, event.clientY)
                    const sourceNode = link.source as CashFlowNode
                    const targetNode = link.target as CashFlowNode

                    setHoverState({
                      x: pointer.x,
                      y: pointer.y,
                      name: `${sourceNode.name} → ${targetNode.name}`,
                      value: link.value,
                    })
                  }}
                  onMouseMove={(event) => {
                    setHoverState((prev) =>
                      prev
                        ? {
                            ...prev,
                            ...getLocalPointer(event.clientX, event.clientY),
                          }
                        : prev,
                    )
                  }}
                  onMouseLeave={() => {
                    setHoveredLinkId(null)
                    setHoverState(null)
                  }}
                />
              )
            })}

            {graph.nodes.map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x0}
                  y={node.y0}
                  width={Math.max((node.x1 ?? 0) - (node.x0 ?? 0), 1)}
                  height={Math.max((node.y1 ?? 0) - (node.y0 ?? 0), 1)}
                  fill="#1e2d42"
                  stroke="#8FA3BF"
                  rx={3}
                />
                <text
                  x={(node.x0 ?? 0) < width / 2 ? (node.x1 ?? 0) + 8 : (node.x0 ?? 0) - 8}
                  y={((node.y0 ?? 0) + (node.y1 ?? 0)) / 2}
                  textAnchor={(node.x0 ?? 0) < width / 2 ? 'start' : 'end'}
                  dominantBaseline="middle"
                  fill="#F0F4FF"
                  fontSize="12"
                >
                  {node.name}
                </text>
              </g>
            ))}
          </svg>
        ) : null}

        {hoverState ? (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-[#1E2D42] bg-[#0D1520]/95 px-3 py-2 text-xs text-text-primary shadow-lg"
            style={{
              left: `${Math.min(hoverState.x + 14, width - 220)}px`,
              top: `${Math.max(hoverState.y - 20, 12)}px`,
            }}
          >
            <div className="font-medium text-brand-gold">{hoverState.name}</div>
            <div>{formatEuro(hoverState.value)}</div>
            <div className="text-text-secondary">{((hoverState.value / totalCommitments) * 100).toFixed(1)}% of total commitments</div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: FLOW_COLORS.capital }} />Capital calls</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: FLOW_COLORS.fees }} />Fee flows</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: FLOW_COLORS.returns }} />Returns</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: FLOW_COLORS.carry }} />Carry</span>
      </div>
    </section>
  )
}
