const templates = [
  {
    keywords: ['passport'],
    items: [
      'Application fee',
      'Document photocopies',
      'Transportation',
    ],
  },
  {
    keywords: ['nid', 'national identity'],
    items: [
      'Correction fee',
      'Supporting documents',
      'Photocopies',
      'Transportation',
    ],
  },
  {
    keywords: ['birth registration', 'birth certificate'],
    items: [
      'Correction fee',
      'Supporting documents',
      'Transportation',
    ],
  },
  {
    keywords: ['master', 'study abroad', 'scholarship'],
    items: [
      'University application fees',
      'English proficiency test',
      'Document attestation',
      'Visa application',
      'Flight ticket',
      'Initial accommodation',
    ],
  },
  {
    keywords: ['ielts'],
    items: [
      'IELTS registration fee',
      'Preparation materials',
      'Mock tests',
      'Transportation',
    ],
  },
  {
    keywords: ['transcript'],
    items: [
      'Transcript collection fee',
      'Additional copies',
      'Attestation',
      'Courier charges',
    ],
  },
  {
    keywords: ['police clearance'],
    items: [
      'Application fee',
      'Document attestation',
      'Photocopies',
      'Transportation',
    ],
  },
  {
    keywords: ['tin', 'tax identification'],
    items: [
      'Applicable official fees',
      'Printing expenses',
      'Professional assistance (optional)',
    ],
  },
  {
    keywords: ['general diary', '(gd)'],
    items: [
      'Supporting document expenses',
      'Printing expenses',
      'Transportation',
    ],
  },
  {
    keywords: ['trade license', 'trade licence'],
    items: [
      'Licence fee',
      'Applicable taxes',
      'Supporting documents',
      'Renewal expenses',
    ],
  },
  {
    keywords: ['job application'],
    items: [
      'CV preparation',
      'Printing expenses',
      'Interview transportation',
      'Professional clothing',
    ],
  },
  {
    keywords: ['business registration'],
    items: [
      'Name clearance fee',
      'Registration fee',
      'Applicable stamp duties',
      'Professional assistance (optional)',
    ],
  },
  {
    keywords: ['electricity connection'],
    items: [
      'Application fee',
      'Security deposit',
      'Wiring and installation',
      'Electrical materials',
    ],
  },
  {
    keywords: ['driving licence', 'driving license'],
    items: [
      'Learner licence fee',
      'Driving licence fee',
      'Medical certificate',
      'Driving lessons',
      'Transportation',
    ],
  },
  {
    keywords: ['electricity bill', 'bill complaint'],
    items: [
      'Supporting document expenses',
      'Printing expenses',
      'Transportation',
    ],
  },
]

export function getExpenseTemplate(title) {
  const normalized = String(title || '').toLowerCase()

  const match = templates.find(template =>
    template.keywords.some(keyword =>
      normalized.includes(keyword)
    )
  )

  return match?.items || [
    'Applicable application fee',
    'Document preparation',
    'Transportation',
  ]
}