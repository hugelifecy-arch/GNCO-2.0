import { promises as fs } from 'node:fs'
import path from 'node:path'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const marketplaceSchema = z.object({
  jurisdiction: z.string().min(2),
  fundType: z.string().min(2),
  lpBase: z.string().min(2),
  targetTimeline: z.string().min(2),
  contactEmail: z.string().email(),
  notes: z.string().max(1200).optional().default(''),
})

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null)
  const parsed = marketplaceSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid marketplace request payload.' }, { status: 400 })
  }

  const record = {
    ...parsed.data,
    submittedAt: new Date().toISOString(),
  }

  try {
    const targetDir = path.join(process.cwd(), 'tmp')
    await fs.mkdir(targetDir, { recursive: true })
    await fs.appendFile(path.join(targetDir, 'marketplace-requests.jsonl'), `${JSON.stringify(record)}\n`, 'utf8')
  } catch (error) {
    console.info('Marketplace request persistence fallback failed:', error)
  }

  return NextResponse.json({ success: true, message: 'Request received. We will follow up by email.' }, { status: 201 })
}
