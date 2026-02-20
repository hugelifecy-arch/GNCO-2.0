import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { buildSimplePdf } from '@/lib/pdf'

const lpAttributionExportSchema = z.object({
  generatedAt: z.string().min(8),
  lpName: z.string().min(2),
  domicile: z.string().min(2),
  entityType: z.string().min(2),
  rows: z.array(
    z.object({
      label: z.string().min(2),
      value: z.string().min(1),
    })
  ),
  privacyMode: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null)
  const parsed = lpAttributionExportSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid LP attribution payload.' }, { status: 400 })
  }

  const { generatedAt, lpName, domicile, entityType, rows, privacyMode } = parsed.data

  const pdf = buildSimplePdf(`LP Attribution Report: ${lpName}`, generatedAt, [
    { heading: 'LP Profile', lines: [`Domicile: ${domicile}`, `Entity Type: ${entityType}`] },
    { heading: 'Performance Attribution', lines: rows.map((row) => `${row.label}: ${row.value}`) },
  ], {
    watermark: privacyMode ? 'CONFIDENTIAL — PORTFOLIO OVERVIEW' : undefined,
  })

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="lp-attribution-${lpName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${generatedAt}.pdf"`,
    },
  })
}
