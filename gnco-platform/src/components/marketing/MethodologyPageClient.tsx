'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Citation } from '@/components/ui/Citation'

const sections = [
  {
    id: 'analytical-framework',
    title: 'Our Analytical Framework',
    content:
      'GNCO evaluates jurisdictions through an operational lens that blends legal structure viability, execution speed, investor familiarity, and tax friction. Every recommendation is produced from scenario-based modeling rather than static jurisdiction rankings.',
  },
  {
    id: 'jurisdiction-scoring-model',
    title: 'Jurisdiction Scoring Model',
    content: (
      <>
        <Citation source="GNCO methodology weighting framework" url="https://gnco.ai/methodology" marker="1">
          Our six dimensions are: tax efficiency (25%), LP familiarity (20%), regulatory simplicity (15%), speed to close (15%), cost of formation (15%), and privacy/governance fit (10%).
        </Citation>{' '}
        Weighted scores are normalized to a 0–100 scale and refreshed whenever major regulatory or treaty updates are detected.
      </>
    ),
  },
  {
    id: 'lp-tax-impact-methodology',
    title: 'LP Tax Impact Methodology',
    content:
      'LP tax impact estimates combine asset-geography assumptions, investor profile mappings, treaty relief availability, withholding benchmarks, and pass-through leakage assumptions. Output ranges are directional and should be interpreted as comparative estimates rather than filing-ready calculations. Local advisor interpretation remains required.',
  },
  {
    id: 'performance-calculation-standards',
    title: 'Performance Calculation Standards',
    content:
      'GNCO follows ILPA-aligned definitions: IRR for annualized cashflow return, TVPI for total value to paid-in, DPI for distributed to paid-in, RVPI for residual value to paid-in, and PME for public market equivalent benchmarking. Calculations assume consistent cashflow cutoffs and NAV timestamps across all compared structures.',
  },
  {
    id: 'data-sources-update-frequency',
    title: 'Data Sources and Update Frequency',
    content:
      'Source inputs include public regulator circulars, treaty databases, law firm briefing updates, fund administrator benchmarks, and GNCO-maintained operational surveys. Core metrics are reviewed monthly, while event-driven updates are pushed within 72 hours after material legal or tax announcements.',
  },
  {
    id: 'limitations-assumptions',
    title: 'Limitations and Assumptions',
    content:
      'Outputs rely on assumed fund strategy, manager profile, LP composition, and anticipated cross-border asset flow. Exceptional situations—such as bespoke side letters, sanctions constraints, or unusual investor tax elections—can materially alter results and are not fully represented in baseline scoring.',
  },
  {
    id: 'interpreting-recommendations',
    title: 'How to Interpret Recommendations',
    content:
      'Treat recommendations as decision support, not deterministic prescriptions. Start with the top-ranked structure, compare second-best alternatives for trade-off awareness, then validate assumptions with legal and tax counsel before term sheet or governing document finalization.',
  },
]

type MethodologySection = {
  id: string
  title: string
  content: ReactNode
}

const typedSections: MethodologySection[] = sections

export function MethodologyPageClient() {
  const [activeSection, setActiveSection] = useState(typedSections[0].id)

  const sectionIds = useMemo(() => typedSections.map((section) => section.id), [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.15, 0.35, 0.6],
      },
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sectionIds])

  return (
    <main className="bg-bg-primary px-4 py-12 text-text-primary sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-bg-border bg-bg-surface p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">Table of Contents</p>
            <nav aria-label="Methodology sections">
              <ul className="space-y-1">
                {typedSections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`block rounded-md px-3 py-2 text-sm transition ${
                        activeSection === section.id
                          ? 'bg-accent-gold/15 text-accent-gold'
                          : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                      }`}
                    >
                      {index + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <article className="space-y-10 rounded-xl border border-bg-border bg-bg-surface p-6 sm:p-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-semibold sm:text-4xl">Methodology</h1>
            <p className="max-w-3xl text-text-secondary">
              This document outlines the analytical standards behind GNCO recommendations, including scoring logic,
              performance definitions, update cadence, and interpretation guardrails.
            </p>
          </header>

          {typedSections.map((section, index) => (
            <section id={section.id} key={section.id} className="scroll-mt-24 space-y-3 border-t border-bg-border pt-6 first:border-t-0 first:pt-0">
              <h2 className="text-2xl font-semibold">
                {index + 1}. {section.title}
              </h2>
              <div className="leading-7 text-text-secondary">{section.content}</div>
            </section>
          ))}
        </article>
      </div>
    </main>
  )
}
