'use client'

import { useMemo, useState } from 'react'

type FamilySituation = 'single' | 'couple' | 'with_children'
type PriorityKey = 'taxEfficiency' | 'qualityOfLife' | 'gpEcosystem' | 'visaSimplicity' | 'timeZone'

type JurisdictionProfile = {
  id: string
  name: string
  carryTaxRate: number
  managementTaxRate: number
  visaPathway: string
  minStay: string
  qualityBase: number
  ecosystemBase: number
  visaBase: number
  timezoneBase: number
  notes: string
}

type DestinationResult = {
  id: string
  destination: string
  carryTaxOverFiveYears: number
  taxSavingVsCurrent: number
  visaPathway: string
  minimumStay: string
  qualityOfLifeScore: number
  gpEcosystemScore: number
  overallScore: number
  notes: string
}

const DISCLAIMER =
  'Personal tax analysis is illustrative only. Residency and domicile determinations are highly fact-specific. Consult qualified tax counsel before making any relocation decision.'

const JURISDICTIONS: JurisdictionProfile[] = [
  {
    id: 'cyprus',
    name: 'Cyprus',
    carryTaxRate: 0.05,
    managementTaxRate: 0.125,
    visaPathway: 'Residence permit via investment/business setup under non-dom planning',
    minStay: 'Typically 60+ days for tax residency (subject to conditions)',
    qualityBase: 7,
    ecosystemBase: 7,
    visaBase: 7,
    timezoneBase: 8,
    notes: 'Non-dom regime, 12.5% corporate rate, 0% on qualifying dividends and interest.',
  },
  {
    id: 'uae',
    name: 'UAE (Dubai/DIFC)',
    carryTaxRate: 0,
    managementTaxRate: 0,
    visaPathway: 'Employment, investor, or free-zone founder visa with residency sponsorship',
    minStay: 'Generally maintain residence and UAE ties; practical presence expected',
    qualityBase: 8,
    ecosystemBase: 9,
    visaBase: 8,
    timezoneBase: 9,
    notes: '0% personal income tax in most cases.',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    carryTaxRate: 0.08,
    managementTaxRate: 0.17,
    visaPathway: 'Global Investor Programme or Employment Pass pathways',
    minStay: 'Meaningful local presence expected for most long-term pathways',
    qualityBase: 9,
    ecosystemBase: 9,
    visaBase: 6,
    timezoneBase: 5,
    notes: 'GIP route, 17% corporate rate, and no general capital gains tax.',
  },
  {
    id: 'ireland',
    name: 'Ireland',
    carryTaxRate: 0.2,
    managementTaxRate: 0.2,
    visaPathway: 'Residence permission via employment or investment routes',
    minStay: '183+ day approach commonly used for residency determination',
    qualityBase: 8,
    ecosystemBase: 8,
    visaBase: 6,
    timezoneBase: 8,
    notes: 'Non-dom remittance basis may apply in some cases.',
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    carryTaxRate: 0.12,
    managementTaxRate: 0.18,
    visaPathway: 'Cantonal residence permit; lump-sum taxation for qualifying HNWI',
    minStay: 'Typically requires substantive residence with cantonal compliance',
    qualityBase: 10,
    ecosystemBase: 8,
    visaBase: 5,
    timezoneBase: 8,
    notes: 'Forfait (lump-sum) taxation can materially alter effective tax outcomes.',
  },
  {
    id: 'malta',
    name: 'Malta',
    carryTaxRate: 0.15,
    managementTaxRate: 0.15,
    visaPathway: 'Ordinary residence/permanent residence and non-dom remittance setup',
    minStay: 'Residence and local ties expected for status maintenance',
    qualityBase: 7,
    ecosystemBase: 6,
    visaBase: 7,
    timezoneBase: 8,
    notes: 'Non-dom framework with 15% flat tax on foreign income remitted (programme dependent).',
  },
  {
    id: 'portugal',
    name: 'Portugal',
    carryTaxRate: 0.1,
    managementTaxRate: 0.1,
    visaPathway: 'D7, digital nomad, or investment-related residency tracks',
    minStay: 'Typical expectation is substantial yearly physical presence',
    qualityBase: 9,
    ecosystemBase: 7,
    visaBase: 6,
    timezoneBase: 8,
    notes: 'NHR-style treatment used as reference: 10% flat assumptions for this model.',
  },
  {
    id: 'uk',
    name: 'UK',
    carryTaxRate: 0.28,
    managementTaxRate: 0.45,
    visaPathway: 'Skilled worker, innovator founder, or investor-adjacent pathways',
    minStay: 'Statutory residence test applies; presence thresholds are case-specific',
    qualityBase: 8,
    ecosystemBase: 10,
    visaBase: 4,
    timezoneBase: 8,
    notes: 'Included as non-dom remittance-basis reference/comparison point.',
  },
]

