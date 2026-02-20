import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { JURISDICTION_METADATA } from '@/lib/jurisdiction-metadata'
import { buildAttorneyBriefPdf, type AttorneyBriefPage } from '@/lib/pdf'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'

const requestSchema = z.object({
  generatedAt: z.string(),
  brief: z.object({
    strategy: z.string(),
    fundSize: z.string(),
    lpCount: z.number(),
    lpMix: z.array(z.string()),
    gpDomicile: z.string(),
  }),
  recommendations: z
    .array(
      z.object({
        jurisdiction: z.string(),
        vehicleType: z.string(),
        rank: z.number(),
        reasoning: z.string(),
        scores: z.object({ overallScore: z.number() }).optional(),
        estimatedFormationCost: z.object({ min: z.number(), max: z.number() }),
        estimatedTimelineWeeks: z.object({ min: z.number(), max: z.number() }),
      }),
    )
    .min(1),
})

function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

function getUserAccessLevel(user: Awaited<ReturnType<typeof currentUser>>): 'preview' | 'full' {
  if (!user) return 'preview'

  const metadata = user.publicMetadata ?? {}
  const tier = typeof metadata.tier === 'string' ? metadata.tier.toLowerCase() : ''

  if (tier === 'beta' || metadata.betaAccess === true) {
    return 'full'
  }

  return 'preview'
}

function splitRequirements(value: string) {
  return value
    .split(/,|;|\./)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6)
}

