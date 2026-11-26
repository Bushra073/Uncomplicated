import {
  BookOpen,
  UserCheck,
  Files,
  Wallet,
  ListChecks,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react'

import { getCategoryTheme } from './categoryThemes'

const sections = [
  { id: 'overview', title: 'Overview', icon: BookOpen },
  { id: 'eligibility', title: 'Eligibility', icon: UserCheck },
  { id: 'requirements', title: 'Required documents', icon: Files },
  { id: 'fees', title: 'Fees and processing time', icon: Wallet },
  { id: 'steps', title: 'Application steps', icon: ListChecks },
  { id: 'resources', title: 'Official resources', icon: ExternalLink },
]

const paragraphStyle =
  'whitespace-pre-wrap break-words text-sm leading-loose opacity-85'

const itemStyle =
  'rounded-2xl border border-white/70 bg-white/50 p-4 shadow-sm'

const requirementStyles = {
  mandatory: 'bg-red-100 text-red-800',
  conditional: 'bg-amber-100 text-amber-800',
  optional: 'bg-blue-100 text-blue-800',
}

// Reusable section layout
function GuideSection({ section, number, theme, children }) {
  const Icon = section.icon

  return (
    <section
      id={`written-${section.id}`}
      className="scroll-mt-24 rounded-3xl border border-white/70 bg-white/40 p-5 shadow-sm backdrop-blur-xl md:p-7"
    >
      <div className="mb-5 flex items-center gap-3">

        <div
          className="rounded-xl p-3 shadow-sm"
          style={{
            backgroundColor: theme.colors.dark,
            color: theme.colors.accent,
          }}
        >
          <Icon size={22} />
        </div>

        <div className="flex-1">
          <p className="text-[10px] font-semibold tracking-widest opacity-50">
            SECTION {String(number).padStart(2, '0')}
          </p>

          <h2 className="mt-1 font-serif text-2xl">
            {section.title}
          </h2>
        </div>

      </div>

      {children}
    </section>
  )
}

export default function WrittenGuide({
  procedure,
  requirements = [],
  steps = [],
  resources = [],
}) {
  const theme = getCategoryTheme(procedure.category_id)

  const orderedSteps = [...steps].sort(
    (a, b) => a.step_number - b.step_number
  )

  function scrollToSection(id) {
    document
      .getElementById(`written-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]"
      style={{ color: theme.colors.dark }}
    >

      {/* Table of contents */}
      <aside className="rounded-3xl border border-white/70 bg-white/40 p-4 shadow-sm backdrop-blur-xl lg:sticky lg:top-6">

        <div className="mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          <h3 className="font-serif text-xl">
            In this guide
          </h3>
        </div>

        <nav
          aria-label="Guide contents"
          className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1"
        >
          {sections.map((section, index) => {
            const Icon = section.icon

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className="group flex items-center gap-3 rounded-xl p-3 text-left text-xs font-medium transition-all duration-300 hover:translate-x-1 hover:bg-white/80"
              >
                <span
                  className="font-serif text-sm"
                  style={{ color: theme.colors.primary }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <Icon size={16} className="shrink-0" />

                <span>{section.title}</span>
              </button>
            )
          })}
        </nav>

        <div
          className="mt-5 rounded-2xl p-4"
          style={{
            backgroundColor: theme.colors.secondary,
          }}
        >
          <p className="font-serif text-lg">
            At your own pace.
          </p>

          <p className="mt-2 text-xs leading-relaxed opacity-75">
            Jump between sections whenever you need to.
            Everything you need to read is right here.
          </p>
        </div>

      </aside>

      {/* Complete written guide */}
      <div className="min-w-0 space-y-5">

        {/* 01 — Overview */}
        <GuideSection
          section={sections[0]}
          number={1}
          theme={theme}
        >
          <p className={paragraphStyle}>
            {procedure.overview ||
              procedure.description ||
              'Overview not available yet.'}
          </p>
        </GuideSection>

        {/* 02 — Eligibility */}
        <GuideSection
          section={sections[1]}
          number={2}
          theme={theme}
        >
          <p className={paragraphStyle}>
            {procedure.eligibility ||
              'Eligibility information not available yet.'}
          </p>
        </GuideSection>

        {/* 03 — Required documents */}
        <GuideSection
          section={sections[2]}
          number={3}
          theme={theme}
        >
          <p className="mb-4 text-sm opacity-70">
            Review which documents apply to your situation.
          </p>

          <div className="space-y-3">
            {requirements.map(item => (
              <article
                key={item.requirement_id}
                className={itemStyle}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">

                  <h3 className="font-semibold">
                    {item.requirement_name}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-medium capitalize ${
                      requirementStyles[item.requirement_type] ||
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.requirement_type}
                  </span>

                </div>

                <p className={paragraphStyle}>
                  {item.description}
                </p>

                {item.notes && (
                  <div
                    className="mt-3 rounded-xl p-3"
                    style={{
                      backgroundColor: theme.colors.background,
                    }}
                  >
                    <p className="mb-1 text-xs font-semibold">
                      Additional note
                    </p>

                    <p className="whitespace-pre-wrap text-xs leading-relaxed">
                      {item.notes}
                    </p>
                  </div>
                )}
              </article>
            ))}

            {!requirements.length && (
              <p className={paragraphStyle}>
                No document requirements have been added yet.
              </p>
            )}
          </div>
        </GuideSection>

        {/* 04 — Fees and processing time */}
        <GuideSection
          section={sections[3]}
          number={4}
          theme={theme}
        >
          <div className="grid gap-4 xl:grid-cols-2">

            <div className={itemStyle}>
              <Wallet
                size={24}
                style={{ color: theme.colors.primary }}
              />

              <h3 className="my-3 font-serif text-xl">
                Application fees
              </h3>

              <p className={paragraphStyle}>
                {procedure.fees_information ||
                  'Fee information not available yet.'}
              </p>
            </div>

            <div className={itemStyle}>
              <ListChecks
                size={24}
                style={{ color: theme.colors.primary }}
              />

              <h3 className="my-3 font-serif text-xl">
                Processing time
              </h3>

              <p className={paragraphStyle}>
                {procedure.processing_time ||
                  'Processing time not available yet.'}
              </p>
            </div>

          </div>

          <p className="mt-4 text-xs leading-relaxed opacity-60">
            Confirm current fees and timelines through the
            official portal before applying.
          </p>
        </GuideSection>

        {/* 05 — Application steps */}
        <GuideSection
          section={sections[4]}
          number={5}
          theme={theme}
        >
          <p className="mb-5 text-sm opacity-70">
            Follow these steps in order.
          </p>

          <div className="space-y-5">
            {orderedSteps.map((step, index) => (
              <article
                key={step.step_id}
                className="relative flex items-start gap-4"
              >

                {/* Timeline connector */}
                {index < orderedSteps.length - 1 && (
                  <div
                    className="absolute bottom-[-20px] left-5 top-10 w-px"
                    style={{
                      backgroundColor: theme.colors.primary,
                      opacity: 0.3,
                    }}
                  />
                )}

                <span
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-serif text-lg shadow-sm"
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.accent,
                  }}
                >
                  {String(step.step_number).padStart(2, '0')}
                </span>

                <div className={`${itemStyle} min-w-0 flex-1`}>

                  <h3 className="mb-3 font-serif text-xl">
                    {step.step_title}
                  </h3>

                  <p className={paragraphStyle}>
                    {step.instructions}
                  </p>

                  {step.required_documents && (
                    <div
                      className="mt-4 rounded-xl p-4"
                      style={{
                        backgroundColor: theme.colors.background,
                      }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Files size={17} />

                        <strong className="text-xs">
                          Documents needed
                        </strong>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {step.required_documents}
                      </p>
                    </div>
                  )}

                </div>

              </article>
            ))}

            {!orderedSteps.length && (
              <p className={paragraphStyle}>
                No application steps have been added yet.
              </p>
            )}
          </div>
        </GuideSection>

        {/* 06 — Official resources */}
        <GuideSection
          section={sections[5]}
          number={6}
          theme={theme}
        >
          <div className="grid gap-3 sm:grid-cols-2">

            {resources.map(resource => (
              <a
                key={resource.resource_id}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className={`${itemStyle} group transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-3">

                  <div
                    className="rounded-xl p-2.5"
                    style={{
                      backgroundColor: theme.colors.secondary,
                    }}
                  >
                    <ExternalLink size={20} />
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  />

                </div>

                <h3 className="mt-4 font-semibold">
                  {resource.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed opacity-75">
                  {resource.description}
                </p>

                {resource.resource_type && (
                  <span className="mt-3 inline-block text-[10px] font-medium capitalize opacity-60">
                    {resource.resource_type}
                  </span>
                )}
              </a>
            ))}

          </div>

          {!resources.length && (
            <p className={paragraphStyle}>
              No resources have been added yet.
            </p>
          )}

          {procedure.official_link && (
            <a
              href={procedure.official_link}
              target="_blank"
              rel="noreferrer"
              className="btn mt-5 rounded-full border-0 normal-case text-white shadow-md"
              style={{
                backgroundColor: theme.colors.dark,
              }}
            >
              Visit official portal
              <ArrowUpRight size={17} />
            </a>
          )}
        </GuideSection>

      </div>
    </div>
  )
}