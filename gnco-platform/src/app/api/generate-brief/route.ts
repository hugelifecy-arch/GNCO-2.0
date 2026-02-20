import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { JURISDICTION_METADATA } from '@/lib/jurisdiction-metadata'
import { buildAttorneyBriefPdf, type AttorneyBriefPage } from '@/lib/pdf'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'

// ── Request schema ────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────
function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

// BUG 1 FIXED: was missing closing brace on outer if,
// and had a nested duplicate if condition.
function getUserAccessLevel(
  user: Awaited<ReturnType<typeof currentUser>>,
): 'preview' | 'full' {
  if (!user) return 'preview'

  const metadata = user.publicMetadata ?? {}
  const tier = typeof metadata.tier === 'string' ? metadata.tier.toLowerCase() : ''

  if (
    tier === 'paid' ||
    tier === 'beta' ||
    metadata.isPaid === true ||
    metadata.betaAccess === true
  ) {
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

// ── React-PDF renderer ────────────────────────────────────────
async function renderWithReactPdf(pages: AttorneyBriefPage[]): Promise<Buffer> {
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
    StyleSheet: {
      create: (
        styles: Record<string, Record<string, unknown>>,
      ) => Record<string, Record<string, unknown>>
    }
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
          createElement(
            Text as never,
            { style: styles.header },
            `GNCO Attorney Brief — ${page.title}`,
          ),
          page.subtitle
            ? createElement(Text as never, { style: styles.subtitle }, page.subtitle)
            : null,
          ...page.bullets.map((bullet, bulletIndex) =>
            createElement(
              Text as never,
              { key: `${index}-${bulletIndex}`, style: styles.bullet },
              `• ${bullet}`,
            ),
          ),
          createElement(
            Text as never,
            { style: styles.footer },
            `Page ${index + 1} of ${pages.length}`,
          ),
        ),
      ),
    ),
  )

  return renderToBuffer(doc)
}

