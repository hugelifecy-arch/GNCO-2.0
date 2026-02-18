import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { generateRecommendations } from '@/lib/architect-logic'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'
import { prisma } from '@/lib/prisma'

const architectBriefSchema = z.object({
  strategy: z.enum([
    'private-equity',
    'real-estate',
    'private-credit',
    'venture-capital',
    'real-assets',
    'multi-strategy',
    'co-investment',
    'continuation-fund',
  ]),
  fundSize: z.enum(['under-50m', '50m-250m', '250m-1b', '1b-plus']),
  gpDomicile: z.string().min(2),
  lpProfile: z.array(
    z.enum(['us-taxable', 'us-tax-exempt', 'european', 'middle-eastern', 'asian', 'family-office', 'sovereign-wealth', 'mixed'])
  ),
  assetGeography: z.array(z.string()).min(1),
  priorities: z
    .array(
      z.enum([
        'tax-efficiency',
        'speed-to-close',
        'regulatory-simplicity',
        'lp-familiarity',
        'cost-of-formation',
        'privacy',
        'fundraising-flexibility',
      ])
    )
    .min(1),
  timeline: z.enum(['30-days', '60-90-days', '6-months', 'planning-only']),
  experience: z.enum(['first-fund', 'experienced', 'institutional']),
  userId: z.string().optional(),
  saveSession: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null)
  const parsed = architectBriefSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid architect brief payload.', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { saveSession, userId, ...brief } = parsed.data
  const recommendations = generateRecommendations(brief, JURISDICTIONS)

  if (saveSession && userId) {
    try {
      await prisma.architectSession.create({
        data: {
          userId,
          briefData: brief as Prisma.InputJsonValue,
          recommendations: recommendations as unknown as Prisma.InputJsonValue,
        },
      })
    } catch (error) {
      console.info('Architect session was not persisted:', error)
    }
  }

  return NextResponse.json(recommendations)
}
