import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { buildSimplePdf } from '@/lib/pdf'

const complianceExportSchema = z.object({
  generatedAt: z.string().min(8),
  summary: z.string().min(8),
  rows: z.array(
    z.object({
      lpName: z.string().min(2),
      domicile: z.string().min(2),
      status: z.enum(['green', 'amber', 'red']),
      taxClassification: z.string().min(2),
      findings: z.array(z.string()),
    })
  ),
})

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null)
  const parsed = complianceExportSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid LP compliance matrix payload.' }, { status: 400 })
  }

  const { generatedAt, summary, rows } = parsed.data

  const sections = [
    { heading: 'Summary', lines: [summary] },
    {
      heading: 'LP Compliance Matrix',
      lines: rows.map(
        (row) =>
          `${row.lpName} (${row.domicile}) — ${row.status.toUpperCase()} — ${row.taxClassification}${
            row.findings[0] ? ` — ${row.findings[0]}` : ''
          }`
      ),
    },
  ]

  const pdf = buildSimplePdf('LP Compliance Matrix', generatedAt, sections)

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="lp-compliance-matrix-${generatedAt}.pdf"`,
    },
  })
}
