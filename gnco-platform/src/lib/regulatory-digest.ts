import { buildWeeklyDigestLine, getUnreadRegulatoryUpdatesForStructure } from '@/lib/regulatory-alerts'
import { SEED_REGULATORY_UPDATES, type SavedStructure } from '@/lib/regulatory-updates'

interface DigestRecipient {
  email: string
  structure: SavedStructure
}

const MOCK_RECIPIENTS: DigestRecipient[] = [
  {
    email: 'ops@example.com',
    structure: {
      id: 'cayman-elp',
      jurisdiction_id: 'cayman-islands',
      vehicle_type: 'ELP',
      created_at: '2026-01-01T00:00:00.000Z',
      last_viewed_regulatory_at: '2026-01-15T00:00:00.000Z',
    },
  },
]

export function buildWeeklyDigestEmails() {
  return MOCK_RECIPIENTS.flatMap((recipient) => {
    const unread = getUnreadRegulatoryUpdatesForStructure(recipient.structure, SEED_REGULATORY_UPDATES)
    if (!unread.length) return []

    return [
      {
        to: recipient.email,
        subject: 'GNCO weekly regulatory digest',
        body: buildWeeklyDigestLine(recipient.structure, unread.length),
      },
    ]
  })
}
