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
    vehicles: 'ELP, Exempted Company, and SPC structures for global PE/hedge funds.',
    regulator: { name: 'Cayman Islands Monetary Authority (CIMA)', url: 'https://www.cima.ky/' },
    timelines: 'Typical setup timeline is 4-8 weeks depending on AML onboarding and service-provider readiness.',
    tax_headline: 'No direct corporate, withholding, or capital gains tax at fund level in Cayman.',
    key_compliance: 'CIMA registration/notification where applicable, AML/CFT framework, FATCA/CRS filings, and annual returns/audits based on vehicle type.',
    service_providers: 'Maples Fund Services, Apex Group, MUFG Investor Services; counsel such as Maples, Walkers, and Ogier.',
    official_links: {
      regulator: 'https://www.cima.ky/',
      registry: 'https://www.ciregistry.ky/',
      tax_authority: 'https://www.ditc.ky/',
    },
    citations: [
      { title: 'CIMA - Investment Funds', url: 'https://www.cima.ky/securities/investment-funds' },
    ],
    confidence: 'HIGH',
  }),
  luxembourg: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'SCSp, RAIF, SIF, and SICAV-SIF platforms for institutional and cross-border EU fundraising.',
    regulator: { name: 'Commission de Surveillance du Secteur Financier (CSSF)', url: 'https://www.cssf.lu/en/' },
    timelines: 'Typical launch timeline is 8-16 weeks depending on structure complexity and AIFM setup.',
    tax_headline: 'Broad treaty network and flexible fund regimes; tax treatment depends on legal form and elections.',
    key_compliance: 'AIFMD alignment (where relevant), AML/KYC obligations, FATCA/CRS reporting, and annual reporting/audit standards.',
    service_providers: 'Alter Domus, IQ-EQ, Aztec Group; legal advisors include Arendt and Elvinger.',
    official_links: {
      regulator: 'https://www.cssf.lu/en/',
      registry: 'https://www.lbr.lu/',
      tax_authority: 'https://impotsdirects.public.lu/',
    },
    citations: [
      { title: 'CSSF - Funds', url: 'https://www.cssf.lu/en/actors/funds/' },
    ],
    confidence: 'HIGH',
  }),
  'delaware-usa': createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Delaware LP, LLC, and Statutory Trust structures for US-focused fund managers.',
    regulator: { name: 'Delaware Division of Corporations / U.S. SEC', url: 'https://corp.delaware.gov/' },
    timelines: 'Entity formation can be completed in 2-6 weeks with accelerated filing options.',
    tax_headline: 'Pass-through structures are common; US federal/state tax treatment depends on investor mix and elections.',
    key_compliance: 'SEC/private fund adviser rules (as applicable), beneficial ownership reporting, FATCA, and fund-level investor disclosures.',
    service_providers: 'SEI, SS&C GlobeOp, Apex Group; counsel including Kirkland, Latham, and Goodwin.',
    official_links: {
      regulator: 'https://corp.delaware.gov/',
      registry: 'https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx',
      tax_authority: 'https://www.irs.gov/',
    },
    citations: [
      { title: 'Delaware Division of Corporations', url: 'https://corp.delaware.gov/' },
    ],
    confidence: 'HIGH',
  }),
  singapore: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'VCC, LP, and private company structures for APAC and cross-border mandates.',
    regulator: { name: 'Monetary Authority of Singapore (MAS)', url: 'https://www.mas.gov.sg/' },
    timelines: 'Typical setup timeline is 8-14 weeks depending on licensing perimeter and VCC onboarding.',
    tax_headline: 'Competitive incentives and treaty network support regional investment structuring.',
    key_compliance: 'MAS fund-management licensing/exemptions, AML/CFT controls, annual filings with ACRA, and FATCA/CRS.',
    service_providers: 'HSBC Securities Services, Apex Group, Tricor; legal advisers include Allen & Gledhill and Rajah & Tann.',
    official_links: {
      regulator: 'https://www.mas.gov.sg/',
      registry: 'https://www.acra.gov.sg/',
      tax_authority: 'https://www.iras.gov.sg/',
    },
    citations: [
      { title: 'MAS - Fund Management', url: 'https://www.mas.gov.sg/regulation/overview-of-fund-management' },
    ],
    confidence: 'HIGH',
  }),
  ireland: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'ILP, ICAV, and QIAIF structures for EU alternative strategies.',
    regulator: { name: 'Central Bank of Ireland (CBI)', url: 'https://www.centralbank.ie/' },
    timelines: 'Typical setup timeline is 10-18 weeks depending on approval path and delegate onboarding.',
    tax_headline: 'Strong treaty access and established cross-border fund servicing ecosystem.',
    key_compliance: 'CBI authorization/supervision, AML framework, AIFMD obligations, and FATCA/CRS reporting.',
    service_providers: 'State Street, Northern Trust, Citco; legal advisers include Matheson and Arthur Cox.',
    official_links: {
      regulator: 'https://www.centralbank.ie/',
      registry: 'https://core.cro.ie/',
      tax_authority: 'https://www.revenue.ie/en/home.aspx',
    },
    citations: [
      { title: 'CBI - Funds Sector', url: 'https://www.centralbank.ie/regulation/industry-market-sectors/funds' },
    ],
    confidence: 'MED',
  }),
  bvi: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Professional Fund, Private Fund, and approved manager ecosystems with BVI company/LP entities.',
    regulator: { name: 'BVI Financial Services Commission', url: 'https://www.bvifsc.vg/' },
    timelines: 'Typical timeline is 4-10 weeks depending on fund category and service-provider readiness.',
    tax_headline: 'Tax-neutral framework with broad use in offshore holding and fund structures.',
    key_compliance: 'FSC recognition/registration, AML/CFT controls, annual economic substance and regulatory filings as applicable.',
    service_providers: 'Apex, Trident Trust, Intertrust; legal advisers include Harneys, Maples, and Mourant.',
    official_links: {
      regulator: 'https://www.bvifsc.vg/',
      registry: 'https://www.bvifsc.vg/regulated-entities-search',
      tax_authority: 'https://bvi.gov.vg/departments/inland-revenue-department',
    },
    citations: [
      { title: 'BVI FSC - Investment Business', url: 'https://www.bvifsc.vg/licensed-entities/investment-business' },
    ],
    confidence: 'MED',
  }),
  jersey: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Jersey Private Fund, Expert Fund, and Jersey LP/company platforms.',
    regulator: { name: 'Jersey Financial Services Commission (JFSC)', url: 'https://www.jerseyfsc.org/' },
    timelines: 'Typical setup is 6-12 weeks, often faster for qualifying private-fund tracks.',
    tax_headline: 'Tax-neutral fund structures with strong UK/Channel Islands market familiarity.',
    key_compliance: 'JFSC consent/authorizations, AML/CFT controls, beneficial ownership obligations, and FATCA/CRS reporting.',
    service_providers: 'Apex, JTC, Aztec; legal advisers include Carey Olsen, Mourant, and Ogier.',
    official_links: {
      regulator: 'https://www.jerseyfsc.org/',
      registry: 'https://www.jerseyfsc.org/registry/',
      tax_authority: 'https://www.gov.je/taxesmoney/income/pages/default.aspx',
    },
    citations: [
      { title: 'JFSC - Funds', url: 'https://www.jerseyfsc.org/industry/funds/' },
    ],
    confidence: 'MED',
  }),
  guernsey: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Registered/Authorized Collective Investment Schemes and Guernsey LP/company structures.',
    regulator: { name: 'Guernsey Financial Services Commission (GFSC)', url: 'https://www.gfsc.gg/' },
    timelines: 'Typical setup timeline is 6-12 weeks depending on route and governance model.',
    tax_headline: 'Tax-neutral profile with established private capital infrastructure.',
    key_compliance: 'GFSC registration/authorization, AML/CFT obligations, economic substance, and FATCA/CRS compliance.',
    service_providers: 'Apex, IQ-EQ, JTC; legal advisers include Mourant and Carey Olsen.',
    official_links: {
      regulator: 'https://www.gfsc.gg/',
      registry: 'https://www.guernseyregistry.com/',
      tax_authority: 'https://www.gov.gg/tax',
    },
    citations: [
      { title: 'GFSC - Investment Funds', url: 'https://www.gfsc.gg/industry-sectors/investment-funds' },
    ],
    confidence: 'MED',
  }),
  netherlands: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'CV/FGR/BV structures and AIFMD-aligned platforms for EU and treaty-oriented strategies.',
    regulator: { name: 'Authority for the Financial Markets (AFM)', url: 'https://www.afm.nl/en' },
    timelines: 'Typical setup timeline is 8-16 weeks depending on licensing and depositary arrangements.',
    tax_headline: 'Extensive treaty network and established institutional framework for cross-border deployment.',
    key_compliance: 'AFM/DNB supervisory obligations, AIFMD requirements, AML rules, and FATCA/CRS reporting.',
    service_providers: 'TMF Group, Alter Domus, IQ-EQ; legal advisers include De Brauw and Loyens & Loeff.',
    official_links: {
      regulator: 'https://www.afm.nl/en',
      registry: 'https://www.kvk.nl/english/',
      tax_authority: 'https://www.belastingdienst.nl/wps/wcm/connect/en/home/home',
    },
    citations: [
      { title: 'AFM - Asset Management', url: 'https://www.afm.nl/en/professionals/asset-management' },
    ],
    confidence: 'MED',
  }),
  'united-kingdom': createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'English or Scottish LP structures and authorized UK fund products where relevant.',
    regulator: { name: 'Financial Conduct Authority (FCA)', url: 'https://www.fca.org.uk/' },
    timelines: 'Typical setup is 6-14 weeks depending on private-fund model and manager authorization scope.',
    tax_headline: 'Strong legal certainty and broad treaty network; tax outcomes depend on entity and investor profile.',
    key_compliance: 'FCA authorization/perimeter checks, AML registration, Companies House/PSC obligations, and FATCA/CRS reporting.',
    service_providers: 'Langham Hall, Apex, Aztec; legal advisers include Travers Smith and Macfarlanes.',
    official_links: {
      regulator: 'https://www.fca.org.uk/',
      registry: 'https://www.gov.uk/government/organisations/companies-house',
      tax_authority: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
    },
    citations: [
      { title: 'FCA - Funds', url: 'https://www.fca.org.uk/firms/fund-regulation' },
    ],
    confidence: 'MED',
  }),
  'hong-kong': createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Limited Partnership Fund (LPF) and Open-ended Fund Company (OFC) structures.',
    regulator: { name: 'Securities and Futures Commission (SFC)', url: 'https://www.sfc.hk/en/' },
    timelines: 'Typical setup timeline is 6-10 weeks for LPF-centric private fund launches.',
    tax_headline: 'Profits-tax exemptions may apply subject to Hong Kong fund and carried-interest criteria.',
    key_compliance: 'SFC licensing where applicable, AML/CFT controls, Companies Registry filings, and FATCA/CRS reporting.',
    service_providers: 'Vistra, Tricor, HSBC Securities Services; legal advisers include Deacons and Mayer Brown.',
    official_links: {
      regulator: 'https://www.sfc.hk/en/',
      registry: 'https://www.cr.gov.hk/en/home/index.htm',
      tax_authority: 'https://www.ird.gov.hk/eng/welcome.htm',
    },
    citations: [
      { title: 'Hong Kong SFC - Asset Management', url: 'https://www.sfc.hk/en/Regulatory-functions/Products/Investment-products' },
    ],
    confidence: 'MED',
  }),
  mauritius: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'GBC, LP, and PCC structures commonly used for Africa and India investment corridors.',
    regulator: { name: 'Financial Services Commission Mauritius', url: 'https://www.fscmauritius.org/' },
    timelines: 'Typical setup timeline is 6-10 weeks depending on category and substance planning.',
    tax_headline: 'Moderate-tax jurisdiction with treaty utility for selected outbound corridors.',
    key_compliance: 'FSC licensing/registration, AML/CFT controls, economic substance obligations, and FATCA/CRS reporting.',
    service_providers: 'IQ-EQ Mauritius, Apex Mauritius, Intercontinental Trust; legal advisers include BLC Robert.',
    official_links: {
      regulator: 'https://www.fscmauritius.org/',
      registry: 'https://companies.govmu.org/',
      tax_authority: 'https://www.mra.mu/',
    },
    citations: [
      { title: 'FSC Mauritius - Collective Investment Schemes', url: 'https://www.fscmauritius.org/en/supervision/register-of-licensees' },
    ],
    confidence: 'MED',
  }),
  malta: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'Notified AIF, SICAV, and LP structures for EU-focused managers.',
    regulator: { name: 'Malta Financial Services Authority (MFSA)', url: 'https://www.mfsa.mt/' },
    timelines: 'Typical setup timeline is 8-14 weeks subject to route-to-market and service-provider onboarding.',
    tax_headline: 'EU fund domicile with moderate operating costs and investor familiarity in specific segments.',
    key_compliance: 'MFSA authorization/notification, AML requirements, annual audit/filings, and FATCA/CRS obligations.',
    service_providers: 'Apex Malta, Alter Domus Malta, BOV Fund Services; legal advisers include Ganado and WH Partners.',
    official_links: {
      regulator: 'https://www.mfsa.mt/',
      registry: 'https://mbr.mt/',
      tax_authority: 'https://cfr.gov.mt/en/',
    },
    citations: [
      { title: 'MFSA - Investment Services', url: 'https://www.mfsa.mt/our-work/capital-markets/' },
    ],
    confidence: 'MED',
  }),
  switzerland: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles: 'KmGK, SICAV, and contractual fund structures for high-governance institutional mandates.',
    regulator: { name: 'Swiss Financial Market Supervisory Authority (FINMA)', url: 'https://www.finma.ch/en/' },
    timelines: 'Typical setup timeline is 10-18 weeks due to governance and approval intensity.',
    tax_headline: 'Strong treaty position with premium governance profile and generally higher operating costs.',
    key_compliance: 'FINMA authorization/perimeter analysis, AML controls, annual reporting/audit, and FATCA/CRS compliance.',
    service_providers: 'CACEIS Switzerland, Swissquote, SGSS Switzerland; legal advisers include Lenz & Staehelin.',
    official_links: {
      regulator: 'https://www.finma.ch/en/',
      registry: 'https://www.zefix.ch/en/search/entity/welcome',
      tax_authority: 'https://www.estv.admin.ch/estv/en/home.html',
    },
    citations: [
      { title: 'FINMA - Asset Management', url: 'https://www.finma.ch/en/authorisation/asset-management/' },
    ],
    confidence: 'MED',
  }),
  cyprus: createMetadata({
    status: 'ACTIVE',
    last_verified_date: VERIFIED_DATE,
    vehicles:
      'Alternative Investment Fund (AIF); AIF with Limited Number of Persons (AIFLNP — up to 75 investors, lighter regulation); Registered AIF (RAIF-equivalent, no CySEC pre-approval)',
    regulator: { name: 'Cyprus Securities and Exchange Commission (CySEC)', url: 'https://www.cysec.gov.cy' },
    timelines: 'Typical setup timeline is 8-14 weeks depending on approval route, local substance, and administrator onboarding.',
    tax_headline:
      '12.5% corporate income tax (lowest in EU); no withholding tax on dividends, interest or royalties to non-residents; IP Box regime (2.5% effective rate on IP income); full EU treaty access; non-dom regime for HNW individuals',
    key_compliance: 'CySEC authorization/notification where applicable, AML/CFT obligations, annual audit and filing requirements, and FATCA/CRS reporting.',
    service_providers: 'Apex Cyprus, Alter Domus Cyprus, Trident Trust; legal advisers include Harneys Cyprus and Chrysses Demetriades.',
    official_links: {
      regulator: 'https://www.cysec.gov.cy',
      registry: 'https://efiling.drcor.mcit.gov.cy',
      tax_authority: 'https://www.mof.gov.cy/tax',
    },
    citations: [
      { title: 'CySEC - Alternative Investment Funds Law and framework', url: 'https://www.cysec.gov.cy/en-GB/entities/investment-firms/law-regulations/' },
      { title: 'CySEC - Circulars and directives for AIF/AIFLNP supervision', url: 'https://www.cysec.gov.cy/en-GB/legal-framework/circulars/' },
      { title: 'Cyprus Ministry of Finance - Tax Department', url: 'https://www.mof.gov.cy/mof/tax/taxdep.nsf/index_en/index_en?OpenDocument' },
    ],
    confidence: 'HIGH',
  }),
}
