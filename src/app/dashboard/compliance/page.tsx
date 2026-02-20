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
  { id: 'bermuda', name: 'Bermuda' },
  { id: 'switzerland', name: 'Switzerland' },
  { id: 'cyprus', name: 'Cyprus' },
  { id: 'difc', name: 'Dubai (DIFC)' },
  { id: 'netherlands', name: 'Netherlands' },
]

const VEHICLES = [
  { id: 'all', name: 'All / Multiple' },
  { id: 'private-fund', name: 'Private Fund / ELP' },
  { id: 'registered-fund', name: 'Registered / Public Fund' },
  { id: 'raif', name: 'RAIF (Luxembourg)' },
  { id: 'sif', name: 'SIF (Luxembourg)' },
  { id: 'scsp', name: 'SCSp (Luxembourg)' },
  { id: 'vcc', name: 'VCC (Singapore)' },
  { id: 'qiaif', name: 'QIAIF / ICAV (Ireland)' },
  { id: 'ilp', name: 'ILP (Ireland)' },
  { id: 'jpf', name: 'Jersey Private Fund' },
  { id: 'lpf', name: 'LPF (Hong Kong)' },
  { id: 'aif', name: 'AIF (Cyprus)' },
  { id: 'aiflnp', name: 'AIFLNP (Cyprus)' },
  { id: 'exempt-fund', name: 'Exempt Fund (DIFC)' },
  { id: 'gbc', name: 'GBC (Mauritius)' },
  { id: 'lp', name: 'Limited Partnership' },
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const STATUS = {
  overdue:    { color: '#ef4444', bg: '#450a0a', label: 'OVERDUE' },
  'due-soon': { color: '#f59e0b', bg: '#451a03', label: 'DUE SOON' },
  upcoming:   { color: '#34d399', bg: '#022c22', label: 'UPCOMING' },
} as const

const CAT_ICON: Record<string, string> = {
  'regulatory-filing': '📋', 'tax-filing': '🧾',
  audit: '🔍', 'aml-kyc': '🛡️', 'lp-reporting': '📊', 'government-fee': '💳',
}

export default function ComplianceCalendarPage() {
  const [profile, setProfile] = useState<FundProfile>({
    fund_name: '', jurisdiction_id: '', vehicle_type: 'all',
    financial_year_end_month: 12, financial_year_end_day: 31,
  })
  const [shown, setShown] = useState(false)
  const [filter, setFilter] = useState<'all' | 'overdue' | 'due-soon' | 'upcoming'>('all')

  const events = useMemo(() =>
    profile.jurisdiction_id ? buildCalendarEvents(profile) : [],
    [profile]
  )
  const filtered = filter === 'all' ? events : events.filter(e => e.status === filter)
  const counts = { overdue: 0, 'due-soon': 0, upcoming: 0 }
  events.forEach(e => counts[e.status]++)

  const field: React.CSSProperties = {
    display: 'block', width: '100%', marginTop: 6, background: '#0d1117',
    border: '1px solid #374151', borderRadius: 6, padding: '8px 12px',
    color: '#e5e7eb', fontSize: 13, boxSizing: 'border-box',
  }

  function downloadICS() {
    const blob = new Blob([exportToICS(events, profile.fund_name || 'My Fund')], { type: 'text/calendar' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${(profile.fund_name || 'gnco').replace(/\s+/g, '-')}-compliance.ics`
    a.click()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e5e7eb', fontFamily: 'sans-serif', padding: 28 }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: '#6b7280', margin: '0 0 6px' }}>COMPLIANCE CALENDAR</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 8px' }}>Fund Compliance Deadlines</h1>
        <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 28px' }}>
          Enter your fund details to generate a personalised compliance calendar with all filing deadlines.
        </p>

        {!shown && (
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1 }}>FUND NAME</label>
                <input value={profile.fund_name} onChange={e => setProfile(p => ({ ...p, fund_name: e.target.value }))}
                  placeholder="e.g. Apex Capital Fund I" style={field} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1 }}>JURISDICTION</label>
                <select value={profile.jurisdiction_id} onChange={e => setProfile(p => ({ ...p, jurisdiction_id: e.target.value }))} style={field}>
                  <option value="">Select jurisdiction…</option>
                  {JURISDICTIONS.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1 }}>VEHICLE TYPE</label>
                <select value={profile.vehicle_type} onChange={e => setProfile(p => ({ ...p, vehicle_type: e.target.value }))} style={field}>
                  {VEHICLES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1 }}>FINANCIAL YEAR END</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <select value={profile.financial_year_end_month}
                    onChange={e => setProfile(p => ({ ...p, financial_year_end_month: +e.target.value }))}
                    style={{ ...field, marginTop: 0, flex: 1 }}>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                  <select value={profile.financial_year_end_day}
                    onChange={e => setProfile(p => ({ ...p, financial_year_end_day: +e.target.value }))}
                    style={{ ...field, marginTop: 0, width: 68 }}>
                    {[28,29,30,31].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <button onClick={() => profile.jurisdiction_id && setShown(true)}
              disabled={!profile.jurisdiction_id}
              style={{ marginTop: 20, padding: '10px 26px', background: '#3b82f6', border: 'none',
                borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                opacity: profile.jurisdiction_id ? 1 : 0.4 }}>
              Generate Compliance Calendar →
            </button>
          </div>
        )}

        {shown && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
              {(['overdue', 'due-soon', 'upcoming'] as const).map(s => (
                <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)} style={{
                  padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: filter === s ? STATUS[s].bg : '#111827',
                  border: `1px solid ${STATUS[s].color}`, color: STATUS[s].color,
                }}>
                  {STATUS[s].label}: {counts[s]}
                </button>
              ))}
              <button onClick={downloadICS} style={{ marginLeft: 'auto', padding: '5px 12px', background: '#1f2937',
                border: '1px solid #374151', borderRadius: 6, color: '#d1d5db', fontSize: 12, cursor: 'pointer' }}>
                📅 Export .ics
              </button>
              <button onClick={() => setShown(false)} style={{ padding: '5px 12px', background: '#1f2937',
                border: '1px solid #374151', borderRadius: 6, color: '#d1d5db', fontSize: 12, cursor: 'pointer' }}>
                ← Edit
              </button>
            </div>

            {filtered.map(ev => {
              const cfg = STATUS[ev.status]
              return (
                <div key={ev.id} style={{ background: '#111827', border: '1px solid #1f2937',
                  borderLeft: `4px solid ${cfg.color}`, borderRadius: 8, padding: '14px 18px', marginBottom: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                        <span>{CAT_ICON[ev.obligation.category] ?? '📌'}</span>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{ev.obligation.title}</span>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: cfg.bg, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                        {ev.obligation.impact === 'HIGH' && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: '#450a0a', color: '#ef4444', fontWeight: 600 }}>HIGH IMPACT</span>
                        )}
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 6px', lineHeight: 1.5 }}>{ev.obligation.description}</p>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        <strong style={{ color: '#d1d5db' }}>Deadline:</strong> {ev.obligation.typical_deadline}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>
                        <strong style={{ color: '#ef4444' }}>If missed:</strong> {ev.obligation.consequence}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 110, marginLeft: 14 }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: cfg.color }}>
                        {ev.days_until_due < 0 ? `${Math.abs(ev.days_until_due)}d overdue` : `${ev.days_until_due}d`}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>
                        {ev.due_date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <a href={ev.obligation.source_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, color: '#3b82f6', display: 'block', marginTop: 5 }}>
                        Official source ↗
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}

            <div style={{ marginTop: 20, padding: '10px 14px', background: '#111827', border: '1px solid #1f2937',
              borderRadius: 8, fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>
              ⚠️ Deadlines are indicative. Actual obligations depend on your fund documents and regulatory approvals.
              Always verify with your fund administrator and qualified counsel.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
