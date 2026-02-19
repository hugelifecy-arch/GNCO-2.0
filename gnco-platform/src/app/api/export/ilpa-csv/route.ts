import { NextResponse } from 'next/server'

const ILPA_HEADERS = [
  'fund_name',
  'reporting_period',
  'lp_name',
  'commitment_usd',
  'called_capital_usd',
  'distributed_usd',
  'nav_usd',
  'irr_pct',
  'tvpi_multiple',
]

const ILPA_DEMO_ROWS = [
  ['GNCO Demo Fund I', '2026-Q1', 'Sample LP A', '10000000', '3000000', '250000', '8500000', '12.1', '1.18'],
  ['GNCO Demo Fund I', '2026-Q1', 'Sample LP B', '7500000', '2250000', '180000', '6350000', '11.3', '1.16'],
]

export function GET() {
  const csv = [ILPA_HEADERS.join(','), ...ILPA_DEMO_ROWS.map((row) => row.join(','))].join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ilpa-template-beta.csv"',
    },
  })
}