// ── Route handler ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'Authentication required.' },
      { status: 401 },
    )
  }

  const payload = await request.json().catch(() => null)
  const parsed = requestSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid request payload.' },
      { status: 400 },
    )
  }

  const user = await currentUser()
  const accessLevel = getUserAccessLevel(user)

  const [top, second, third] = parsed.data.recommendations
  const topJurisdiction = JURISDICTIONS.find((entry) => entry.name === top.jurisdiction)
  const meta = topJurisdiction ? JURISDICTION_METADATA[topJurisdiction.id] : undefined

  const today = new Date(parsed.data.generatedAt)
  const renderedDate = Number.isNaN(today.getTime())
    ? new Date().toISOString().slice(0, 10)
    : today.toISOString().slice(0, 10)

  const topThreeRanked = [top, second, third]
    .filter(Boolean)
    .map((item, idx) => `#${idx + 1} ${item.jurisdiction} — Score ${item.scores?.overallScore ?? 'N/A'}`)

  const registrationRequirements = splitRequirements(meta?.key_compliance ?? '')
  const lpMix = parsed.data.brief.lpMix.length
    ? parsed.data.brief.lpMix
    : ['Mixed LP base (confirm treaty eligibility by domicile)']

  // BUG 3 FIXED: removed duplicate `title` key on page 6.
  // BUG 4 FIXED: removed duplicate questions 1-10 from page 6 bullets.
  // BUG 5 FIXED: removed duplicate bullet lines throughout pages 1 and 2.
  const pages: AttorneyBriefPage[] = [
    {
      title: 'Page 1 — Executive Summary',
      subtitle: `${topJurisdiction?.flag ?? ''} ${top.jurisdiction}`.trim(),
      bullets: [
        `Recommended jurisdiction: ${top.jurisdiction}`,
        `Rationale: ${top.reasoning}`,
        `Recommended vehicle: ${top.vehicleType}`,
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
        `Vehicle: ${top.vehicleType} is commonly used for cross-border fundraising with flexible LP/GP economics and governance customisation.`,
        `Why this fit: Matches current LP/GP profile with priorities around ${parsed.data.brief.lpMix.join(', ') || 'diversified LP mix'}.`,
        `Alternative #2: ${second?.jurisdiction ?? 'N/A'} (${second?.vehicleType ?? 'N/A'})`,
        `Alternative #3: ${third?.jurisdiction ?? 'N/A'} (${third?.vehicleType ?? 'N/A'})`,
        `Common vehicle options in ${top.jurisdiction}: ${(topJurisdiction?.primaryVehicles ?? [top.vehicleType]).slice(0, 3).join(', ')}.`,
        `Notes: ${topJurisdiction?.notes ?? 'Consult local counsel for vehicle selection.'}`,
        `Top jurisdictions ranked: ${topThreeRanked.join(' | ')}`,
      ],
    },
    {
      title: 'Page 3 — Regulatory Snapshot',
      bullets: [
        `Regulator: ${meta?.regulator.name ?? topJurisdiction?.regulator ?? 'Consult local authority'}`,
        `Regulator website: ${meta?.regulator.url ?? 'See official regulator website'}`,
        `Formation timeline: ${meta?.timelines ?? `${top.estimatedTimelineWeeks.min}–${top.estimatedTimelineWeeks.max} weeks estimated`}`,
        `Key compliance obligations: ${meta?.key_compliance ?? 'Annual filings, AML/CTF, FATCA/CRS, and ongoing governance obligations.'}`,
        ...registrationRequirements.map((item) => `Registration requirement: ${item}`),
      ],
    },
    {
      title: 'Page 4 — Tax Summary',
      bullets: [
        `Headline treatment: ${meta?.tax_headline ?? 'Review local direct and withholding tax profile.'}`,
        `LP domicile considerations: ${lpMix.join(', ')}`,
        'WHT implications: Taxable investors, tax-exempt LPs, and sovereign/foundation capital should each be analysed for treaty eligibility and reclaim mechanics.',
        `Key treaty set: ${topJurisdiction?.taxTreaties.join(', ') ?? 'Treaty analysis depends on LP domicile and asset jurisdiction.'}`,
      ],
    },
    {
      title: 'Page 5 — Service Provider Requirements',
      bullets: [
        `Required providers: ${meta?.service_providers ?? 'Administrator, auditor, legal counsel, bank/custodian, tax adviser, and compliance support.'}`,
        `Estimated formation cost range: USD ${top.estimatedFormationCost.min.toLocaleString()}–${top.estimatedFormationCost.max.toLocaleString()}`,
        `Estimated annual cost range: USD ${topJurisdiction ? `${topJurisdiction.annualCostRange.min.toLocaleString()}–${topJurisdiction.annualCostRange.max.toLocaleString()}` : 'to be scoped during counsel engagement'}`,
        ...lpMix.map(
          (domicile) =>
            `LP WHT consideration (${titleCase(domicile)}): confirm treaty access, reclaim process, and beneficial owner characterisation.`,
        ),
      ],
    },
    {
      // BUG 3 FIXED: only one title key
      title: 'Page 6 — Counsel Briefing Checklist',
      bullets: [
        // BUG 4 FIXED: questions listed exactly once
        '1) Which entity structure (master-feeder / parallel / blocker) is optimal for this mandate?',
        '2) How should GP carried interest be structured and taxed across manager jurisdictions?',
        '3) Do we require a feeder, blocker, or parallel vehicle for specific LP types?',
        '4) What is the critical path to first close and launch?',
        '5) Which pre-launch registrations and filings are mandatory?',
        '6) What FATCA/CRS obligations apply to each fund and GP entity?',
        '7) Is an AIFMD marketing passport required, or will NPPR filings suffice?',
        '8) What side-letter terms are likely for anchor or sovereign LPs?',
        '9) What substance requirements apply to manager and fund entities?',
        '10) Which assumptions in this brief should be validated before first close?',
        'Notes: ________________________________________________',
        'Notes: ________________________________________________',
        'Notes: ________________________________________________',
      ],
    },
  ]

  const selectedPages = accessLevel === 'full' ? pages : pages.slice(0, 1)

  // BUG 2 FIXED: was declared as both `const pdf` and `let pdf: Buffer`.
  // Now declared once as `let pdf: Buffer` with try/catch fallback.
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
