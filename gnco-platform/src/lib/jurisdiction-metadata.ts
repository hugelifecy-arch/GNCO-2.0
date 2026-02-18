export type JurisdictionMetadata = {
  lastUpdated: string
  sources: { label: string; href: string }[]
}

const DEFAULT_UPDATED = '2026-02-18'

export const JURISDICTION_METADATA: Record<string, JurisdictionMetadata> = {
  'cayman-islands': {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'CIMA', href: 'https://www.cima.ky/' },
      { label: 'Cayman Islands General Registry', href: 'https://www.ciregistry.ky/' }
    ]
  },
  luxembourg: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'CSSF', href: 'https://www.cssf.lu/en/' },
      { label: 'Luxembourg Trade and Companies Register', href: 'https://www.lbr.lu/' }
    ]
  },
  'delaware-usa': {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Delaware Division of Corporations', href: 'https://corp.delaware.gov/' },
      { label: 'U.S. SEC', href: 'https://www.sec.gov/' }
    ]
  },
  singapore: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Monetary Authority of Singapore', href: 'https://www.mas.gov.sg/' },
      { label: 'ACRA Singapore', href: 'https://www.acra.gov.sg/' }
    ]
  },
  ireland: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Central Bank of Ireland', href: 'https://www.centralbank.ie/' },
      { label: 'Irish Revenue', href: 'https://www.revenue.ie/en/home.aspx' }
    ]
  },
  bvi: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'BVI Financial Services Commission', href: 'https://www.bvifsc.vg/' },
      { label: 'BVI Government', href: 'https://bvi.gov.vg/' }
    ]
  },
  jersey: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Jersey Financial Services Commission', href: 'https://www.jerseyfsc.org/' },
      { label: 'Government of Jersey', href: 'https://www.gov.je/' }
    ]
  },
  guernsey: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Guernsey Financial Services Commission', href: 'https://www.gfsc.gg/' },
      { label: 'States of Guernsey', href: 'https://www.gov.gg/' }
    ]
  },
  netherlands: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Authority for the Financial Markets', href: 'https://www.afm.nl/en' },
      { label: 'Dutch Central Bank', href: 'https://www.dnb.nl/en/' }
    ]
  },
  'united-kingdom': {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Financial Conduct Authority', href: 'https://www.fca.org.uk/' },
      { label: 'Companies House', href: 'https://www.gov.uk/government/organisations/companies-house' }
    ]
  },
  malta: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Malta Financial Services Authority', href: 'https://www.mfsa.mt/' },
      { label: 'Malta Business Registry', href: 'https://mbr.mt/' }
    ]
  },
  switzerland: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'FINMA', href: 'https://www.finma.ch/en/' },
      { label: 'Swiss Federal Tax Administration', href: 'https://www.estv.admin.ch/estv/en/home.html' }
    ]
  },
  cyprus: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'CySEC', href: 'https://www.cysec.gov.cy/en-GB/home/' },
      { label: 'Department of Registrar of Companies Cyprus', href: 'https://www.companies.gov.cy/' }
    ]
  },
  mauritius: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Financial Services Commission Mauritius', href: 'https://www.fscmauritius.org/' },
      { label: 'Mauritius Revenue Authority', href: 'https://www.mra.mu/' }
    ]
  },
  uae: {
    lastUpdated: DEFAULT_UPDATED,
    sources: [
      { label: 'Securities and Commodities Authority UAE', href: 'https://www.sca.gov.ae/' },
      { label: 'DFSA', href: 'https://www.dfsa.ae/' }
    ]
  }
}
