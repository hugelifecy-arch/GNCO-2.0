import { JURISDICTIONS } from '@/lib/jurisdiction-data'
import { JURISDICTION_METADATA } from '@/lib/jurisdiction-metadata'

type LPEntityType =
  | 'Taxable Individual'
  | 'Pension Fund'
  | 'Endowment/Foundation'
  | 'Sovereign Wealth Fund'
  | 'Insurance Co'
  | 'Corporate'

type WithholdingTaxRates = Record<LPEntityType, number>

const DEFAULT_WITHHOLDING_RATES: WithholdingTaxRates = {
  'Taxable Individual': 20,
  'Pension Fund': 10,
  'Endowment/Foundation': 12,
  'Sovereign Wealth Fund': 8,
  'Insurance Co': 14,
  Corporate: 18,
}

const JURISDICTION_WITHHOLDING_RATES: Record<string, { withholding_tax_rates: WithholdingTaxRates; treaty_reduction: number }> = {
  'cayman-islands': {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, 'Taxable Individual': 12, Corporate: 12 },
    treaty_reduction: 3,
  },
  luxembourg: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, 'Pension Fund': 8, 'Sovereign Wealth Fund': 6 },
    treaty_reduction: 6,
  },
  delaware: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, 'Taxable Individual': 30, Corporate: 21 },
    treaty_reduction: 7,
  },
  singapore: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, Corporate: 16, 'Taxable Individual': 15 },
    treaty_reduction: 5,
  },
  ireland: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, 'Pension Fund': 7, 'Endowment/Foundation': 9 },
    treaty_reduction: 6,
  },
  bvi: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, 'Taxable Individual': 11, Corporate: 11 },
    treaty_reduction: 2,
  },
  jersey: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, 'Taxable Individual': 10, Corporate: 12 },
    treaty_reduction: 3,
  },
  guernsey: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, 'Taxable Individual': 10, Corporate: 11 },
    treaty_reduction: 3,
  },
  mauritius: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, Corporate: 15, 'Pension Fund': 9 },
    treaty_reduction: 6,
  },
  'hong-kong': {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, Corporate: 14, 'Taxable Individual': 14 },
    treaty_reduction: 4,
  },
  netherlands: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, Corporate: 16, 'Pension Fund': 8 },
    treaty_reduction: 7,
  },
  bermuda: {
    withholding_tax_rates: { ...DEFAULT_WITHHOLDING_RATES, 'Taxable Individual': 11, Corporate: 12 },
    treaty_reduction: 2,
  },
}

export const JURISDICTIONS_CANONICAL = JURISDICTIONS.map((jurisdiction) => ({
  ...jurisdiction,
  ...JURISDICTION_METADATA[jurisdiction.id],
  ...(JURISDICTION_WITHHOLDING_RATES[jurisdiction.id] ?? {
    withholding_tax_rates: DEFAULT_WITHHOLDING_RATES,
    treaty_reduction: 4,
  }),
}))
