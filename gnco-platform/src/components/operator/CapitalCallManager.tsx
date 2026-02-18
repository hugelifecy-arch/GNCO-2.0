'use client'

import { Fragment, useMemo, useState } from 'react'

import { MOCK_CAPITAL_CALLS, MOCK_FUNDS, MOCK_LPS } from '@/lib/mock-data'
import type { CapitalCall, LPAllocation } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export function CapitalCallManager() {
  const [showModal, setShowModal] = useState(false)
  const [fundName, setFundName] = useState(MOCK_FUNDS[0]?.fundName ?? '')
  const [callDate, setCallDate] = useState('2025-02-15')
  const [dueDate, setDueDate] = useState('2025-03-01')
  const [totalAmount, setTotalAmount] = useState(22_000_000)
  const [purpose, setPurpose] = useState('Working capital and follow-ons')
  const [allocations, setAllocations] = useState<LPAllocation[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  const totalCommitments = useMemo(() => MOCK_LPS.reduce((sum, lp) => sum + lp.commitmentAmount, 0), [])

  const calculateAllocations = () => {
    const next = MOCK_LPS.map((lp) => {
      const share = lp.commitmentAmount / totalCommitments
      const allocation = Number((totalAmount * share).toFixed(2))
      return {
        lpId: lp.id,
        lpName: lp.legalName,
        allocationAmount: allocation,
        paidAmount: 0,
        status: 'pending' as const,
      }
    })
    setAllocations(next)
  }

  const calls: CapitalCall[] = MOCK_CAPITAL_CALLS

  return (
    <section className="space-y-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded border border-accent-gold/40 bg-accent-gold/10 px-4 py-2 text-sm text-accent-gold"
        >
          CREATE NEW CALL
        </button>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-lg border border-bg-border bg-bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Create Capital Call</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-text-secondary">Close</button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <select className="rounded border border-bg-border bg-bg-elevated px-3 py-2" value={fundName} onChange={(e) => setFundName(e.target.value)}>
                {MOCK_FUNDS.map((fund) => <option key={fund.fundName}>{fund.fundName}</option>)}
              </select>
              <input type="date" value={callDate} onChange={(e) => setCallDate(e.target.value)} className="rounded border border-bg-border bg-bg-elevated px-3 py-2" />
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded border border-bg-border bg-bg-elevated px-3 py-2" />
              <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} className="rounded border border-bg-border bg-bg-elevated px-3 py-2" placeholder="Total Amount" />
              <input value={purpose} onChange={(e) => setPurpose(e.target.value)} className="rounded border border-bg-border bg-bg-elevated px-3 py-2 md:col-span-2" placeholder="Purpose" />
            </div>

            <button type="button" onClick={calculateAllocations} className="mt-4 rounded border border-bg-border px-3 py-2 text-sm">
              Calculate LP Allocations
            </button>

            {allocations.length ? (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-bg-border text-text-secondary">
                    <tr>
                      <th className="px-2 py-2">LP</th>
                      <th className="px-2 py-2">% Share</th>
                      <th className="px-2 py-2">Allocation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((alloc) => (
                      <tr key={alloc.lpId} className="border-b border-bg-border/40">
                        <td className="px-2 py-2">{alloc.lpName}</td>
                        <td className="px-2 py-2">{((alloc.allocationAmount / totalAmount) * 100).toFixed(2)}%</td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            className="w-40 rounded border border-bg-border bg-bg-elevated px-2 py-1"
                            value={alloc.allocationAmount}
                            onChange={(event) => {
                              const value = Number(event.target.value)
                              setAllocations((prev) =>
                                prev.map((row) => (row.lpId === alloc.lpId ? { ...row, allocationAmount: value } : row))
                              )
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="rounded border border-bg-border px-3 py-2 text-sm">Preview call notice</button>
              <button type="button" className="rounded border border-accent-gold/40 bg-accent-gold/10 px-3 py-2 text-sm text-accent-gold">Send to All LPs</button>
              <button type="button" className="rounded border border-bg-border px-3 py-2 text-sm">Save as Draft</button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="rounded-lg border border-bg-border bg-bg-surface p-4">
        <h2 className="mb-3 font-serif text-xl">Existing Calls</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-bg-border text-text-secondary">
              <tr>
                <th className="px-2 py-2">Fund</th>
                <th className="px-2 py-2">Call Date</th>
                <th className="px-2 py-2">Due Date</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Paid</th>
                <th className="px-2 py-2">Outstanding</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => {
                const paid = call.lpAllocations.reduce((sum, alloc) => sum + alloc.paidAmount, 0)
                const outstanding = Math.max(0, call.totalAmount - paid)
                return (
                  <Fragment key={call.id}>
                    <tr className="border-b border-bg-border/40">
                      <td className="px-2 py-2">{call.fundName}</td>
                      <td className="px-2 py-2">{formatDate(call.callDate)}</td>
                      <td className="px-2 py-2">{formatDate(call.dueDate)}</td>
                      <td className="px-2 py-2">{formatCurrency(call.totalAmount)}</td>
                      <td className="px-2 py-2">{formatCurrency(paid)}</td>
                      <td className="px-2 py-2">{formatCurrency(outstanding)}</td>
                      <td className="px-2 py-2 capitalize">{call.status}</td>
                      <td className="px-2 py-2">
                        <div className="flex flex-wrap gap-1">
                          <button type="button" className="rounded border border-bg-border px-2 py-1 text-xs">Send Reminder</button>
                          <button type="button" className="rounded border border-bg-border px-2 py-1 text-xs">Mark Paid</button>
                          <button type="button" className="rounded border border-bg-border px-2 py-1 text-xs">Download Notices</button>
                          <button type="button" className="rounded border border-bg-border px-2 py-1 text-xs" onClick={() => setExpanded(expanded === call.id ? null : call.id)}>Expand</button>
                        </div>
                      </td>
                    </tr>
                    {expanded === call.id ? (
                      <tr className="border-b border-bg-border/20 bg-bg-elevated/30">
                        <td colSpan={8} className="px-4 py-3">
                          <p className="mb-2 text-xs text-text-secondary">LP-level payment status</p>
                          <div className="grid gap-2 md:grid-cols-2">
                            {(call.lpAllocations.length ? call.lpAllocations : allocations.slice(0, 6)).map((alloc) => (
                              <div key={alloc.lpId} className="flex items-center justify-between rounded border border-bg-border px-3 py-2 text-xs">
                                <span>{alloc.lpName}</span>
                                <span className="capitalize text-text-secondary">{alloc.status}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