const PRIORITY_LABELS: Record<PriorityKey, string> = {
  taxEfficiency: 'Tax efficiency',
  qualityOfLife: 'Quality of life',
  gpEcosystem: 'GP ecosystem',
  visaSimplicity: 'Visa simplicity',
  timeZone: 'Time zone',
}

const PRIORITY_KEYS = Object.keys(PRIORITY_LABELS) as PriorityKey[]

const currency = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function normalizeRanking(ranking: PriorityKey[]) {
  const unique = ranking.filter((item, index) => ranking.indexOf(item) === index)
  const missing = PRIORITY_KEYS.filter((item) => !unique.includes(item))

  return [...unique, ...missing]
}

function calculateWeightedScore(ranking: PriorityKey[], factors: Record<PriorityKey, number>) {
  const normalized = normalizeRanking(ranking)
  const maxWeight = normalized.length

  const total = normalized.reduce((sum, key, index) => {
    const weight = maxWeight - index
    return sum + factors[key] * weight
  }, 0)

  const maxPossible = 10 * normalized.reduce((sum, _, index) => sum + (maxWeight - index), 0)

  return Math.round((total / maxPossible) * 100)
}

export function GPRelocationAdvisor() {
  const [currentCountry, setCurrentCountry] = useState('Germany')
  const [nationality, setNationality] = useState('German')
  const [carryFiveYears, setCarryFiveYears] = useState(15000000)
  const [managementFeePerYear, setManagementFeePerYear] = useState(1000000)
  const [familySituation, setFamilySituation] = useState<FamilySituation>('couple')
  const [priorityRanking, setPriorityRanking] = useState<PriorityKey[]>([
    'taxEfficiency',
    'qualityOfLife',
    'gpEcosystem',
    'visaSimplicity',
    'timeZone',
  ])

  const familyQualityAdjustment = familySituation === 'single' ? 0 : familySituation === 'couple' ? 0.4 : 0.9
  const baselineTaxRate = 0.35
  const baselineTax = carryFiveYears * baselineTaxRate

  const results = useMemo<DestinationResult[]>(() => {
    return JURISDICTIONS.map((jurisdiction) => {
      const carryTax = carryFiveYears * jurisdiction.carryTaxRate
      const managementTax = managementFeePerYear * 5 * jurisdiction.managementTaxRate
      const estimatedTax = carryTax + managementTax
      const taxSavingVsCurrent = baselineTax - estimatedTax

      const qualityOfLifeScore = Math.min(10, Number((jurisdiction.qualityBase + familyQualityAdjustment).toFixed(1)))
      const gpEcosystemScore = jurisdiction.ecosystemBase

      const taxEfficiencyScore = Math.max(0, Math.min(10, Number((10 - jurisdiction.carryTaxRate * 20).toFixed(1))))
      const factors: Record<PriorityKey, number> = {
        taxEfficiency: taxEfficiencyScore,
        qualityOfLife: qualityOfLifeScore,
        gpEcosystem: gpEcosystemScore,
        visaSimplicity: jurisdiction.visaBase,
        timeZone: jurisdiction.timezoneBase,
      }

      return {
        id: jurisdiction.id,
        destination: jurisdiction.name,
        carryTaxOverFiveYears: estimatedTax,
        taxSavingVsCurrent,
        visaPathway: jurisdiction.visaPathway,
        minimumStay: jurisdiction.minStay,
        qualityOfLifeScore,
        gpEcosystemScore,
        overallScore: calculateWeightedScore(priorityRanking, factors),
        notes: jurisdiction.notes,
      }
    }).sort((a, b) => b.taxSavingVsCurrent - a.taxSavingVsCurrent)
  }, [baselineTax, carryFiveYears, familyQualityAdjustment, managementFeePerYear, priorityRanking])

  function movePriority(key: PriorityKey, direction: 'up' | 'down') {
    setPriorityRanking((current) => {
      const index = current.indexOf(key)
      if (index < 0) return current

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= current.length) return current

      const updated = [...current]
      ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
      return updated
    })
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-accent-gold">Tools</p>
        <h1 className="font-serif text-4xl">GP Relocation Advisor</h1>
        <p className="max-w-4xl text-text-secondary">
          Generate an indicative relocation report comparing tax outcomes, residency friction, and ecosystem fit
          across leading GP relocation jurisdictions.
        </p>
        <p className="rounded-md border border-accent-gold/40 bg-accent-gold/10 p-3 text-sm font-medium text-accent-gold-light">
          {DISCLAIMER}
        </p>
      </header>

      <section className="grid gap-6 rounded-xl border border-white/10 bg-white/5 p-6 lg:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Current country of residence</span>
          <input
            value={currentCountry}
            onChange={(event) => setCurrentCountry(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Nationality</span>
          <input
            value={nationality}
            onChange={(event) => setNationality(event.target.value)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Expected carried interest over 5 years (€)</span>
          <input
            type="number"
            min={0}
            value={carryFiveYears}
            onChange={(event) => setCarryFiveYears(Number(event.target.value) || 0)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Expected management fee income per year (€)</span>
          <input
            type="number"
            min={0}
            value={managementFeePerYear}
            onChange={(event) => setManagementFeePerYear(Number(event.target.value) || 0)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm lg:col-span-2">
          <span className="text-text-secondary">Family situation</span>
          <select
            value={familySituation}
            onChange={(event) => setFamilySituation(event.target.value as FamilySituation)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2"
          >
            <option value="single">Single</option>
            <option value="couple">Couple</option>
            <option value="with_children">With children</option>
          </select>
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-serif text-2xl">Priority ranking</h2>
        <p className="text-sm text-text-secondary">
          Adjust ranking to shape the overall relocation score (higher ranked priorities carry heavier weight).
        </p>
        <div className="space-y-2">
          {priorityRanking.map((priority, index) => (
            <div key={priority} className="flex items-center justify-between rounded-md border border-white/10 p-3">
              <span>
                {index + 1}. {PRIORITY_LABELS[priority]}
              </span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => movePriority(priority, 'up')}
                  className="rounded border border-white/20 px-2 py-1 text-xs disabled:opacity-40"
                  disabled={index === 0}
                >
                  Move up
                </button>
                <button
                  type="button"
                  onClick={() => movePriority(priority, 'down')}
                  className="rounded border border-white/20 px-2 py-1 text-xs disabled:opacity-40"
                  disabled={index === priorityRanking.length - 1}
                >
                  Move down
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Destination analysis</h2>
        <p className="rounded-md border border-accent-gold/40 bg-accent-gold/10 p-3 text-sm font-medium text-accent-gold-light">
          {DISCLAIMER}
        </p>
        <div className="grid gap-4 xl:grid-cols-2">
          {results.map((result) => (
            <article key={result.id} className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-2xl">{result.destination}</h3>
                <span className="rounded-full bg-accent-gold/20 px-3 py-1 text-xs">Overall {result.overallScore}/100</span>
              </div>
              <p className="text-sm text-text-secondary">{result.notes}</p>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-text-secondary">Estimated personal tax on carry (5 years)</dt>
                  <dd>{currency.format(result.carryTaxOverFiveYears)}</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">Personal tax saving vs. current jurisdiction ({currentCountry})</dt>
                  <dd>{currency.format(result.taxSavingVsCurrent)}</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">Visa/residency pathway</dt>
                  <dd>{result.visaPathway}</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">Minimum stay requirements</dt>
                  <dd>{result.minimumStay}</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">Quality of life score</dt>
                  <dd>{result.qualityOfLifeScore}/10</dd>
                </div>
                <div>
                  <dt className="text-text-secondary">GP ecosystem score</dt>
                  <dd>{result.gpEcosystemScore}/10</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-serif text-2xl">Comparison table</h2>
        <p className="text-sm text-text-secondary">Ranked by total 5-year personal tax saving versus current jurisdiction.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-text-secondary">
                <th className="px-2 py-2">Rank</th>
                <th className="px-2 py-2">Destination</th>
                <th className="px-2 py-2">5Y Estimated Tax</th>
                <th className="px-2 py-2">5Y Tax Saving</th>
                <th className="px-2 py-2">Overall Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.id} className="border-b border-white/5">
                  <td className="px-2 py-2">{index + 1}</td>
                  <td className="px-2 py-2">{result.destination}</td>
                  <td className="px-2 py-2">{currency.format(result.carryTaxOverFiveYears)}</td>
                  <td className="px-2 py-2">{currency.format(result.taxSavingVsCurrent)}</td>
                  <td className="px-2 py-2">{result.overallScore}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="rounded-md border border-accent-gold/40 bg-accent-gold/10 p-3 text-sm font-medium text-accent-gold-light">
          {DISCLAIMER}
        </p>
      </section>

      <footer className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-text-secondary">
        This tool can be delivered as a €500 standalone report or as part of GNCO&apos;s enterprise tier.
        Nationality input ({nationality}) is captured to inform visa eligibility context in advisory follow-up.
      </footer>
    </main>
  )
}
