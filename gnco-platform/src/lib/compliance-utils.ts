import { ComplianceObligation, FundProfile, CalendarEvent } from '@/types/compliance'
import { COMPLIANCE_OBLIGATIONS } from '@/data/compliance-obligations'

export function getObligationsForFund(profile: FundProfile): ComplianceObligation[] {
  return COMPLIANCE_OBLIGATIONS.filter((o) => {
    if (o.jurisdiction_id !== profile.jurisdiction_id) return false
    if (o.vehicle_types.includes('all')) return true
    return o.vehicle_types.includes(profile.vehicle_type)
  })
}

export function computeNextDueDate(
  obligation: ComplianceObligation,
  profile: FundProfile,
  referenceDate: Date = new Date()
): Date {
  const fye = new Date(
    referenceDate.getFullYear(),
    profile.financial_year_end_month - 1,
    profile.financial_year_end_day
  )
  if (fye < referenceDate) fye.setFullYear(fye.getFullYear() + 1)

  switch (obligation.deadline_rule) {
    case 'FYE + 6 months': {
      const d = new Date(fye); d.setMonth(d.getMonth() + 6); return d
    }
    case 'FYE + 5 months': {
      const d = new Date(fye); d.setMonth(d.getMonth() + 5); return d
    }
    case 'FYE + 4 months': {
      const d = new Date(fye); d.setMonth(d.getMonth() + 4); return d
    }
    case 'FYE + 3 months': {
      const d = new Date(fye); d.setMonth(d.getMonth() + 3); return d
    }
    case 'Fixed date: 31 January': {
      const d = new Date(referenceDate.getFullYear(), 0, 31)
      if (d < referenceDate) d.setFullYear(d.getFullYear() + 1)
      return d
    }
    case 'Fixed date: 15 January': {
      const d = new Date(referenceDate.getFullYear(), 0, 15)
      if (d < referenceDate) d.setFullYear(d.getFullYear() + 1)
      return d
    }
    case 'Fixed date: 31 March': {
      const d = new Date(referenceDate.getFullYear(), 2, 31)
      if (d < referenceDate) d.setFullYear(d.getFullYear() + 1)
      return d
    }
    case 'Fixed date: 31 May': {
      const d = new Date(referenceDate.getFullYear(), 4, 31)
      if (d < referenceDate) d.setFullYear(d.getFullYear() + 1)
      return d
    }
    case 'Fixed date: 31 July': {
      const d = new Date(referenceDate.getFullYear(), 6, 31)
      if (d < referenceDate) d.setFullYear(d.getFullYear() + 1)
      return d
    }
    default: {
      const d = new Date(fye); d.setMonth(d.getMonth() + 6); return d
    }
  }
}

export function buildCalendarEvents(profile: FundProfile): CalendarEvent[] {
  const obligations = getObligationsForFund(profile)
  const today = new Date()

  return obligations
    .map((o) => {
      const due_date = computeNextDueDate(o, profile, today)
      const diff = due_date.getTime() - today.getTime()
      const days_until_due = Math.ceil(diff / (1000 * 60 * 60 * 24))
      const status: CalendarEvent['status'] =
        days_until_due < 0 ? 'overdue' :
        days_until_due <= 30 ? 'due-soon' : 'upcoming'
      return { id: o.id, obligation: o, due_date, status, days_until_due }
    })
    .sort((a, b) => a.due_date.getTime() - b.due_date.getTime())
}

export function exportToICS(events: CalendarEvent[], fundName: string): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GNCO//Compliance Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  events.forEach((ev) => {
    const d = ev.due_date
    const dateStr = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('')

    lines.push(
      'BEGIN:VEVENT',
      `UID:gnco-compliance-${ev.id}-${dateStr}@gnco`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:${fundName} — ${ev.obligation.title}`,
      `DESCRIPTION:${ev.obligation.description.replace(/,/g, '\\,')}\\n\\nConsequence: ${ev.obligation.consequence}\\n\\nSource: ${ev.obligation.source_url}`,
      `URL:${ev.obligation.source_url}`,
      'END:VEVENT'
    )
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}
