import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'

type SharedResult = {
  createdAt: string
  views: number
  [key: string]: unknown
}

// In production, store this in a database.
// For MVP, this in-memory store resets on deploy.
const sharedResults = new Map<string, SharedResult>()

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as Record<string, unknown>
    const shareId = nanoid(10)

    sharedResults.set(shareId, {
      ...data,
      createdAt: new Date().toISOString(),
      views: 0,
    })

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://gnconew.vercel.app'}/results/${shareId}`

    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to generate share link' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shareId = searchParams.get('id')

  if (!shareId) {
    return NextResponse.json({ error: 'Missing share ID' }, { status: 400 })
  }

  const result = sharedResults.get(shareId)

  if (!result) {
    return NextResponse.json({ error: 'Results not found' }, { status: 404 })
  }

  result.views += 1
  sharedResults.set(shareId, result)

  return NextResponse.json({ success: true, data: result })
}
