'use client'

import { useMemo, useState } from 'react'
import { FundProfile, CalendarEvent } from '@/types/compliance'
import { buildCalendarEvents, exportToICS } from '@/lib/compliance-utils'

const JURISDICTIONS = [
  { id: 'cayman-islands', name: 'Cayman Islands' },
  { id: 'luxembourg', name: 'Luxembourg' },
  { id: 'delaware', name: 'Delaware (USA)' },
  { id: 'singapore', name: 'Singapore' },
  { id: 'ireland', name: 'Ireland' },
  { id: 'bvi', name: 'British Virgin Islands' },
  { id: 'jersey', name: 'Jersey' },
  { id: 'guernsey', name: 'Guernsey' },
  { id: 'mauritius', name: 'Mauritius' },
  { id: 'hong-kong', name: 'Hong Kong' },
  { id: 'netherlands', name: 'Netherlands' },
  { id: 'bermuda', name: 'Bermuda' },
  { id: 'switzerland', name: 'Switzerland' },
  { id: 'cyprus', name: 'Cyprus' },
  { id: 'difc', name: 'Dubai (DIFC)' },
]

const VEHICLE_TYPES = [
  { id: 'private-fund', name: 'Private Fund' },
  { id: 'registered-fund', name: 'Registered Fund' },
  { id: 'elp', name: 'Exempted Limited Partnership' },
  { id: 'raif', name: 'RAIF' },
  { id: 'sif', name: 'SIF' },
  { id: 'scs', name: 'SCS' },
  { id: 'scsp', name: 'SCSp' },
  { id: 'qiaif', name: 'QIAIF' },
  { id: 'icav', name: 'ICAV' },
  { id: 'ilp', name: 'ILP' },
  { id: 'vcc', name: 'VCC' },
  { id: 'lpf', name: 'LPF' },
]

const defaultProfile: FundProfile = {
  fund_name: 'Example Fund I',
  jurisdiction_id: 'cayman-islands',
  vehicle_type: 'private-fund',
  financial_year_end_month: 12,
  financial_year_end_day: 31,
  formation_date: '2024-01-01',
}

function statusClass(status: CalendarEvent['status']): string {
  if (status === 'overdue') return 'bg-red-100 text-red-700'
  if (status === 'due-soon') return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
}

export default function CompliancePage() {
  const [profile, setProfile] = useState<FundProfile>(defaultProfile)

  const events = useMemo(() => buildCalendarEvents(profile), [profile])

  const downloadICS = () => {
    const ics = exportToICS(events, profile.fund_name)
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.fund_name.toLowerCase().replace(/\s+/g, '-')}-compliance-calendar.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Compliance Calendar</h1>
        <p className="text-sm text-gray-600">Generate upcoming compliance obligations based on jurisdiction and vehicle profile.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm font-medium">Fund Name</span>
          <input
            className="w-full rounded border px-3 py-2"
            value={profile.fund_name}
            onChange={(e) => setProfile({ ...profile, fund_name: e.target.value })}
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Jurisdiction</span>
          <select
            className="w-full rounded border px-3 py-2"
            value={profile.jurisdiction_id}
            onChange={(e) => setProfile({ ...profile, jurisdiction_id: e.target.value })}
          >
            {JURISDICTIONS.map((j) => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Vehicle Type</span>
          <select
            className="w-full rounded border px-3 py-2"
            value={profile.vehicle_type}
            onChange={(e) => setProfile({ ...profile, vehicle_type: e.target.value })}
          >
            {VEHICLE_TYPES.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded bg-black px-4 py-2 text-sm text-white"
          onClick={downloadICS}
          disabled={events.length === 0}
        >
          Export .ics
        </button>
        <span className="text-sm text-gray-600">{events.length} obligations found</span>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Consequence</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="align-top border-t">
                <td className="p-3">
                  <div className="font-medium">{event.obligation.title}</div>
                  <a href={event.obligation.source_url} target="_blank" className="text-xs text-blue-600" rel="noreferrer">
                    {event.obligation.source_url}
                  </a>
                </td>
                <td className="p-3 capitalize">{event.obligation.category.replace(/-/g, ' ')}</td>
                <td className="p-3">
                  {event.due_date.toLocaleDateString()} ({event.days_until_due} days)
                </td>
                <td className="p-3">
                  <span className={`rounded px-2 py-1 text-xs font-medium ${statusClass(event.status)}`}>
                    {event.status}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{event.obligation.consequence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
