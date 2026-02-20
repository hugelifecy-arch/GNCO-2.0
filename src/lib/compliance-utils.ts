import { ComplianceObligation, FundProfile, CalendarEvent } from '@/types/compliance'
import { COMPLIANCE_OBLIGATIONS } from '@/data/compliance-obligations'

export function getObligationsForFund(profile: FundProfile): ComplianceObligation[] {
  return COMPLIANCE_OBLIGATIONS.filter((o) => {
    if (o.jurisdiction_id !== profile.jurisdiction_id) return false
    return o.vehicle_types.includes('all') || o.vehicle_types.includes(profile.vehicle_type)
  })
}

function resolveDeadline(rule: string, profile: FundProfile, ref: Date): Date {
  const fye = new Date(ref.getFullYear(), profile.financial_year_end_month - 1, profile.financial_year_end_day)
  if (fye <= ref) fye.setFullYear(fye.getFullYear() + 1)

  const addMonths = (d: Date, m: number) => { const r = new Date(d); r.setMonth(r.getMonth() + m); return r }
  const nextFixed = (month: number, day: number) => {
    const d = new Date(ref.getFullYear(), month, day)
    if (d <= ref) d.setFullYear(d.getFullYear() + 1)
    return d
  }

  switch (rule) {
    case 'fye-plus-6': return addMonths(fye, 6)
    case 'fye-plus-5': return addMonths(fye, 5)
    case 'fye-plus-4': return addMonths(fye, 4)
    case 'fye-plus-3': return addMonths(fye, 3)
    case 'fixed-jan-31': return nextFixed(0, 31)
    case 'fixed-jan-15': return nextFixed(0, 15)
    case 'fixed-mar-31': return nextFixed(2, 31)
    case 'fixed-may-31': return nextFixed(4, 31)
    case 'fixed-jul-31': return nextFixed(6, 31)
    default: return addMonths(fye, 6)
  }
}

export function buildCalendarEvents(profile: FundProfile): CalendarEvent[] {
  const today = new Date()
  return getObligationsForFund(profile)
    .map((o) => {
      const due_date = resolveDeadline(o.deadline_rule, profile, today)
      const days_until_due = Math.ceil((due_date.getTime() - today.getTime()) / 86400000)
      const status: CalendarEvent['status'] =
        days_until_due < 0 ? 'overdue' : days_until_due <= 30 ? 'due-soon' : 'upcoming'
      return { id: o.id, obligation: o, due_date, status, days_until_due }
    })
    .sort((a, b) => a.due_date.getTime() - b.due_date.getTime())
}

export function exportToICS(events: CalendarEvent[], fundName: string): string {
  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GNCO//Compliance//EN']
  events.forEach((ev) => {
    const ds = fmt(ev.due_date)
    lines.push(
      'BEGIN:VEVENT',
      `UID:gnco-${ev.id}-${ds}@gnco`,
      `DTSTART;VALUE=DATE:${ds}`,
      `DTEND;VALUE=DATE:${ds}`,
      `SUMMARY:${fundName} — ${ev.obligation.title}`,
      `DESCRIPTION:${ev.obligation.description}\\nConsequence: ${ev.obligation.consequence}`,
      `URL:${ev.obligation.source_url}`,
      'END:VEVENT'
    )
  })
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}
