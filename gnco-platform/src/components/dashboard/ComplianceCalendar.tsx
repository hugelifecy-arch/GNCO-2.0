'use client'

import { useMemo, useState } from 'react'
import { addDays, format, isWithinInterval, parseISO, startOfYear, endOfYear } from 'date-fns'
import { Bell, CalendarPlus, Download } from 'lucide-react'
import { JURISDICTIONS_CANONICAL } from '@/data/jurisdictions'

type VehicleType = 'private-fund' | 'registered-fund' | 'lp' | 'company' | 'vcc' | 'raif' | 'qiaif'

type CalendarDeadline = {
  obligation: string
  description: string
  consequence: string
  leadTimeDays: number
  deadline: Date
  deadlineLabel: string
  reminders: Date[]
  daysUntil: number
}

const vehicleOptions: { label: string; value: VehicleType }[] = [
  { label: 'Private Fund', value: 'private-fund' },
  { label: 'Registered Fund', value: 'registered-fund' },
  { label: 'Limited Partnership', value: 'lp' },
  { label: 'Company', value: 'company' },
  { label: 'VCC', value: 'vcc' },
  { label: 'RAIF', value: 'raif' },
  { label: 'QIAIF', value: 'qiaif' },
]

const today = new Date()

function buildIcs(deadlines: CalendarDeadline[], fundName: string, jurisdiction: string) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GNCO//Compliance Calendar//EN']

  deadlines.forEach((event, index) => {
    const eventDate = format(event.deadline, 'yyyyMMdd')
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:gnco-${index}-${eventDate}`)
    lines.push(`SUMMARY:${fundName} - ${event.obligation}`)
    lines.push(`DESCRIPTION:${event.description} | Consequence: ${event.consequence}`)
    lines.push(`DTSTART;VALUE=DATE:${eventDate}`)
    lines.push(`DTEND;VALUE=DATE:${eventDate}`)
    lines.push(`LOCATION:${jurisdiction}`)
    lines.push('END:VEVENT')
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export function ComplianceCalendar() {
  const [fundName, setFundName] = useState('Aurora Fund I')
  const [jurisdiction, setJurisdiction] = useState('cayman-islands')
  const [vehicleType, setVehicleType] = useState<VehicleType>('private-fund')
  const [financialYearEnd, setFinancialYearEnd] = useState('2026-12-31')
  const [formationDate, setFormationDate] = useState('2024-02-01')

  const selectedJurisdiction = useMemo(
    () => JURISDICTIONS_CANONICAL.find((item) => item.id === jurisdiction),
    [jurisdiction]
  )

  const deadlines = useMemo<CalendarDeadline[]>(() => {
    if (!selectedJurisdiction?.compliance_obligations) {
      return []
    }

    const yearStart = startOfYear(today)
    const yearEnd = endOfYear(today)
    const fye = parseISO(financialYearEnd)
    const formation = parseISO(formationDate)

    return selectedJurisdiction.compliance_obligations
      .filter((obligation) => obligation.applies_to.includes(vehicleType))
      .map((obligation) => {
        const anchorDate = obligation.deadline_reference === 'fye' ? fye : formation
        const deadline = addDays(anchorDate, obligation.deadline_offset_days)

        return {
          obligation: obligation.obligation,
          description: obligation.description,
          consequence: obligation.consequence_of_miss,
          leadTimeDays: obligation.preparation_lead_time_days,
          deadline,
          deadlineLabel: obligation.typical_deadline,
          reminders: [30, 14, 7].map((days) => addDays(deadline, -days)),
          daysUntil: Math.ceil((deadline.getTime() - Date.now()) / 86_400_000),
        }
      })
      .filter((item) => isWithinInterval(item.deadline, { start: yearStart, end: yearEnd }))
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
  }, [selectedJurisdiction, vehicleType, financialYearEnd, formationDate])

  const reminderBadgeCount = deadlines.reduce((count, item) => {
    const upcomingReminder = item.reminders.some((reminder) => reminder >= today)
    return upcomingReminder ? count + 1 : count
  }, 0)

  const onDownloadIcs = () => {
    if (!selectedJurisdiction) return

    const ics = buildIcs(deadlines, fundName, selectedJurisdiction.name)
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = `${fundName.toLowerCase().replace(/\s+/g, '-')}-compliance.ics`
    link.click()
    URL.revokeObjectURL(href)
  }

  const onDownloadPdf = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <html>
        <head><title>${fundName} Compliance Calendar</title></head>
        <body style="font-family: Arial; padding: 24px;">
          <h1>${fundName} Compliance Schedule (${new Date().getFullYear()})</h1>
          <p>Jurisdiction: ${selectedJurisdiction?.name ?? ''}</p>
          <ul>
            ${deadlines
              .map(
                (item) =>
                  `<li><strong>${format(item.deadline, 'PPP')}</strong> — ${item.obligation}<br/>${item.description}<br/>Consequence: ${item.consequence}</li>`
              )
              .join('')}
          </ul>
        </body>
      </html>`

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <main className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-text-tertiary">Dashboard</p>
          <h1 className="font-serif text-3xl text-text-primary">Compliance Calendar</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-surface px-3 py-1 text-sm text-text-secondary">
          <Bell className="h-4 w-4" />
          Reminder queue
          <span className="rounded-full bg-accent-gold px-2 py-0.5 text-xs text-bg-primary">{reminderBadgeCount}</span>
        </div>
      </div>

      <section className="grid gap-4 rounded-xl border border-bg-border bg-bg-surface p-4 lg:grid-cols-5">
        <label className="space-y-1 text-sm text-text-secondary">
          Fund name
          <input value={fundName} onChange={(e) => setFundName(e.target.value)} className="w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm text-text-secondary">
          Jurisdiction
          <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2">
            {JURISDICTIONS_CANONICAL.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm text-text-secondary">
          Vehicle type
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value as VehicleType)} className="w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2">
            {vehicleOptions.map((vehicle) => (
              <option key={vehicle.value} value={vehicle.value}>
                {vehicle.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm text-text-secondary">
          Financial year end
          <input type="date" value={financialYearEnd} onChange={(e) => setFinancialYearEnd(e.target.value)} className="w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm text-text-secondary">
          Formation date
          <input type="date" value={formationDate} onChange={(e) => setFormationDate(e.target.value)} className="w-full rounded-md border border-bg-border bg-bg-primary px-3 py-2" />
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-bg-border bg-bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-text-primary">{new Date().getFullYear()} deadlines</h2>
          <div className="flex gap-2">
            <button onClick={onDownloadIcs} className="inline-flex items-center gap-2 rounded-md border border-accent-gold px-3 py-2 text-sm text-accent-gold">
              <CalendarPlus className="h-4 w-4" /> Add to Google Calendar (.ics)
            </button>
            <button onClick={onDownloadPdf} className="inline-flex items-center gap-2 rounded-md border border-bg-border px-3 py-2 text-sm text-text-secondary">
              <Download className="h-4 w-4" /> Download Calendar PDF
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {deadlines.map((deadline) => {
            const statusClass =
              deadline.daysUntil > 30
                ? 'border-green-500/40 bg-green-500/10'
                : deadline.daysUntil >= 14
                  ? 'border-amber-500/40 bg-amber-500/10'
                  : 'border-red-500/40 bg-red-500/10'

            return (
              <article key={`${deadline.obligation}-${deadline.deadline.toISOString()}`} className={`rounded-lg border p-4 ${statusClass}`}>
                <p className="text-xs uppercase tracking-wide text-text-tertiary">Due {format(deadline.deadline, 'PPP')} ({deadline.deadlineLabel})</p>
                <h3 className="text-lg font-medium text-text-primary">{deadline.obligation}</h3>
                <p className="mt-1 text-sm text-text-secondary">{deadline.description}</p>
                <p className="mt-1 text-sm text-text-secondary">Consequence: {deadline.consequence}</p>
                <p className="mt-1 text-sm text-text-secondary">Suggested preparation lead time: {deadline.leadTimeDays} days</p>
                <p className="mt-2 text-xs text-text-tertiary">
                  Email reminders: {deadline.reminders.map((date) => format(date, 'MMM d')).join(' · ')} (30 / 14 / 7 days prior)
                </p>
              </article>
            )
          })}
          {deadlines.length === 0 && <p className="text-sm text-text-tertiary">No current-year deadlines matched for this fund profile.</p>}
        </div>
      </section>
    </main>
  )
}
