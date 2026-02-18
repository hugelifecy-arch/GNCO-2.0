import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { buildSimplePdf } from '@/lib/pdf'

const exportPayloadSchema = z.object({
  title: z.string().min(3),
  date: z.string().min(8),
  selectedStructure: z.object({
    jurisdiction: z.string().min(2),
    vehicleType: z.string().min(2),
    timeline: z.string().min(2),
    cost: z.string().min(2),
  }),
  entities: z.array(z.string().min(2)).min(1),
  assumptions: z.array(z.string().min(3)).min(1),
  sources: z.array(z.object({ label: z.string().min(2), href: z.string().url() })).min(1),
  questionsForCounsel: z.array(z.string().min(3)).min(1),
  disclaimer: z.string().min(8),
})

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null)
  const parsed = exportPayloadSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid export payload.', issues: parsed.error.flatten() }, { status: 400 })
  }

  const { title, date, selectedStructure, entities, assumptions, sources, questionsForCounsel, disclaimer } = parsed.data

  const pdfBuffer = buildSimplePdf(title, date, [
    {
      heading: 'Structure Diagram Placeholder',
      lines: [
        `GP -> ${selectedStructure.vehicleType} (${selectedStructure.jurisdiction}) -> LPs`,
        'Simple box-list placeholder included in this Phase 1 PDF export.',
      ],
    },
    {
      heading: 'Entity List',
      lines: entities,
    },
    {
      heading: 'Timeline + Cost Summary',
      lines: [
        `Estimated timeline: ${selectedStructure.timeline}`,
        `Estimated formation cost: ${selectedStructure.cost}`,
      ],
    },
    {
      heading: 'Assumptions',
      lines: assumptions,
    },
    {
      heading: 'Sources',
      lines: sources.map((source) => `${source.label} — ${source.href}`),
    },
    {
      heading: 'Questions for Counsel',
      lines: questionsForCounsel,
    },
    {
      heading: 'Disclaimer',
      lines: [disclaimer],
    },
  ])

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="attorney-brief-${date}.pdf"`,
    },
  })
}
