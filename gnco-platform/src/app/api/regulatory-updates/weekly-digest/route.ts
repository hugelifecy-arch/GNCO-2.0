import { NextResponse } from 'next/server'

import { buildWeeklyDigestEmails } from '@/lib/regulatory-digest'

export async function POST() {
  const emails = buildWeeklyDigestEmails()

  return NextResponse.json({
    sent: emails.length,
    previews: emails,
    message: emails.length
      ? 'Weekly digest prepared for affected structures.'
      : 'No unread regulatory updates for saved structures.',
  })
}
