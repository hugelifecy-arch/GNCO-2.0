import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const accessRequestSchema = z.object({
  name: z.string().min(2),
  organization: z.string().min(2),
  role: z.enum(['cio', 'cfo', 'fund-manager', 'legal-counsel', 'other']),
  aumRange: z.enum(['under-100m', '100m-500m', '500m-2b', '2b-plus']),
  email: z.string().email(),
})

const ONE_HOUR_MS = 60 * 60 * 1000
const MAX_SUBMISSIONS = 3
const requestLog = new Map<string, number[]>()

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown'
  }

  return request.headers.get('x-real-ip') ?? 'unknown'
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (requestLog.get(ip) ?? []).filter((timestamp) => now - timestamp < ONE_HOUR_MS)

  if (recent.length >= MAX_SUBMISSIONS) {
    requestLog.set(ip, recent)
    return true
  }

  requestLog.set(ip, [...recent, now])
  return false
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, message: 'Rate limit exceeded. Try again later.' }, { status: 429 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = accessRequestSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid access request payload.', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    await prisma.accessRequest.create({
      data: {
        ...parsed.data,
        status: 'pending',
      },
    })
  } catch (error) {
    console.info('Database unavailable, access request logged instead:', {
      request: parsed.data,
      error,
    })
  }

  return NextResponse.json({ success: true, message: 'Application received' }, { status: 201 })
}
