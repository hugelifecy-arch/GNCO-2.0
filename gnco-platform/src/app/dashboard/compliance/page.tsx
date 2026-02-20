'use client'

import { useState, useMemo } from 'react'
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
  { id: 'private-fund', name: 'Private Fund / ELP' },
  { id: 'registered-fund', name: 'Registered / Public Fund' },
  { id: 'raif', name: 'RAIF (Luxembourg)' },
  { id: 'sif', name: 'SIF (Luxembourg)' },
  { id: 'scs', name: 'SCS / SCSp (Luxembourg)' },
  { id: 'vcc', name: 'VCC (Singapore)' },
  { id: 'qiaif', name: 'QIAIF / ICAV (Ireland)' },
  { id: 'ilp', name: 'ILP (Ireland)' },
  { id: 'jpf', name: 'Jersey Private Fund' },
  { id: 'expert-fund', name: 'Jersey Expert Fund' },
  { id: 'lpf', name: 'Limited Partnership Fund (HK)' },
  { id: 'aif', name: 'AIF (Cyprus)' },
  { id: 'aiflnp', name: 'AIFLNP (Cyprus)' },
  { id: 'exempt-fund', name: 'Exempt Fund (DIFC)' },
  { id: 'gbc', name: 'Global Business Company (Mauritius)' },
  { id: 'elp', name: 'Exempted LP (Bermuda/Cayman)' },
  { id: 'lp', name: 'Limited Partnership (General)' },
  { id: 'all', name: 'Other / Multiple' },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const STATUS_CONFIG = {
  overdue: { color: '#ef4444', bg: '#450a0a', label: 'OVERDUE' },
  'due-soon': { color: '#f59e0b', bg: '#451a03', label: 'DUE SOON' },
  upcoming: { color: '#34d399', bg: '#022c22', label: 'UPCOMING' },
}

const CATEGORY_ICONS: Record<string, string> = {
  'regulatory-filing': '📋',
  'tax-filing': '🧾',
  audit: '🔍',
  'aml-kyc': '🛡️',
  'lp-reporting': '📊',
  'government-fee': '💳',
}

