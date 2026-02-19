import { JURISDICTIONS_CANONICAL as jurisdictions } from '../data/jurisdictions'

describe('Jurisdiction Data Integrity', () => {
  test('exactly 15 jurisdictions exist', () => {
    expect(jurisdictions).toHaveLength(15)
  })

  test('all jurisdictions have status ACTIVE', () => {
    jurisdictions.forEach((jurisdiction) => {
      expect(jurisdiction.status).toBe('ACTIVE')
    })
  })

  test('all jurisdictions have required fields populated', () => {
    const requiredFields = [
      'id',
      'name',
      'region',
      'status',
      'last_verified_date',
      'regulator',
      'vehicles',
      'tax_headline',
      'citations',
      'confidence',
    ] as const

    jurisdictions.forEach((jurisdiction) => {
      requiredFields.forEach((field) => {
        const value = jurisdiction[field]
        expect(value).toBeTruthy()
        expect(value).not.toBe('coming soon')
        expect(value).not.toBe('partial')
      })
    })
  })

  test('all jurisdiction IDs are unique slugs', () => {
    const ids = jurisdictions.map((jurisdiction) => jurisdiction.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(15)
    ids.forEach((id) => {
      expect(id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    })
  })

  test('all citations have valid URL format', () => {
    jurisdictions.forEach((jurisdiction) => {
      expect(Array.isArray(jurisdiction.citations)).toBe(true)
      expect(jurisdiction.citations.length).toBeGreaterThanOrEqual(1)

      jurisdiction.citations.forEach((citation) => {
        expect(citation.url).toMatch(/^https?:\/\//)
      })
    })
  })


  test('all jurisdictions include compliance obligations', () => {
    jurisdictions.forEach((jurisdiction) => {
      expect(Array.isArray(jurisdiction.compliance_obligations)).toBe(true)
      expect(jurisdiction.compliance_obligations.length).toBeGreaterThanOrEqual(1)

      jurisdiction.compliance_obligations.forEach((obligation) => {
        expect(obligation.obligation).toBeTruthy()
        expect(obligation.frequency).toBeTruthy()
        expect(obligation.typical_deadline).toBeTruthy()
        expect(obligation.consequence_of_miss).toBeTruthy()
        expect(Array.isArray(obligation.applies_to)).toBe(true)
      })
    })
  })

  test('all official_links use https', () => {
    jurisdictions.forEach((jurisdiction) => {
      Object.values(jurisdiction.official_links).forEach((url) => {
        if (url) {
          expect(url).toMatch(/^https:\/\//)
        }
      })
    })
  })

  test('no jurisdiction has last_verified_date older than 365 days', () => {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    jurisdictions.forEach((jurisdiction) => {
      const verifiedDate = new Date(jurisdiction.last_verified_date)
      expect(verifiedDate.getTime()).toBeGreaterThan(oneYearAgo.getTime())
    })
  })
})
