export const documentTypes = [
  'Identity',
  'Education',
  'Legal',
  'Employment',
  'Financial',
  'Medical',
  'Personal',
  'Other',
]

export const emptyForm = {
  document_name: '',
  document_type: 'Identity',
  issue_date: '',
  expiry_date: '',
  notes: '',
}

// Format dates for input fields
export function dateOnly(value) {
  return value ? String(value).slice(0, 10) : ''
}

// Format dates for display
export function formatDate(value) {
  if (!value) return 'Not specified'

  return new Date(
    dateOnly(value) + 'T00:00:00'
  ).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Calculate remaining days
export function daysUntilExpiry(value) {
  if (!value) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiry = new Date(dateOnly(value) + 'T00:00:00')

  return Math.round((expiry - today) / 86400000)
}

// Determine document status
export function getStatus(doc) {
  const days = daysUntilExpiry(doc.expiry_date)

  if (days === null) return 'No expiry set'
  if (days < 0) return 'Expired'
  if (days <= 30) return 'Expiring soon'

  return 'Not expired'
}

// Filter documents
export function matchesFilter(doc, filter) {
  switch (filter) {
    case 'expiring':
      return getStatus(doc) === 'Expiring soon'

    case 'expired':
      return getStatus(doc) === 'Expired'

    case 'attached':
      return Boolean(doc.file_path)

    default:
      return true
  }
}

// Reusable Tailwind and DaisyUI styles
export const buttonBase =
  'btn rounded-full normal-case font-semibold gap-2 transition-all duration-300 hover:-translate-y-0.5 shadow-md'

export const goldButton =
  `${buttonBase} border-white/40 bg-gradient-to-br from-[#F5F0E9] via-[#E0C58F] to-[#E0C58F] text-[#112250] hover:shadow-xl`

export const blueButton =
  `${buttonBase} border-white/20 bg-gradient-to-br from-[#3C507D] to-[#112250] text-[#F5F0E9] hover:shadow-xl`

export const glassPanel =
  'rounded-3xl border border-white/60 backdrop-blur-xl shadow-lg'

export const inputStyle =
  'input input-bordered w-full rounded-xl bg-white/60 text-[#112250] border-[#D9CBC2]'

export const selectStyle =
  'select select-bordered w-full rounded-xl bg-white/60 text-[#112250] border-[#D9CBC2]'