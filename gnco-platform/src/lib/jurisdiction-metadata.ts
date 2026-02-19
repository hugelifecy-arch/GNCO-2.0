export type JurisdictionCitation = {
  title: string
  url: string
}

export type JurisdictionMetadata = {
  status: 'ACTIVE'
  last_verified_date: string
  vehicles: string
  regulator: { name: string; url: string }
  timelines: string
  tax_headline: string
  key_compliance: string
  service_providers: string
  official_links: {
    regulator: string
    registry: string
    tax_authority: string
  }
  citations: JurisdictionCitation[]
  confidence: 'HIGH' | 'MED' | 'LOW'
  lastUpdated: string
  sources: { label: string; href: string }[]
}

const VERIFIED_DATE = '2026-02-19'

function buildSources(citations: JurisdictionCitation[]) {
  return citations.map((citation) => ({ label: citation.title, href: citation.url }))
}

function createMetadata(entry: Omit<JurisdictionMetadata, 'lastUpdated' | 'sources'>): JurisdictionMetadata {
  return {
    ...entry,
    lastUpdated: entry.last_verified_date,
    sources: buildSources(entry.citations),
  }
}

export const JURISDICTION_METADATA: Record<string, JurisdictionMetadata> = {
  'cayman-islands': createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Exempted Limited Partnership (ELP), Exempted Company, SPC, LLC, and registered mutual fund structures.',
    regulator: { name: 'Cayman Islands Monetary Authority (CIMA)', url: 'https://www.cima.ky' },
    timelines: 'ELP formation 3-5 business days; CIMA registration typically 5-10 business days, with expedited options.',
    tax_headline: '0% corporate income tax, 0% capital gains tax, and 0% withholding tax; FATCA/CRS reporting applies.',
    key_compliance: 'Private Funds Act 2020, Mutual Funds Act, AML regulations, annual CIMA returns and fees.',
    service_providers: 'Registered Cayman office is mandatory; administrator, auditor, and custodian/prime broker are market standard.',
    official_links: { regulator: 'https://www.cima.ky', registry: 'https://www.gov.ky/portal/page/portal/cighome/government/governmentdepartments/generalregistry', tax_authority: 'https://www.gov.ky' },
    citations: [
      { title: 'CIMA Private Funds Registration', url: 'https://www.cima.ky/regulated-entities/private-funds' },
      { title: 'Private Funds Act 2020', url: 'https://legislation.gov.ky' },
    ],
    confidence: 'HIGH',
  }),
  luxembourg: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'SICAV, SICAF, SIF, RAIF, SICAR, and SCS/SCSp limited partnership structures.',
    regulator: { name: 'Commission de Surveillance du Secteur Financier (CSSF)', url: 'https://www.cssf.lu' },
    timelines: 'RAIF 2-4 weeks, SIF 6-12 weeks, and UCITS usually 3-6 months.',
    tax_headline: 'SIF/RAIF generally exempt from CIT and net wealth tax; 0.01% subscription tax and treaty-linked withholding outcomes.',
    key_compliance: 'AIFMD/UCITS framework, AML/CTF, DAC6 disclosures, and increasing substance expectations.',
    service_providers: 'Authorised AIFM, Luxembourg depositary, approved auditor, central administration, and registered office.',
    official_links: { regulator: 'https://www.cssf.lu', registry: 'https://www.lbr.lu', tax_authority: 'https://impotsdirects.public.lu' },
    citations: [
      { title: 'CSSF Investment Fund Managers', url: 'https://www.cssf.lu/en/investment-fund-managers/' },
      { title: 'Luxembourg RAIF Regime', url: 'https://www.cssf.lu/en/reserved-alternative-investment-fund/' },
    ],
    confidence: 'HIGH',
  }),
  delaware: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Delaware LP, LLC, Series LLC, DST, and corporation structures for GP/manager and fund stacks.',
    regulator: { name: 'SEC + Delaware Division of Corporations', url: 'https://www.sec.gov' },
    timelines: 'State formation can be same-day; SEC adviser registration review often around 45 days.',
    tax_headline: 'Pass-through taxation is common; carried interest and withholding outcomes depend on US tax rules and investor profile.',
    key_compliance: 'Investment Advisers Act, Securities Act private placement rules, Delaware LP Act, IRC 1061, FATCA/ERISA considerations.',
    service_providers: 'Delaware registered agent is mandatory; administrators, auditors, and US counsel are standard.',
    official_links: { regulator: 'https://www.sec.gov', registry: 'https://corp.delaware.gov', tax_authority: 'https://www.irs.gov' },
    citations: [
      { title: 'Delaware Division of Corporations — Limited Partnerships', url: 'https://corp.delaware.gov/lprelationships.shtml' },
      { title: 'SEC Investment Adviser Registration', url: 'https://www.sec.gov/investment/iard' },
    ],
    confidence: 'HIGH',
  }),
  singapore: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Variable Capital Company (VCC), Singapore LP, and unit trust fund structures.',
    regulator: { name: 'Monetary Authority of Singapore (MAS)', url: 'https://www.mas.gov.sg' },
    timelines: 'VCC incorporation is typically 1-3 days; manager licensing can extend to several months.',
    tax_headline: 'No capital gains tax; Section 13O/13U can provide tax exemptions for qualifying funds under Singapore management.',
    key_compliance: 'SFA, VCC Act, AML/CFT obligations, FATCA/CRS, and manager licensing/registration requirements.',
    service_providers: 'MAS-licensed or registered manager is mandatory for VCC; resident director, auditor, and company secretary required.',
    official_links: { regulator: 'https://www.mas.gov.sg', registry: 'https://www.acra.gov.sg', tax_authority: 'https://www.iras.gov.sg' },
    citations: [
      { title: 'MAS Variable Capital Companies', url: 'https://www.mas.gov.sg/regulation/variable-capital-companies' },
      { title: 'IRAS Fund Tax Exemption Schemes', url: 'https://www.iras.gov.sg/taxes/corporate-income-tax/specific-industries/funds' },
    ],
    confidence: 'HIGH',
  }),
  ireland: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'QIAIF, ICAV, ILP, RIAIF, and UCITS structures for sophisticated and retail pathways.',
    regulator: { name: 'Central Bank of Ireland (CBI)', url: 'https://www.centralbank.ie' },
    timelines: 'QIAIF standard launch 8-12 weeks; experienced promoters can use accelerated routes.',
    tax_headline: 'Irish funds are generally tax exempt at fund level, with non-resident withholding exemptions subject to declarations.',
    key_compliance: 'AIFMD/UCITS, CBI regulations, AML/CTF obligations, EMIR, FATCA/CRS, and Pillar Two for in-scope groups.',
    service_providers: 'Authorised AIFM/depositary/admin/auditor stack and governance with Irish-resident directors.',
    official_links: { regulator: 'https://www.centralbank.ie', registry: 'https://www.cro.ie', tax_authority: 'https://www.revenue.ie' },
    citations: [
      { title: 'CBI Investment Funds', url: 'https://www.centralbank.ie/regulation/industry-market-sectors/funds' },
      { title: 'Revenue — Investment Undertakings', url: 'https://www.revenue.ie/en/companies-and-charities/investment-undertakings/index.aspx' },
    ],
    confidence: 'HIGH',
  }),
  bvi: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'BVI Business Company, Limited Partnership, Professional Fund, Private Fund, and Public Fund structures.',
    regulator: { name: 'BVI Financial Services Commission (FSC)', url: 'https://www.bvifsc.vg' },
    timelines: 'LP/BC formation is often 2-3 business days; private/professional recognition can be completed within days.',
    tax_headline: '0% corporate tax, 0% capital gains, and 0% withholding tax; no exchange controls.',
    key_compliance: 'SIBA framework, AML regulations, Economic Substance Act, annual FSC obligations, and FATCA/CRS.',
    service_providers: 'BVI registered agent required; administrator and auditor are common fund operating components.',
    official_links: { regulator: 'https://www.bvifsc.vg', registry: 'https://www.bviica.gov.vg', tax_authority: 'https://www.bvi.gov.vg' },
    citations: [
      { title: 'BVI FSC Investment Funds', url: 'https://www.bvifsc.vg/regulated-entities/investment-funds' },
      { title: 'SIBA 2019 Amendment', url: 'https://legislation.gov.vg' },
    ],
    confidence: 'HIGH',
  }),
  jersey: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Jersey Private Fund, Expert Fund, Listed Fund, LP, and unit trust structures.',
    regulator: { name: 'Jersey Financial Services Commission (JFSC)', url: 'https://www.jerseyfsc.org' },
    timelines: 'JPF approval can be 48-72 hours; expert and fuller tracks take longer.',
    tax_headline: '0% corporate tax for most fund activities, no capital gains tax, and no withholding for non-resident distributions.',
    key_compliance: 'CIF Law, Financial Services Law, AML order, Economic Substance rules, and FATCA/CRS.',
    service_providers: 'JFSC-regulated administrator is mandatory for JPF, plus registered office, audit, and legal support.',
    official_links: { regulator: 'https://www.jerseyfsc.org', registry: 'https://www.jerseyfsc.org/registry/', tax_authority: 'https://www.gov.je/TaxesMoney/IncomeTax' },
    citations: [
      { title: 'JFSC Jersey Private Fund', url: 'https://www.jerseyfsc.org/industry/funds/jersey-private-fund/' },
      { title: 'Government of Jersey — Tax', url: 'https://www.gov.je/TaxesMoney' },
    ],
    confidence: 'HIGH',
  }),
  guernsey: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Private Investment Fund, RCIS, authorised schemes, and Guernsey LP structures.',
    regulator: { name: 'Guernsey Financial Services Commission (GFSC)', url: 'https://www.gfsc.gg' },
    timelines: 'PIF can be completed in 2-3 business days; RCIS and authorised routes take longer.',
    tax_headline: '0% corporate tax for qualifying investment funds with no capital gains or withholding tax.',
    key_compliance: 'Protection of Investors Law, AML handbook, economic substance laws, and FATCA/CRS reporting.',
    service_providers: 'GFSC-licensed designated manager is mandatory for PIF; audit and registered office are standard.',
    official_links: { regulator: 'https://www.gfsc.gg', registry: 'https://www.guernseyregistry.com', tax_authority: 'https://www.gov.gg/revenueservice' },
    citations: [
      { title: 'GFSC Private Investment Fund', url: 'https://www.gfsc.gg/investment-sector/funds/private-investment-fund' },
      { title: 'Guernsey Revenue Service', url: 'https://www.gov.gg/revenueservice' },
    ],
    confidence: 'HIGH',
  }),
  mauritius: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Global Business Company (GBC), Mauritius VCC, Authorised Company, and CIS structures.',
    regulator: { name: 'Financial Services Commission Mauritius (FSC)', url: 'https://www.fscmauritius.org' },
    timelines: 'GBC can be completed in roughly 5-15 business days when applications are complete.',
    tax_headline: '15% headline CIT with partial exemptions may reduce effective rates; no capital gains tax in Mauritius.',
    key_compliance: 'Financial Services Act, Securities Act, FIAMLA AML regime, local substance requirements, and FATCA/CRS.',
    service_providers: 'Licensed management company and resident directors are mandatory for GBC operations.',
    official_links: { regulator: 'https://www.fscmauritius.org', registry: 'https://registrar.intnet.mu', tax_authority: 'https://www.mra.mu' },
    citations: [
      { title: 'FSC Mauritius — Funds', url: 'https://www.fscmauritius.org/our-activities/licensing/funds/' },
      { title: 'Mauritius Revenue Authority', url: 'https://www.mra.mu' },
    ],
    confidence: 'HIGH',
  }),
  'hong-kong': createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Limited Partnership Fund (LPF), Open-ended Fund Company (OFC), and unit trust structures.',
    regulator: { name: 'Securities and Futures Commission (SFC)', url: 'https://www.sfc.hk' },
    timelines: 'LPF can be formed in 3-5 business days, while manager licensing often drives overall timeline.',
    tax_headline: '16.5% profits tax baseline with offshore and carried-interest concessions potentially available; no capital gains tax.',
    key_compliance: 'SFO, LPF Ordinance, AMLO, SFC codes, and FATCA/CRS reporting.',
    service_providers: 'SFC Type 9 manager pathway, HK auditor, company secretary, and custody/prime brokerage stack.',
    official_links: { regulator: 'https://www.sfc.hk', registry: 'https://www.cr.gov.hk', tax_authority: 'https://www.ird.gov.hk' },
    citations: [
      { title: 'SFC — Open-ended Fund Companies', url: 'https://www.sfc.hk/en/Regulatory-functions/Products-and-intermediaries/Open-ended-fund-companies' },
      { title: 'Companies Registry — LPF', url: 'https://www.cr.gov.hk/en/lpf/' },
    ],
    confidence: 'HIGH',
  }),
  netherlands: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'FGR, CV, BV/NV, and related holding/feeder structures used in institutional mandates.',
    regulator: { name: 'AFM + DNB', url: 'https://www.afm.nl' },
    timelines: 'Entity formation can be 1-3 days; full AIFM authorization is materially longer.',
    tax_headline: 'Corporate tax rates and participation exemption framework apply; withholding and treaty effects depend on structure.',
    key_compliance: 'AIFMD, Wwft AML, Wft supervision, UBO obligations, DAC6, and Pillar Two in scope cases.',
    service_providers: 'Dutch office/notary needs, AFM-licensed manager path, audit, and governance support.',
    official_links: { regulator: 'https://www.afm.nl', registry: 'https://www.kvk.nl', tax_authority: 'https://www.belastingdienst.nl' },
    citations: [
      { title: 'AFM Investment Funds', url: 'https://www.afm.nl/en/professionals/onderwerpen/beleggingsinstellingen' },
      { title: 'Belastingdienst — Corporate Tax', url: 'https://www.belastingdienst.nl/wps/wcm/connect/en/business/content/corporate-income-tax' },
    ],
    confidence: 'HIGH',
  }),
  bermuda: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Exempted LP, Segregated Accounts Company, and exempted company structures under BMA classes.',
    regulator: { name: 'Bermuda Monetary Authority (BMA)', url: 'https://www.bma.bm' },
    timelines: 'ELP and institutional fund routes can typically be completed in days, subject to filing quality.',
    tax_headline: '0% corporate/income/capital gains/withholding taxes with available long-dated exemption certificates.',
    key_compliance: 'Investment Funds Act, Companies Act, AML/ATF regulations, and FATCA/CRS reporting.',
    service_providers: 'Bermuda registered office required; BMA-licensed administrator required for administered fund category.',
    official_links: { regulator: 'https://www.bma.bm', registry: 'https://www.roc.gov.bm', tax_authority: 'https://www.gov.bm' },
    citations: [
      { title: 'BMA Investment Funds', url: 'https://www.bma.bm/supervision-regulation/investment-funds/' },
      { title: 'Investment Funds Act 2006', url: 'https://www.bermudalaws.bm' },
    ],
    confidence: 'HIGH',
  }),
  switzerland: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'L-QIF, SICAV, and KmGK structures serving qualified and institutional investor channels.',
    regulator: { name: 'Swiss Financial Market Supervisory Authority (FINMA)', url: 'https://www.finma.ch' },
    timelines: 'L-QIF can launch in around 90 days without pre-approval; fully authorised tracks are substantially longer.',
    tax_headline: 'Federal plus cantonal tax system with varying effective rates; 35% WHT on Swiss-source dividends subject to reclaim.',
    key_compliance: 'CISA, FinSA/FinIA, AMLA, and FATCA/CRS obligations with NPPR considerations for EU distribution.',
    service_providers: 'FINMA-authorised management company and Swiss custody/audit arrangements are core requirements.',
    official_links: { regulator: 'https://www.finma.ch', registry: 'https://www.zefix.ch', tax_authority: 'https://www.estv.admin.ch' },
    citations: [
      { title: 'FINMA L-QIF', url: 'https://www.finma.ch/en/authorisation/collective-investment-schemes/l-qif/' },
      { title: 'Swiss FTA — Withholding Tax', url: 'https://www.estv.admin.ch/estv/en/home/verrechnungssteuer.html' },
    ],
    confidence: 'HIGH',
  }),
  cyprus: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'AIF, AIFLNP, Registered AIF, and Cyprus LP structures under CySEC and AIFMD pathways.',
    regulator: { name: 'Cyprus Securities and Exchange Commission (CySEC)', url: 'https://www.cysec.gov.cy' },
    timelines: 'AIFLNP typically 4-8 weeks; full AIF authorisation can extend to several months.',
    tax_headline: '12.5% corporate tax with broad non-resident withholding exemptions and competitive non-dom features.',
    key_compliance: 'AIF Law 124(I)/2018, AML legislation, AIFMD obligations, FATCA/CRS, and UBO filing requirements.',
    service_providers: 'CySEC-authorised AIFM pathway, local audit, registered office, and depositary where required.',
    official_links: { regulator: 'https://www.cysec.gov.cy', registry: 'https://efiling.drcor.mcit.gov.cy', tax_authority: 'https://www.mof.gov.cy/tax' },
    citations: [
      { title: 'CySEC — Alternative Investment Funds', url: 'https://www.cysec.gov.cy/en-GB/regulated-entities/alternative-investment-funds/' },
      { title: 'Cyprus Tax Department', url: 'https://www.mof.gov.cy/tax' },
    ],
    confidence: 'HIGH',
  }),
  difc: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'DIFC LP, Exempt Fund, Qualified Investor Fund, and Public Fund products under DFSA rules.',
    regulator: { name: 'Dubai Financial Services Authority (DFSA)', url: 'https://www.dfsa.ae' },
    timelines: 'DIFC entity setup can be completed in days; fund manager licensing often spans months.',
    tax_headline: 'DIFC framework is tax-neutral with 0% income/corporate/capital gains/withholding tax treatment in DIFC scope.',
    key_compliance: 'DFSA CIR and AML modules, DIFC Companies framework, annual audits and regulatory returns.',
    service_providers: 'DFSA-authorised manager and DIFC office presence are mandatory with auditor and custody support as needed.',
    official_links: { regulator: 'https://www.dfsa.ae', registry: 'https://www.difc.ae/business/setting-up/registrar-of-companies/', tax_authority: 'https://www.tax.gov.ae' },
    citations: [
      { title: 'DFSA Funds', url: 'https://www.dfsa.ae/Regulated-Entities/Funds' },
      { title: 'DIFC Setting Up', url: 'https://www.difc.ae/business/setting-up/' },
    ],
    confidence: 'HIGH',
  }),
}
