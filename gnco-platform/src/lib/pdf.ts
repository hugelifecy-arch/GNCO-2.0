export type PdfSection = {
  heading: string
  lines: string[]
}

export type AttorneyBriefPage = {
  title: string
  subtitle?: string
  bullets: string[]
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function clampLine(value: string, maxLength = 108) {
  if (value.length <= maxLength) return [value]

  const words = value.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxLength) {
      if (current) lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }

  if (current) lines.push(current)
  return lines
}

function buildPdf(objects: string[]) {
  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]

  objects.forEach((object) => {
    offsets.push(pdf.length)
    pdf += object
  })

  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'

  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${offsets[i].toString().padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  return Buffer.from(pdf, 'binary')
}

export function buildSimplePdf(title: string, date: string, sections: PdfSection[], options?: { watermark?: string }) {
  const contentLines: string[] = [title, `Date: ${date}`, '']

  for (const section of sections) {
    contentLines.push(section.heading)
    section.lines.forEach((line) => {
      const wrapped = clampLine(line)
      wrapped.forEach((item) => contentLines.push(`- ${item}`))
    })
    contentLines.push('')
  }

  const fontSize = 11
  const lineHeight = 14
  const startY = 790

  const textOperations = contentLines
    .filter((line) => line.trim().length > 0)
    .map((line, index) => `1 0 0 1 40 ${startY - index * lineHeight} Tm (${escapePdfText(line)}) Tj`)
    .join('\n')

  const watermarkOps = options?.watermark
    ? `\n0.85 0.2 0.2 rg\n1 0 0 1 140 420 Tm (${escapePdfText(options.watermark)}) Tj\n0 0 0 rg`
    : ''

  const stream = `BT\n/F1 ${fontSize} Tf\n${textOperations}${watermarkOps}\nET`

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ]

  return buildPdf(objects)
}

export function buildAttorneyBriefPdf(pages: AttorneyBriefPage[]) {
  const bodyFontSize = 11
  const bodyLineHeight = 16
  const headerTitleY = 790
  const pageObjects: string[] = []
  const contentObjects: string[] = []
  const fontObjectBody = 3
  const fontObjectHeader = 4

  pages.forEach((page, pageIndex) => {
    const ops: string[] = []

    ops.push('0.06 0.1 0.16 rg')
    ops.push('0 770 612 72 re f')

    ops.push('BT')
    ops.push(`/F2 16 Tf`)
    ops.push('1 1 1 rg')
    ops.push(`1 0 0 1 40 ${headerTitleY} Tm (GNCO Attorney Brief) Tj`)
    ops.push(`/F2 10 Tf`)
    ops.push(`1 0 0 1 40 774 Tm (${escapePdfText(page.title)}) Tj`)
    if (page.subtitle) {
      ops.push(`1 0 0 1 40 760 Tm (${escapePdfText(page.subtitle)}) Tj`)
    }
    ops.push('ET')

    ops.push('BT')
    ops.push(`/F1 ${bodyFontSize} Tf`)
    ops.push('0.12 0.14 0.18 rg')

    let currentY = 735
    for (const bullet of page.bullets) {
      const wrapped = clampLine(bullet, 92)
      wrapped.forEach((line, index) => {
        const prefix = index === 0 ? '• ' : '  '
        ops.push(`1 0 0 1 48 ${currentY} Tm (${escapePdfText(`${prefix}${line}`)}) Tj`)
        currentY -= bodyLineHeight
      })
      currentY -= 4
    }

    ops.push(`/F2 9 Tf`)
    ops.push('0.45 0.49 0.57 rg')
    ops.push(`1 0 0 1 260 24 Tm (Page ${pageIndex + 1} of ${pages.length}) Tj`)
    ops.push('ET')

    const stream = ops.join('\n')
    const contentObjectId = 5 + pageIndex
    const pageObjectId = 5 + pages.length + pageIndex

    contentObjects.push(`${contentObjectId} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`)
    pageObjects.push(
      `${pageObjectId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents ${contentObjectId} 0 R /Resources << /Font << /F1 ${fontObjectBody} 0 R /F2 ${fontObjectHeader} 0 R >> >> >>\nendobj\n`,
    )
  })

  const firstPageObjectId = 5 + pages.length
  const kids = pageObjects.map((_, idx) => `${firstPageObjectId + idx} 0 R`).join(' ')

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    `2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>\nendobj\n`,
    '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    ...contentObjects,
    ...pageObjects,
  ]

  return buildPdf(objects)
}
