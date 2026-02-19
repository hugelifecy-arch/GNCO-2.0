const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const ts = require('typescript')

function loadTsModule(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filePath,
  })

  const module = { exports: {} }
  const dirname = path.dirname(filePath)
  const localRequire = (specifier) => {
    if (specifier.startsWith('.')) {
      const tsPath = path.resolve(dirname, `${specifier}.ts`)
      if (fs.existsSync(tsPath)) {
        return loadTsModule(tsPath)
      }
      const indexTsPath = path.resolve(dirname, specifier, 'index.ts')
      if (fs.existsSync(indexTsPath)) {
        return loadTsModule(indexTsPath)
      }
    }
    return require(specifier)
  }

  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', outputText)
  fn(module.exports, localRequire, module, filePath, dirname)
  return module.exports
}

function run() {
  const root = process.cwd()
  const { JURISDICTIONS } = loadTsModule(path.join(root, 'src/lib/jurisdiction-data.ts'))
  const { JURISDICTION_METADATA } = loadTsModule(path.join(root, 'src/lib/jurisdiction-metadata.ts'))

  const { scoreJurisdiction, defaultScoringInputs } = loadTsModule(
    path.join(root, 'src/lib/jurisdiction-scoring.ts')
  )
  assert.notEqual(
    scoreJurisdiction('ireland', defaultScoringInputs),
    scoreJurisdiction('bvi', defaultScoringInputs),
    'Ireland and BVI suitability scores must differ for default inputs'
  )

  const jurisdictions = JURISDICTIONS.map((jurisdiction) => ({
    ...jurisdiction,
    ...JURISDICTION_METADATA[jurisdiction.id],
  }))

  assert.equal(jurisdictions.length, 15, 'exactly 15 jurisdictions must exist')

  jurisdictions.forEach((jurisdiction) => {
    assert.equal(jurisdiction.status, 'ACTIVE', `${jurisdiction.id} must be ACTIVE`)
  })

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
  ]

  jurisdictions.forEach((jurisdiction) => {
    requiredFields.forEach((field) => {
      const value = jurisdiction[field]
      assert.ok(value, `${jurisdiction.id}.${field} must be populated`)
      assert.notEqual(value, 'coming soon', `${jurisdiction.id}.${field} must not be "coming soon"`)
      assert.notEqual(value, 'partial', `${jurisdiction.id}.${field} must not be "partial"`)
    })
  })

  const ids = jurisdictions.map((jurisdiction) => jurisdiction.id)
  assert.equal(new Set(ids).size, 15, 'jurisdiction ids must be unique')
  ids.forEach((id) => assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/))

  jurisdictions.forEach((jurisdiction) => {
    assert.ok(Array.isArray(jurisdiction.citations), `${jurisdiction.id} citations must be an array`)
    assert.ok(jurisdiction.citations.length >= 1, `${jurisdiction.id} must have at least one citation`)
    jurisdiction.citations.forEach((citation) => {
      assert.match(citation.url, /^https?:\/\//, `${jurisdiction.id} citation must use valid URL format`)
    })
  })

  jurisdictions.forEach((jurisdiction) => {
    Object.values(jurisdiction.official_links).forEach((url) => {
      if (url) {
        assert.match(url, /^https:\/\//, `${jurisdiction.id} official links must use https`)
      }
    })
  })

  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  jurisdictions.forEach((jurisdiction) => {
    const verifiedDate = new Date(jurisdiction.last_verified_date)
    assert.ok(verifiedDate.getTime() > oneYearAgo.getTime(), `${jurisdiction.id} has stale last_verified_date`)
  })

  console.log('PASS jurisdictions.test.ts checks')
}

run()
