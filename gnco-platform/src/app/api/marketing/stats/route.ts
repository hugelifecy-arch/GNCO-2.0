import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const openBetaPractitionerCount = await prisma.user.count()

    return NextResponse.json(
      {
        openBetaPractitionerCount,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  } catch {
    return NextResponse.json(
      {
        openBetaPractitionerCount: null,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  }
}
