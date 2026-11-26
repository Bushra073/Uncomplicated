import { useState } from 'react'

import {
  ClipboardCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  ListChecks,
  ArrowUpRight,
} from 'lucide-react'

import { getCategoryTheme } from './categoryThemes'
import { getEligibilityQuestions } from './eligibilityQuestions'

export default function EligibilityChecker({ procedure }) {
  const theme = getCategoryTheme(procedure.category_id)

  const questions = getEligibilityQuestions(procedure.title)

  const [answers, setAnswers] = useState({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showEligibility, setShowEligibility] = useState(false)

  const currentQuestion = questions[activeIndex]

  const answeredCount = questions.filter(
    item => answers[item.id] !== undefined
  ).length

  const percentage = Math.round(
    (answeredCount / questions.length) * 100
  )

  const answerOptions = [
    { value: 'yes', label: 'Yes', icon: Check },
    { value: 'no', label: 'No', icon: null },
    { value: 'unsure', label: 'Not sure', icon: HelpCircle },
  ]

  function selectAnswer(value) {
    setAnswers(previous => ({
      ...previous,
      [currentQuestion.id]: value,
    }))
  }

  function nextQuestion() {
    if (!answers[currentQuestion.id]) return

    if (activeIndex === questions.length - 1) {
      setFinished(true)
    } else {
      setActiveIndex(previous => previous + 1)
    }
  }

  function restart() {
    setAnswers({})
    setActiveIndex(0)
    setFinished(false)
  }

  function getSuggestion(item) {
    const answer = answers[item.id]

    if (answer === 'yes') return item.yes
    if (answer === 'no') return item.no

    return 'Review the official guidance or contact the relevant authority to clarify this requirement.'
  }

  return (
    <section
      className="rounded-[2rem] border border-white/70 bg-white/40 p-5 shadow-lg backdrop-blur-xl md:p-7"
      style={{ color: theme.colors.dark }}
    >

      {/* Heading */}
      <div className="flex items-start gap-4">

        <div
          className="rounded-2xl p-3 shadow-md"
          style={{
            backgroundColor: theme.colors.dark,
            color: theme.colors.accent,
          }}
        >
          <ClipboardCheck size={26} />
        </div>

        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] opacity-60">
            LET'S FIGURE IT OUT
          </p>

          <h2 className="mt-1 font-serif text-3xl">
            Where do you stand?
          </h2>

          <p className="mt-2 text-sm opacity-70">
            Answer a few questions to discover what you
            should prepare next.
          </p>
        </div>

      </div>

      {/* Progress */}
      <div className="mt-6">

        <div className="mb-2 flex justify-between text-xs">

          <span>
            {answeredCount} of {questions.length} answered
          </span>

          <span>{percentage}%</span>

        </div>

        <div
          role="progressbar"
          aria-label="Questionnaire progress"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 overflow-hidden rounded-full bg-white/70"
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: theme.colors.primary,
            }}
          />
        </div>

      </div>

      {!finished ? (

        /* Question interface */
        <div
          className="relative mt-6 overflow-hidden rounded-3xl border border-white/60 p-6 md:p-8"
          style={{
            background: `linear-gradient(
              135deg,
              ${theme.colors.background},
              ${theme.colors.secondary}
            )`,
          }}
        >

          <HelpCircle
            size={140}
            strokeWidth={0.7}
            className="pointer-events-none absolute -right-8 -top-8 rotate-12 opacity-5"
          />

          <div className="relative">

            <div className="flex items-center justify-between">

              <span className="text-[10px] font-semibold tracking-widest opacity-60">
                QUESTION {activeIndex + 1} OF {questions.length}
              </span>

              <Sparkles size={22} />

            </div>

            <h3 className="mt-5 max-w-xl font-serif text-2xl leading-snug md:text-3xl">
              {currentQuestion.text}
            </h3>

            {/* Answer options */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              {answerOptions.map(option => {
                const selected =
                  answers[currentQuestion.id] === option.value

                const Icon = option.icon

                return (
                  <button
                    type="button"
                    key={option.value}
                    aria-pressed={selected}
                    onClick={() => selectAnswer(option.value)}
                    className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{
                      backgroundColor: selected
                        ? theme.colors.dark
                        : '#ffffff80',

                      color: selected
                        ? '#ffffff'
                        : theme.colors.dark,

                      borderColor: selected
                        ? theme.colors.dark
                        : '#ffffff',
                    }}
                  >
                    {Icon && <Icon size={18} />}
                    {option.label}
                  </button>
                )
              })}

            </div>

            {/* Navigation */}
            <div className="mt-7 flex flex-wrap justify-between gap-3">

              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() =>
                  setActiveIndex(previous => previous - 1)
                }
                className="btn btn-ghost rounded-full normal-case"
              >
                <ArrowLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                disabled={!answers[currentQuestion.id]}
                onClick={nextQuestion}
                className="btn rounded-full border-0 normal-case text-white shadow-md"
                style={{
                  backgroundColor: theme.colors.dark,
                }}
              >
                {activeIndex === questions.length - 1
                  ? 'See my suggestions'
                  : 'Next question'}

                <ArrowRight size={17} />
              </button>

            </div>

          </div>

        </div>

      ) : (

        /* Personalized results */
        <div className="mt-6">

          <div
            className="rounded-3xl border border-white/50 p-6 shadow-md"
            style={{
              backgroundColor: theme.colors.accent,
            }}
          >

            <Sparkles
              size={32}
              className="motion-safe:animate-pulse"
            />

            <h3 className="mt-3 font-serif text-3xl">
              Your next moves.
            </h3>

            <p className="mt-2 text-sm leading-relaxed">
              Based on your answers, here are some things
              to prepare or clarify before proceeding.
            </p>

          </div>

          <div className="mt-5 space-y-3">

            {questions.map((item, index) => (

              <article
                key={item.id}
                className="flex items-start gap-4 rounded-2xl border border-white/70 bg-white/50 p-4 shadow-sm"
              >

                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-serif text-lg"
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.accent,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>

                  <p className="text-xs opacity-60">
                    {item.text}
                  </p>

                  <p className="mt-1 text-xs font-semibold capitalize">
                    Your answer: {
                      answers[item.id] === 'unsure'
                        ? 'Not sure'
                        : answers[item.id]
                    }
                  </p>

                  <p className="mt-2 text-sm leading-relaxed">
                    {getSuggestion(item)}
                  </p>

                </div>

              </article>

            ))}

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={restart}
              className="btn btn-sm rounded-full border-white/70 bg-white/50 normal-case"
              style={{ color: theme.colors.dark }}
            >
              <RotateCcw size={15} />
              Try again
            </button>

            {procedure.official_link && (
              <a
                href={procedure.official_link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm rounded-full border-0 normal-case text-white"
                style={{
                  backgroundColor: theme.colors.dark,
                }}
              >
                Check official requirements
                <ArrowUpRight size={15} />
              </a>
            )}

          </div>

        </div>

      )}

      {/* Preserve original eligibility information */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/70 bg-white/50">

        <button
          type="button"
          aria-expanded={showEligibility}
          onClick={() => setShowEligibility(previous => !previous)}
          className="flex w-full items-center gap-3 p-4 text-left"
        >

          <BookOpen size={21} />

          <span className="flex-1 text-sm font-semibold">
            Read the full eligibility guidelines
          </span>

          <span className="text-xl">
            {showEligibility ? '−' : '+'}
          </span>

        </button>

        {showEligibility && (
          <div className="border-t border-current/10 p-5">

            <p className="whitespace-pre-wrap text-sm leading-loose">
              {procedure.eligibility ||
                'Eligibility information not available yet.'}
            </p>

          </div>
        )}

      </div>

      <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed opacity-65">

        <ListChecks size={17} className="shrink-0" />

        <p>
          This questionnaire provides preparation suggestions,
          not an official eligibility decision. Always confirm
          the applicable requirements with the relevant authority.
        </p>

      </div>

    </section>
  )
}