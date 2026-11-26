const question = (id, text, yes, no) => ({
  id,
  text,
  yes,
  no,
})

const questionBank = [
  {
    keywords: ['passport'],
    questions: [
      question(
        'existing',
        'Do you already have a Bangladesh passport?',
        'Keep your existing passport available for the re-issue process.',
        'Check whether you need a first-time passport application instead.'
      ),
      question(
        'changes',
        'Do you need to change any personal information?',
        'Review the supporting documents required for information corrections.',
        'Review the requirements for a standard passport re-issue.'
      ),
      question(
        'lost',
        'Has your previous passport been lost or stolen?',
        'Check the official lost-passport procedure and additional requirements.',
        'Keep your existing passport ready for submission or inspection.'
      ),
    ],
  },

  {
    keywords: ['nid', 'national identity'],
    questions: [
      question(
        'existing',
        'Do you already have a National Identity Card?',
        'Keep your current NID information available.',
        'Check the new voter registration process instead.'
      ),
      question(
        'proof',
        'Do you have supporting documents for the requested correction?',
        'Compare the information across your supporting documents.',
        'Identify and collect acceptable supporting evidence.'
      ),
    ],
  },

  {
    keywords: ['birth registration', 'birth certificate'],
    questions: [
      question(
        'existing',
        'Do you already have a birth registration record?',
        'Keep your registration number and existing certificate ready.',
        'Check whether a new registration is required instead.'
      ),
      question(
        'proof',
        'Do you have documents supporting the correction?',
        'Review whether your evidence meets the official requirements.',
        'Collect the necessary supporting documents before applying.'
      ),
    ],
  },

  {
    keywords: ['study abroad', 'master', 'scholarship'],
    questions: [
      question(
        'degree',
        'Have you completed your undergraduate degree?',
        'Prepare your degree certificate and academic transcripts.',
        'Look for programmes accepting final-year applicants.'
      ),
      question(
        'english',
        'Do you have valid English language proficiency evidence?',
        'Check whether your target universities accept your evidence.',
        'Check the language requirements and plan any necessary tests.'
      ),
      question(
        'shortlist',
        'Have you shortlisted universities or scholarships?',
        'Compare their eligibility criteria and application deadlines.',
        'Begin by researching programmes matching your academic background.'
      ),
      question(
        'references',
        'Have you identified potential academic referees?',
        'Contact your referees early and discuss application deadlines.',
        'Identify teachers or supervisors who can provide recommendations.'
      ),
    ],
  },

  {
    keywords: ['ielts'],
    questions: [
      question(
        'purpose',
        'Are you taking IELTS for higher education?',
        'Check whether your institution requires IELTS Academic.',
        'Confirm which IELTS test type your destination requires.'
      ),
      question(
        'identity',
        'Do you have an acceptable identity document?',
        'Confirm that it meets the test provider’s requirements.',
        'Check the accepted identity documents before booking.'
      ),
    ],
  },

  {
    keywords: ['transcript'],
    questions: [
      question(
        'graduated',
        'Have you completed your degree?',
        'Check your institution’s final transcript collection process.',
        'Ask whether an interim or current academic transcript is available.'
      ),
      question(
        'records',
        'Do you have your student ID and academic records?',
        'Keep these ready when contacting your institution.',
        'Collect your student identification and academic details.'
      ),
    ],
  },

  {
    keywords: ['police clearance'],
    questions: [
      question(
        'passport',
        'Do you have a valid passport?',
        'Keep your passport details available.',
        'Check the official identity and passport requirements.'
      ),
      question(
        'address',
        'Do you have supporting address information?',
        'Compare your address information across relevant documents.',
        'Check what address evidence is required.'
      ),
    ],
  },

  {
    keywords: ['tin', 'tax identification'],
    questions: [
      question(
        'registered',
        'Do you already have a TIN?',
        'Check whether you need account recovery or information updates instead.',
        'Review the official registration process.'
      ),
      question(
        'identity',
        'Do you have your applicable identity documents?',
        'Keep your identification details ready.',
        'Check the identity requirements for your taxpayer category.'
      ),
    ],
  },

  {
    keywords: ['general diary', '(gd)'],
    questions: [
      question(
        'urgent',
        'Is there an immediate threat to your safety?',
        'Seek immediate assistance through emergency services rather than relying on an online GD.',
        'Review the appropriate reporting procedure.'
      ),
      question(
        'details',
        'Have you collected the relevant incident details?',
        'Organize the dates, locations and supporting evidence.',
        'Write down the relevant facts and collect available evidence.'
      ),
    ],
  },

  {
    keywords: ['trade license', 'trade licence'],
    questions: [
      question(
        'location',
        'Have you identified your business location?',
        'Identify the licensing authority responsible for that location.',
        'Determine your business location and applicable licensing authority.'
      ),
      question(
        'premises',
        'Do you have supporting business premises documents?',
        'Check whether these meet your local authority’s requirements.',
        'Find out which premises documents your authority requires.'
      ),
    ],
  },

  {
    keywords: ['job application'],
    questions: [
      question(
        'cv',
        'Do you have an updated CV?',
        'Tailor your CV to the requirements of the position.',
        'Prepare a CV highlighting your education, skills and experience.'
      ),
      question(
        'target',
        'Have you identified a specific job to apply for?',
        'Review the job description and application deadline.',
        'Shortlist suitable positions based on your interests and qualifications.'
      ),
      question(
        'portfolio',
        'Do you have relevant work samples or projects?',
        'Select the most relevant examples for your application.',
        'Consider preparing work samples if they are relevant to your field.'
      ),
    ],
  },

  {
    keywords: ['business registration'],
    questions: [
      question(
        'structure',
        'Have you decided on your business structure?',
        'Review the registration requirements for that structure.',
        'Compare suitable business structures before registering.'
      ),
      question(
        'name',
        'Have you selected a proposed business name?',
        'Check whether name clearance is applicable.',
        'Prepare potential names and check the naming requirements.'
      ),
    ],
  },

  {
    keywords: ['electricity connection'],
    questions: [
      question(
        'provider',
        'Do you know which electricity provider serves your property?',
        'Review that provider’s connection requirements.',
        'Identify the electricity distribution company serving your area.'
      ),
      question(
        'property',
        'Do you have relevant property or occupancy documents?',
        'Check which documents your provider accepts.',
        'Collect the applicable property or occupancy evidence.'
      ),
    ],
  },

  {
    keywords: ['driving licence', 'driving license'],
    questions: [
      question(
        'learner',
        'Do you already have a learner driving licence?',
        'Review the next applicable licensing and testing steps.',
        'Check the learner licence application requirements.'
      ),
      question(
        'medical',
        'Have you reviewed the applicable medical requirements?',
        'Prepare the medical documentation required by the authority.',
        'Check the official medical and fitness requirements.'
      ),
    ],
  },

  {
    keywords: ['electricity bill', 'bill complaint'],
    questions: [
      question(
        'bill',
        'Do you have a copy of the disputed electricity bill?',
        'Keep the bill and account details available.',
        'Retrieve a copy of the bill from your provider.'
      ),
      question(
        'evidence',
        'Do you have previous bills or meter readings for comparison?',
        'Organize the evidence to explain the discrepancy.',
        'Collect available billing records and meter readings safely.'
      ),
    ],
  },
]

export function getEligibilityQuestions(title) {
  const normalizedTitle = String(title || '').toLowerCase()

  const match = questionBank.find(item =>
    item.keywords.some(keyword =>
      normalizedTitle.includes(keyword)
    )
  )

  return match?.questions || [
    question(
      'requirements',
      'Have you reviewed the official eligibility requirements?',
      'Compare the requirements with your circumstances.',
      'Read the eligibility guidelines before proceeding.'
    ),
    question(
      'documents',
      'Have you prepared the applicable supporting documents?',
      'Review your documents for accuracy and completeness.',
      'Use the document checklist to identify what you need.'
    ),
  ]
}