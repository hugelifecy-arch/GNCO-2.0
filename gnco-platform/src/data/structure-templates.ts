import { FundStructureTemplate } from '@/types/structure-diagram'

export const STRUCTURE_TEMPLATES: FundStructureTemplate[] = [
  {
    id: 'cayman-pe-standard',
    name: 'Standard Cayman PE Fund',
    description: 'Classic offshore PE. Cayman ELP as main fund, Delaware GP. Preferred by US and Asian LPs.',
    nodes: [
      {
        id: 'gp-1', type: 'gp-entity',
        label: 'General Partner',
        jurisdiction: 'Cayman Islands',
        entityForm: 'Cayman Exempted Company',
        taxTreatment: '0% Cayman tax. GP principals taxed in home jurisdiction.',
        estimatedAnnualCost: 'USD 8,000–15,000',
        notes: 'Holds GP interest. Controls the fund.'
      },
      {
        id: 'fund-1', type: 'fund-vehicle',
        label: 'Main Fund',
        jurisdiction: 'Cayman Islands',
        entityForm: 'Exempted Limited Partnership (ELP)',
        taxTreatment: '0% Cayman tax. Transparent for US tax purposes.',
        estimatedAnnualCost: 'USD 20,000–40,000',
        notes: 'CIMA-registered Private Fund. Annual return required.'
      },
      {
        id: 'mgmt-1', type: 'management-company',
        label: 'Management Company',
        jurisdiction: 'Delaware, USA',
        entityForm: 'Delaware LLC',
        taxTreatment: 'Pass-through. Management fees: ordinary income.',
        estimatedAnnualCost: 'USD 5,000–12,000',
        notes: 'Receives management fee. Employs investment team.'
      },
      {
        id: 'carry-1', type: 'carry-vehicle',
        label: 'Carry Vehicle',
        jurisdiction: 'Cayman Islands',
        entityForm: 'Cayman LLC',
        taxTreatment: 'Carry as capital gains in principals home jurisdiction (IRC §1061 for US persons).',
        estimatedAnnualCost: 'USD 3,000–8,000',
        notes: 'Holds carried interest. Separate from GP for tax efficiency.'
      },
      {
        id: 'lp-1', type: 'lp-position',
        label: 'US Institutional LPs',
        jurisdiction: 'United States',
        entityForm: 'Endowments, Pensions, Family Offices',
        taxTreatment: 'Pass-through K-1. UBTI risk if leveraged. ERISA monitoring required.',
        estimatedAnnualCost: '—',
        notes: 'Require K-1 tax reporting annually.'
      },
      {
        id: 'lp-2', type: 'lp-position',
        label: 'Asian LPs',
        jurisdiction: 'Singapore / HK / Japan',
        entityForm: 'Family Offices, Sovereign Funds',
        taxTreatment: '0% Cayman WHT. Home jurisdiction tax applies.',
        estimatedAnnualCost: '—',
        notes: 'No US tax filing. Cayman structure highly familiar.'
      }
    ],
    edges: [
      { id: 'e1', source: 'gp-1', target: 'fund-1', edgeType: 'control', label: 'Controls' },
      { id: 'e2', source: 'fund-1', target: 'lp-1', edgeType: 'capital', label: 'Returns capital' },
      { id: 'e3', source: 'fund-1', target: 'lp-2', edgeType: 'capital', label: 'Returns capital' },
      { id: 'e4', source: 'mgmt-1', target: 'fund-1', edgeType: 'control', label: 'Manages' },
      { id: 'e5', source: 'fund-1', target: 'mgmt-1', edgeType: 'fee', label: '2% Mgmt Fee' },
      { id: 'e6', source: 'fund-1', target: 'carry-1', edgeType: 'fee', label: '20% Carry' }
    ]
  },
  {
    id: 'luxembourg-raif',
    name: 'Luxembourg RAIF — EU Institutional',
    description: 'Full AIFMD EU passport. No CSSF pre-approval. Delaware GP for US-based team.',
    nodes: [
      {
        id: 'gp-2', type: 'gp-entity',
        label: 'General Partner',
        jurisdiction: 'Luxembourg',
        entityForm: 'Luxembourg S.à r.l.',
        taxTreatment: '17% Luxembourg CIT on GP income.',
        estimatedAnnualCost: 'EUR 10,000–20,000',
        notes: 'Luxembourg GP provides EU nexus for AIFMD compliance.'
      },
      {
        id: 'aifm-1', type: 'management-company',
        label: 'Authorised AIFM',
        jurisdiction: 'Luxembourg',
        entityForm: 'Luxembourg S.A.',
        taxTreatment: 'Luxembourg CIT applies. Management fees taxable.',
        estimatedAnnualCost: 'EUR 50,000–120,000',
        notes: 'CSSF-authorised. Holds AIFMD passport for EU marketing.'
      },
      {
        id: 'fund-2', type: 'fund-vehicle',
        label: 'RAIF Main Fund',
        jurisdiction: 'Luxembourg',
        entityForm: 'RAIF — SCSp',
        taxTreatment: 'Exempt from Luxembourg CIT. 0.01% annual subscription tax on NAV.',
        estimatedAnnualCost: 'EUR 80,000–180,000',
        notes: 'No CSSF pre-approval required. Full EU AIFMD passport.'
      },
      {
        id: 'lp-3', type: 'lp-position',
        label: 'EU Institutional LPs',
        jurisdiction: 'Europe',
        entityForm: 'Pension Funds, Insurance, Endowments',
        taxTreatment: 'Exempt from Luxembourg WHT. Local tax per LP jurisdiction.',
        estimatedAnnualCost: '—',
        notes: 'Full AIFMD passport — no NPPR needed per country.'
      },
      {
        id: 'feeder-1', type: 'feeder-fund',
        label: 'US Parallel Fund',
        jurisdiction: 'Delaware, USA',
        entityForm: 'Delaware LP',
        taxTreatment: 'Pass-through. K-1 for US LPs.',
        estimatedAnnualCost: 'USD 15,000–30,000',
        notes: 'Parallel structure for US LPs who cannot invest in Luxembourg vehicle.'
      }
    ],
    edges: [
      { id: 'e7', source: 'aifm-1', target: 'fund-2', edgeType: 'control', label: 'Manages' },
      { id: 'e8', source: 'gp-2', target: 'fund-2', edgeType: 'control', label: 'GP Interest' },
      { id: 'e9', source: 'fund-2', target: 'lp-3', edgeType: 'capital', label: 'Distributions' },
      { id: 'e10', source: 'fund-2', target: 'aifm-1', edgeType: 'fee', label: 'Mgmt Fee' },
      { id: 'e11', source: 'feeder-1', target: 'fund-2', edgeType: 'capital', label: 'Co-invests' }
    ]
  },
  {
    id: 'singapore-vcc',
    name: 'Singapore VCC — Asia Pacific',
    description: 'Singapore VCC with Section 13O/13U tax exemption. Ideal for Asia-focused mandates.',
    nodes: [
      {
        id: 'fund-3', type: 'fund-vehicle',
        label: 'VCC Main Fund',
        jurisdiction: 'Singapore',
        entityForm: 'Variable Capital Company (VCC)',
        taxTreatment: '0% on qualifying income under Section 13O/13U. 17% without incentive.',
        estimatedAnnualCost: 'SGD 30,000–80,000',
        notes: 'ACRA-registered. Must appoint MAS-licensed fund manager.'
      },
      {
        id: 'mgmt-2', type: 'management-company',
        label: 'Fund Manager',
        jurisdiction: 'Singapore',
        entityForm: 'Singapore Pte. Ltd.',
        taxTreatment: '17% Singapore CIT on management fees. No CGT.',
        estimatedAnnualCost: 'SGD 20,000–60,000',
        notes: 'Holds MAS CMS licence. Required for VCC and tax incentive.'
      },
      {
        id: 'lp-4', type: 'lp-position',
        label: 'Asian Family Offices',
        jurisdiction: 'Singapore / Hong Kong',
        entityForm: 'Single and Multi-Family Offices',
        taxTreatment: '0% Singapore WHT. Local tax per LP domicile.',
        estimatedAnnualCost: '—',
        notes: 'VCC structure familiar to Singapore and HK LPs.'
      },
      {
        id: 'lp-5', type: 'lp-position',
        label: 'Sovereign Wealth Funds',
        jurisdiction: 'Middle East / SE Asia',
        entityForm: 'Sovereign Wealth Funds',
        taxTreatment: 'Generally tax-exempt in home jurisdiction. 0% Singapore WHT.',
        estimatedAnnualCost: '—',
        notes: 'Singapore preferred domicile for GCC and SE Asian sovereign allocations.'
      }
    ],
    edges: [
      { id: 'e12', source: 'mgmt-2', target: 'fund-3', edgeType: 'control', label: 'Manages' },
      { id: 'e13', source: 'fund-3', target: 'lp-4', edgeType: 'capital', label: 'Distributions' },
      { id: 'e14', source: 'fund-3', target: 'lp-5', edgeType: 'capital', label: 'Distributions' },
      { id: 'e15', source: 'fund-3', target: 'mgmt-2', edgeType: 'fee', label: 'Mgmt Fee' }
    ]
  },
  {
    id: 'difc-mena',
    name: 'DIFC Fund — MENA LP Base',
    description: 'DIFC Exempt Fund. 0% tax with 50-year guarantee. English Common Law. Ideal for Middle East GP.',
    nodes: [
      {
        id: 'fund-4', type: 'fund-vehicle',
        label: 'DIFC Exempt Fund',
        jurisdiction: 'Dubai (DIFC)',
        entityForm: 'DIFC Limited Partnership',
        taxTreatment: '0% income, corporate, CGT, and WHT. 50-year tax guarantee.',
        estimatedAnnualCost: 'USD 30,000–70,000',
        notes: 'DFSA-registered Exempt Fund. Min USD 50,000 subscription.'
      },
      {
        id: 'mgmt-3', type: 'management-company',
        label: 'DFSA Fund Manager',
        jurisdiction: 'Dubai (DIFC)',
        entityForm: 'DIFC Company',
        taxTreatment: '0% DIFC tax on all income.',
        estimatedAnnualCost: 'USD 20,000–50,000',
        notes: 'Holds DFSA Category 3C authorisation.'
      },
      {
        id: 'lp-6', type: 'lp-position',
        label: 'GCC Family Offices',
        jurisdiction: 'UAE / Saudi / Kuwait',
        entityForm: 'Family Offices and HNW Individuals',
        taxTreatment: '0% DIFC WHT. Generally 0% for GCC investors.',
        estimatedAnnualCost: '—',
        notes: 'Primary LP pool. DIFC Common Law familiar to GCC institutions.'
      },
      {
        id: 'lp-7', type: 'lp-position',
        label: 'International LPs',
        jurisdiction: 'Europe / Asia',
        entityForm: 'Institutional Investors',
        taxTreatment: '0% DIFC WHT. Tax per LP home jurisdiction via 130+ UAE treaties.',
        estimatedAnnualCost: '—',
        notes: 'UAE treaty network benefits international LPs.'
      }
    ],
    edges: [
      { id: 'e16', source: 'mgmt-3', target: 'fund-4', edgeType: 'control', label: 'Manages' },
      { id: 'e17', source: 'fund-4', target: 'lp-6', edgeType: 'capital', label: 'Distributions' },
      { id: 'e18', source: 'fund-4', target: 'lp-7', edgeType: 'capital', label: 'Distributions' },
      { id: 'e19', source: 'fund-4', target: 'mgmt-3', edgeType: 'fee', label: 'Mgmt Fee' }
    ]
  },
  {
    id: 'ireland-icav',
    name: 'Ireland QIAIF — European PE',
    description: 'Irish ICAV. Full AIFMD passport. Fast-track CBI authorisation. Best value for EU LP base.',
    nodes: [
      {
        id: 'fund-5', type: 'fund-vehicle',
        label: 'Irish QIAIF',
        jurisdiction: 'Ireland',
        entityForm: 'ICAV',
        taxTreatment: 'Exempt from Irish tax at fund level. No WHT for non-Irish investors.',
        estimatedAnnualCost: 'EUR 80,000–180,000',
        notes: 'CBI-authorised. Min EUR 100,000 subscription. Full EU passport.'
      },
      {
        id: 'aifm-2', type: 'management-company',
        label: 'AIFM',
        jurisdiction: 'Ireland',
        entityForm: 'Irish Limited Company',
        taxTreatment: '12.5% Irish CIT. Lowest EU corporate rate.',
        estimatedAnnualCost: 'EUR 40,000–100,000',
        notes: 'CBI-authorised. Holds AIFMD passport.'
      },
      {
        id: 'lp-8', type: 'lp-position',
        label: 'European Institutional LPs',
        jurisdiction: 'Europe',
        entityForm: 'Pension Funds, Insurance, Endowments',
        taxTreatment: 'Exempt from Irish WHT with correct declarations.',
        estimatedAnnualCost: '—',
        notes: 'No NPPR needed — full passporting across all 27 EU states.'
      }
    ],
    edges: [
      { id: 'e20', source: 'aifm-2', target: 'fund-5', edgeType: 'control', label: 'Manages' },
      { id: 'e21', source: 'fund-5', target: 'lp-8', edgeType: 'capital', label: 'Distributions' },
      { id: 'e22', source: 'fund-5', target: 'aifm-2', edgeType: 'fee', label: 'Mgmt Fee' }
    ]
  }
]
