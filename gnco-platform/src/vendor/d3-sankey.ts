export interface SankeyNode<N extends SankeyNode<N, L>, L extends SankeyLink<N, L>> {
  id: string
  name?: string
  x0?: number
  x1?: number
  y0?: number
  y1?: number
  depth?: number
  sourceLinks?: L[]
  targetLinks?: L[]
  value?: number
}

export interface SankeyLink<N extends SankeyNode<N, L>, L extends SankeyLink<N, L>> {
  source: N | string
  target: N | string
  value: number
  width?: number
  y0?: number
  y1?: number
}

export interface SankeyGraph<N extends SankeyNode<N, L>, L extends SankeyLink<N, L>> {
  nodes: N[]
  links: L[]
}

type Extent = [[number, number], [number, number]]

type SankeyGenerator<N extends SankeyNode<N, L>, L extends SankeyLink<N, L>> = {
  (graph: SankeyGraph<N, L>): SankeyGraph<N, L>
  nodeId(fn: (node: N) => string): SankeyGenerator<N, L>
  nodeWidth(width: number): SankeyGenerator<N, L>
  nodePadding(padding: number): SankeyGenerator<N, L>
  nodeSort(_sort: null): SankeyGenerator<N, L>
  extent(extent: Extent): SankeyGenerator<N, L>
}

export function sankey<N extends SankeyNode<N, L>, L extends SankeyLink<N, L>>(): SankeyGenerator<N, L> {
  let idAccessor: (node: N) => string = (node) => node.id
  let width = 16
  let padding = 16
  let chartExtent: Extent = [[0, 0], [1, 1]]

  const generator = ((graph: SankeyGraph<N, L>) => {
    const [minX, minY] = chartExtent[0]
    const [maxX, maxY] = chartExtent[1]
    const innerWidth = maxX - minX
    const innerHeight = maxY - minY

    const nodeById = new Map<string, N>()
    graph.nodes.forEach((node) => {
      node.sourceLinks = []
      node.targetLinks = []
      nodeById.set(idAccessor(node), node)
    })

    graph.links.forEach((link) => {
      const sourceNode = typeof link.source === 'string' ? nodeById.get(link.source) : link.source
      const targetNode = typeof link.target === 'string' ? nodeById.get(link.target) : link.target

      if (!sourceNode || !targetNode) {
        return
      }

      link.source = sourceNode
      link.target = targetNode
      sourceNode.sourceLinks?.push(link)
      targetNode.targetLinks?.push(link)
    })

    const queue = graph.nodes.filter((node) => (node.targetLinks?.length ?? 0) === 0)
    queue.forEach((node) => {
      node.depth = 0
    })

    while (queue.length > 0) {
      const node = queue.shift()
      if (!node) continue

      node.sourceLinks?.forEach((link) => {
        const target = link.target as N
        const nextDepth = (node.depth ?? 0) + 1
        if ((target.depth ?? -1) < nextDepth) {
          target.depth = nextDepth
          queue.push(target)
        }
      })
    }

    const maxDepth = Math.max(...graph.nodes.map((node) => node.depth ?? 0), 1)
    const columns: N[][] = Array.from({ length: maxDepth + 1 }, () => [])

    graph.nodes.forEach((node) => {
      const depth = node.depth ?? 0
      columns[depth].push(node)
      const outgoing = (node.sourceLinks ?? []).reduce((sum, link) => sum + link.value, 0)
      const incoming = (node.targetLinks ?? []).reduce((sum, link) => sum + link.value, 0)
      node.value = Math.max(outgoing, incoming, 0)
    })

    columns.forEach((column, depth) => {
      const columnTotal = column.reduce((sum, node) => sum + (node.value ?? 0), 0)
      const totalPadding = Math.max(column.length - 1, 0) * padding
      const scale = columnTotal > 0 ? (innerHeight - totalPadding) / columnTotal : 0
      const x0 = minX + (depth / maxDepth) * (innerWidth - width)
      let yCursor = minY

      column.forEach((node) => {
        const nodeHeight = (node.value ?? 0) * scale
        node.x0 = x0
        node.x1 = x0 + width
        node.y0 = yCursor
        node.y1 = yCursor + nodeHeight
        yCursor = (node.y1 ?? yCursor) + padding
      })

      column.forEach((node) => {
        let sy = node.y0 ?? 0
        node.sourceLinks?.forEach((link) => {
          link.width = link.value * scale
          link.y0 = sy + (link.width ?? 0) / 2
          sy += link.width ?? 0
        })

        let ty = node.y0 ?? 0
        node.targetLinks?.forEach((link) => {
          link.y1 = ty + (link.width ?? 0) / 2
          ty += link.width ?? 0
        })
      })
    })

    return graph
  }) as SankeyGenerator<N, L>

  generator.nodeId = (fn) => {
    idAccessor = fn
    return generator
  }

  generator.nodeWidth = (nodeWidth) => {
    width = nodeWidth
    return generator
  }

  generator.nodePadding = (nodePadding) => {
    padding = nodePadding
    return generator
  }

  generator.nodeSort = () => generator

  generator.extent = (extentValue) => {
    chartExtent = extentValue
    return generator
  }

  return generator
}

export function sankeyLinkHorizontal<N extends SankeyNode<N, L>, L extends SankeyLink<N, L>>() {
  return (link: L) => {
    const source = link.source as N
    const target = link.target as N

    const x0 = source.x1 ?? 0
    const x1 = target.x0 ?? 0
    const y0 = link.y0 ?? 0
    const y1 = link.y1 ?? 0
    const xi = (x0 + x1) / 2

    return `M${x0},${y0}C${xi},${y0} ${xi},${y1} ${x1},${y1}`
  }
}