async function renderWithReactPdf(pages: AttorneyBriefPage[]) {
  const reactPdfModuleName = '@react-pdf/renderer'

  const [{ createElement }, reactPdf] = await Promise.all([
    import('react'),
    import(reactPdfModuleName),
  ])

  const { Document, Page, Text, View, StyleSheet, renderToBuffer } = reactPdf as {
    Document: unknown
    Page: unknown
    Text: unknown
    View: unknown
    StyleSheet: { create: (styles: Record<string, Record<string, unknown>>) => Record<string, Record<string, unknown>> }
    renderToBuffer: (node: unknown) => Promise<Buffer>
  }

  const styles = StyleSheet.create({
    page: { padding: 36, fontSize: 11, lineHeight: 1.5, color: '#0f172a' },
    header: { fontSize: 18, marginBottom: 12 },
    subtitle: { fontSize: 12, marginBottom: 10, color: '#334155' },
    bullet: { marginBottom: 6 },
    footer: { marginTop: 16, fontSize: 9, color: '#64748b' },
  })

  const doc = createElement(
    Document as never,
    null,
    pages.map((page, index) =>
      createElement(
        Page as never,
        { key: `${page.title}-${index}`, size: 'A4', style: styles.page },
        createElement(
          View as never,
          null,
          createElement(Text as never, { style: styles.header }, `GNCO Attorney Brief — ${page.title}`),
          page.subtitle ? createElement(Text as never, { style: styles.subtitle }, page.subtitle) : null,
          ...page.bullets.map((bullet, bulletIndex) => createElement(Text as never, { key: `${index}-${bulletIndex}`, style: styles.bullet }, `• ${bullet}`)),
          createElement(Text as never, { style: styles.footer }, `Page ${index + 1} of ${pages.length}`),
        ),
      ),
    ),
  )

  return renderToBuffer(doc)
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = requestSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid request payload.' }, { status: 400 })
  }

  const user = await currentUser()
  const accessLevel = getUserAccessLevel(user)

  const [top, second, third] = parsed.data.recommendations
  const topJurisdiction = JURISDICTIONS.find((entry) => entry.name === top.jurisdiction)
  const meta = topJurisdiction ? JURISDICTION_METADATA[topJurisdiction.id] : undefined

  const today = new Date(parsed.data.generatedAt)
  const renderedDate = Number.isNaN(today.getTime()) ? new Date().toISOString().slice(0, 10) : today.toISOString().slice(0, 10)

  const topThreeRanked = [top, second, third]
    .filter(Boolean)
    .map((item, idx) => `#${idx + 1} ${item.jurisdiction} — Score ${item.scores?.overallScore ?? 'N/A'}`)

  const registrationRequirements = splitRequirements(meta?.key_compliance ?? '')
  const lpMix = parsed.data.brief.lpMix.length ? parsed.data.brief.lpMix : ['Mixed LP base (confirm treaty eligibility by domicile)']

  const pages: AttorneyBriefPage[] = [
    {
      title: 'Page 1 — Executive Summary',
      subtitle: `${topJurisdiction?.flag ?? ''} ${top.jurisdiction}`.trim(),
      bullets: [
        `Recommended jurisdiction: ${top.jurisdiction}`,
        `Recommended vehicle type: ${top.vehicleType}`,
        `Fund strategy: ${titleCase(parsed.data.brief.strategy)}`,
        `Fund size: ${titleCase(parsed.data.brief.fundSize)}`,
        `LP count: ${parsed.data.brief.lpCount}`,
        `Generated by GNCO on ${renderedDate}`,
        'Disclaimer: For informational purposes only. Not legal advice.',
      ],
    },
    {
      title: 'Page 2 — Structure Overview',
      bullets: [
        `Vehicle description: ${top.vehicleType} is a primary structure in ${top.jurisdiction} for private capital raises and cross-border manager execution.`,
        `Vehicle description: ${topJurisdiction?.notes ?? 'It is commonly used to align governance economics and investor terms for institutional LPs.'}`,
        `Vehicle description: Common vehicle options include ${(topJurisdiction?.primaryVehicles ?? [top.vehicleType]).slice(0, 3).join(', ')}.`,
        `Why this profile fit: ${top.reasoning}`,
        `Top jurisdictions ranked: ${topThreeRanked.join(' | ')}`,
      ],
    },
    {
      title: 'Page 3 — Regulatory Snapshot',
      bullets: [
        `Regulator: ${meta?.regulator.name ?? topJurisdiction?.regulator ?? 'Consult local authority'}`,
        `Regulator website: ${meta?.regulator.url ?? 'Official regulator website'}`,
        ...registrationRequirements.map((item) => `Registration requirement: ${item}`),
        `Formation timeline: ${meta?.timelines ?? `${top.estimatedTimelineWeeks.min}-${top.estimatedTimelineWeeks.max} weeks estimated`}`,
        `Key compliance obligations: ${meta?.key_compliance ?? 'Annual filings, AML/CTF, FATCA/CRS, and governance obligations.'}`,
      ],
    },
    {
      title: 'Page 4 — Tax Summary',
      bullets: [
        `Headline tax treatment: ${meta?.tax_headline ?? 'Review local direct and withholding tax profile with counsel.'}`,
        ...lpMix.map((domicile) => `LP WHT consideration (${titleCase(domicile)}): confirm treaty access, reclaim process, and beneficial owner characterization.`),
        `Key relevant treaties: ${topJurisdiction?.taxTreaties.join(', ') ?? 'Treaty analysis depends on LP domicile and asset jurisdiction.'}`,
      ],
    },
    {
      title: 'Page 5 — Counsel Briefing Checklist',
      bullets: [
        '1) Which entity structure (master-feeder/parallel/blocker) is optimal for this mandate?',
        '2) How should GP carried interest be structured and taxed across manager jurisdictions?',
        '3) Which LP side letter provisions are likely for anchor investors?',
        '4) What FATCA/CRS obligations apply to each fund and GP entity?',
        '5) Is an AIFMD marketing passport required, or will NPPR filings be sufficient?',
        '6) What are expected annual operating costs by provider and jurisdiction?',
        '7) Are key persons requirements expected in constitutional documents or side letters?',
        '8) Which recurring regulatory reporting obligations are highest risk?',
        '9) What governance and conflict controls should be hard-coded at launch?',
        '10) Which assumptions in this brief should be validated before first close?',
      ],
    },
  ]

  const selectedPages = accessLevel === 'full' ? pages : pages.slice(0, 1)
  let pdf: Buffer

  try {
    pdf = await renderWithReactPdf(selectedPages)
  } catch {
    pdf = buildAttorneyBriefPdf(selectedPages)
  }

  const filename = `gnco-attorney-brief-${renderedDate}.pdf`

  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'x-brief-access-level': accessLevel,
      'x-brief-filename': filename,
    },
  })
}
