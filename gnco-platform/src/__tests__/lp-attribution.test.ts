import { calculateLPAttribution, getWithholdingTaxRate } from '../lib/lp-attribution'
import { MOCK_LPS } from '../lib/mock-data'

describe('LP attribution calculations', () => {
  test('returns complete metric set for an LP', () => {
    const metrics = calculateLPAttribution(MOCK_LPS[0])

    expect(metrics.currentNav).toBeGreaterThanOrEqual(0)
    expect(metrics.grossIrr).toBeGreaterThan(-100)
    expect(metrics.netIrr).toBeLessThanOrEqual(metrics.grossIrr)
    expect(metrics.dpi + metrics.rvpi).toBeCloseTo(metrics.tvpi, 6)
    expect(metrics.moic).toBeCloseTo(metrics.tvpi, 6)
  })

  test('uses fallback withholding tax rate for unknown domicile', () => {
    expect(getWithholdingTaxRate('Unknown')).toBe(15)
  })
})
