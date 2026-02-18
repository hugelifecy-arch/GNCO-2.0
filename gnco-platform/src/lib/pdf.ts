export type PdfSection = {
  heading: string
  lines: string[]
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

export function buildSimplePdf(title: string, date: string, sections: PdfSection[]) {
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

  const stream = `BT\n/F1 ${fontSize} Tf\n${textOperations}\nET`

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ]

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
