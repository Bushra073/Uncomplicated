export function getProcedurePricing(procedure) {
  const title = String(procedure.title || '').toLowerCase()

  if (!title.includes('passport')) return null

  const feeText = String(procedure.fees_information || '')
    .replace(/\s+/g, ' ')
    .replace(/[–—]/g, '-')

  const plans = []

  const pattern =
    /(\d+)\s*pages?\s*,?\s*(\d+)\s*-?\s*years?\s*(?:validity)?\s*:?([\s\S]*?)(?=\d+\s*pages?|$)/gi

  for (const match of feeText.matchAll(pattern)) {
    const details = match[3]

    function extractFee(label) {
      const regex = new RegExp(
        `\\b${label}\\s*[:=-]?\\s*(?:BDT|Tk\\.?|৳)?\\s*([\\d,]+)`,
        'i'
      )

      const result = details.match(regex)

      return result
        ? Number(result[1].replace(/,/g, ''))
        : null
    }

    const regular = extractFee('Regular')
    const express = extractFee('Express')
    const superExpress = extractFee('Super\\s*Express')

    if (
      regular !== null &&
      express !== null &&
      superExpress !== null
    ) {
      plans.push({
        pages: Number(match[1]),
        validity: Number(match[2]),
        regular,
        express,
        superExpress,
      })
    }
  }

  if (!plans.length) return null

  return {
    type: 'passport',
    currency: 'BDT',
    plans,
  }
}