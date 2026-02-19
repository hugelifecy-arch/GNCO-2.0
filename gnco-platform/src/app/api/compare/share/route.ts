import { NextRequest, NextResponse } from 'next/server'

import { createSharedComparison, getSharedComparison } from '@/lib/compare-store'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { payload?: Record<string, unknown>; password?: string }

    if (!body.payload) {
      return NextResponse.json({ success: false, message: 'Missing comparison payload.' }, { status: 400 })
    }

    const shared = createSharedComparison(body.payload, body.password?.trim() || undefined)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    return NextResponse.json({
      success: true,
      shareUrl: `${appUrl}/compare/shared/${shared.id}`,
      id: shared.id,
      passwordProtected: Boolean(shared.password),
    })
  } catch {
    return NextResponse.json({ success: false, message: 'Unable to create share link.' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const password = searchParams.get('password') || undefined

  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing share id.' }, { status: 400 })
  }

  const shared = getSharedComparison(id)

  if (!shared) {
    return NextResponse.json({ success: false, message: 'Comparison not found.' }, { status: 404 })
  }

  if (shared.password && shared.password !== password) {
    return NextResponse.json({ success: false, message: 'Password required.' }, { status: 401 })
  }

  return NextResponse.json({ success: true, payload: shared.payload, createdAt: shared.createdAt })
}