export default function ComplianceCalendarPage() {
  const [profile, setProfile] = useState<FundProfile>({
    fund_name: '',
    jurisdiction_id: '',
    vehicle_type: '',
    financial_year_end_month: 12,
    financial_year_end_day: 31,
    formation_date: '',
  })
  const [showCalendar, setShowCalendar] = useState(false)
  const [filter, setFilter] = useState<'all' | 'overdue' | 'due-soon' | 'upcoming'>('all')

  const events: CalendarEvent[] = useMemo(() => {
    if (!profile.jurisdiction_id || !profile.vehicle_type) return []
    return buildCalendarEvents(profile)
  }, [profile])

  const filtered = filter === 'all' ? events : events.filter((e) => e.status === filter)

  const counts = {
    overdue: events.filter((e) => e.status === 'overdue').length,
    'due-soon': events.filter((e) => e.status === 'due-soon').length,
    upcoming: events.filter((e) => e.status === 'upcoming').length,
  }

  function handleExportICS() {
    const ics = exportToICS(events, profile.fund_name || 'My Fund')
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.fund_name || 'gnco'}-compliance-calendar.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  const s: React.CSSProperties & Record<string, string | number> = {}
  void s

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e5e7eb', fontFamily: 'sans-serif', padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#6b7280', marginBottom: 8 }}>
            COMPLIANCE CALENDAR
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Fund Compliance Deadlines
          </h1>
          <p style={{ color: '#9ca3af', marginTop: 8, fontSize: 14 }}>
            Enter your fund details to generate a personalised compliance calendar
            with all filing deadlines and obligations for your jurisdiction.
          </p>
        </div>

        {/* Setup Form */}
        {!showCalendar && (
          <div style={{
            background: '#111827', border: '1px solid #1f2937',
            borderRadius: 12, padding: 28, marginBottom: 24,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 20, color: '#d1d5db' }}>
              Fund Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1 }}>FUND NAME</label>
                <input
                  type="text"
                  value={profile.fund_name}
                  onChange={(e) => setProfile((p) => ({ ...p, fund_name: e.target.value }))}
                  placeholder="e.g. Apex Capital Fund I"
                  style={{
                    display: 'block', width: '100%', marginTop: 6,
                    background: '#0d1117', border: '1px solid #374151',
                    borderRadius: 6, padding: '8px 12px', color: '#e5e7eb', fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1 }}>JURISDICTION</label>
                <select
                  value={profile.jurisdiction_id}
                  onChange={(e) => setProfile((p) => ({ ...p, jurisdiction_id: e.target.value }))}
                  style={{
                    display: 'block', width: '100%', marginTop: 6,
                    background: '#0d1117', border: '1px solid #374151',
                    borderRadius: 6, padding: '8px 12px', color: '#e5e7eb', fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Select jurisdiction…</option>
                  {JURISDICTIONS.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1 }}>VEHICLE TYPE</label>
                <select
                  value={profile.vehicle_type}
                  onChange={(e) => setProfile((p) => ({ ...p, vehicle_type: e.target.value }))}
                  style={{
                    display: 'block', width: '100%', marginTop: 6,
                    background: '#0d1117', border: '1px solid #374151',
                    borderRadius: 6, padding: '8px 12px', color: '#e5e7eb', fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Select vehicle type…</option>
                  {VEHICLE_TYPES.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1 }}>FINANCIAL YEAR END</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <select
                    value={profile.financial_year_end_month}
                    onChange={(e) => setProfile((p) => ({ ...p, financial_year_end_month: Number(e.target.value) }))}
                    style={{
                      flex: 1, background: '#0d1117', border: '1px solid #374151',
                      borderRadius: 6, padding: '8px 10px', color: '#e5e7eb', fontSize: 13,
                    }}
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                  <select
                    value={profile.financial_year_end_day}
                    onChange={(e) => setProfile((p) => ({ ...p, financial_year_end_day: Number(e.target.value) }))}
                    style={{
                      width: 70, background: '#0d1117', border: '1px solid #374151',
                      borderRadius: 6, padding: '8px 10px', color: '#e5e7eb', fontSize: 13,
                    }}
                  >
                    {[28, 29, 30, 31].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (profile.jurisdiction_id && profile.vehicle_type) setShowCalendar(true)
              }}
              disabled={!profile.jurisdiction_id || !profile.vehicle_type}
              style={{
                marginTop: 24, padding: '10px 28px', background: '#3b82f6',
                border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600,
                fontSize: 14, cursor: 'pointer', opacity: (!profile.jurisdiction_id || !profile.vehicle_type) ? 0.4 : 1,
              }}
            >
              Generate Compliance Calendar →
            </button>
          </div>
        )}

        {/* Calendar Results */}
        {showCalendar && events.length > 0 && (
          <>
            {/* Summary Badges */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              {(['overdue', 'due-soon', 'upcoming'] as const).map((sKey) => (
                <div
                  key={sKey}
                  onClick={() => setFilter(filter === sKey ? 'all' : sKey)}
                  style={{
                    padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
                    background: filter === sKey ? STATUS_CONFIG[sKey].bg : '#111827',
                    border: `1px solid ${STATUS_CONFIG[sKey].color}`,
                    color: STATUS_CONFIG[sKey].color, fontSize: 12, fontWeight: 600,
                  }}
                >
                  {STATUS_CONFIG[sKey].label}: {counts[sKey]}
                </div>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button
                  onClick={handleExportICS}
                  style={{
                    padding: '6px 14px', background: '#1f2937',
                    border: '1px solid #374151', borderRadius: 6,
                    color: '#d1d5db', fontSize: 12, cursor: 'pointer',
                  }}
                >
                  📅 Export to Calendar (.ics)
                </button>
                <button
                  onClick={() => setShowCalendar(false)}
                  style={{
                    padding: '6px 14px', background: '#1f2937',
                    border: '1px solid #374151', borderRadius: 6,
                    color: '#d1d5db', fontSize: 12, cursor: 'pointer',
                  }}
                >
                  ← Edit Fund Details
                </button>
              </div>
            </div>

            {/* Event List */}
            {filtered.map((ev) => {
              const cfg = STATUS_CONFIG[ev.status]
              return (
                <div
                  key={ev.id}
                  style={{
                    background: '#111827', border: '1px solid #1f2937',
                    borderLeft: `4px solid ${cfg.color}`,
                    borderRadius: 8, padding: '16px 20px', marginBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[ev.obligation.category] ?? '📌'}</span>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{ev.obligation.title}</span>
                        <span style={{
                          fontSize: 10, padding: '2px 8px', borderRadius: 10,
                          background: cfg.bg, color: cfg.color, fontWeight: 600,
                        }}>{cfg.label}</span>
                        {ev.obligation.impact === 'HIGH' && (
                          <span style={{
                            fontSize: 10, padding: '2px 8px', borderRadius: 10,
                            background: '#450a0a', color: '#ef4444', fontWeight: 600,
                          }}>HIGH IMPACT</span>
                        )}
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 8px 0', lineHeight: 1.5 }}>
                        {ev.obligation.description}
                      </p>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        <strong style={{ color: '#d1d5db' }}>Deadline:</strong> {ev.obligation.typical_deadline}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                        <strong style={{ color: '#ef4444' }}>If missed:</strong> {ev.obligation.consequence}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 120, marginLeft: 16 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: cfg.color }}>
                        {ev.days_until_due < 0
                          ? `${Math.abs(ev.days_until_due)}d overdue`
                          : `${ev.days_until_due}d`}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>
                        {ev.due_date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <a
                        href={ev.obligation.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 11, color: '#3b82f6', display: 'block', marginTop: 6 }}
                      >
                        Official source ↗
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Disclaimer */}
            <div style={{
              marginTop: 24, padding: '12px 16px', background: '#111827',
              border: '1px solid #1f2937', borderRadius: 8,
              fontSize: 11, color: '#6b7280', lineHeight: 1.6,
            }}>
              ⚠️ Compliance deadlines are indicative based on standard rules for each jurisdiction and vehicle type.
              Actual deadlines depend on your specific fund documents, regulatory approvals, and fiscal year.
              Always verify with your fund administrator and qualified legal counsel.
            </div>
          </>
        )}

        {showCalendar && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
            No compliance obligations found for this jurisdiction and vehicle type combination.
            <br />
            <button
              onClick={() => setShowCalendar(false)}
              style={{
                marginTop: 16, padding: '8px 20px', background: '#1f2937',
                border: '1px solid #374151', borderRadius: 6, color: '#d1d5db', cursor: 'pointer',
              }}
            >
              Try different settings
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
