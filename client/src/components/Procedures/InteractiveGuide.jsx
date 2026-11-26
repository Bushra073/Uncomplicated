import { useState } from 'react'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  RotateCcw,
  Files,
  Compass,
  Sparkles,
  BookOpen,
  Flag,
  PartyPopper,
} from 'lucide-react'

import { getCategoryTheme } from './categoryThemes'

export default function InteractiveGuide({
  procedure,
  steps = [],
}) {
  const theme = getCategoryTheme(procedure.category_id)

  const [activeIndex, setActiveIndex] = useState(0)
  const [completed, setCompleted] = useState([])

  const orderedSteps = [...steps].sort(
    (a, b) => a.step_number - b.step_number
  )

  const totalSteps = orderedSteps.length

  const currentStep = orderedSteps[activeIndex]

  const completedCount = orderedSteps.filter(
    step => completed.includes(step.step_id)
  ).length

  const percentage = totalSteps
    ? Math.round((completedCount / totalSteps) * 100)
    : 0

  const allCompleted =
    totalSteps > 0 && completedCount === totalSteps

  function goToStep(index) {
    if (index >= 0 && index < totalSteps) {
      setActiveIndex(index)
    }
  }

  function completeStep() {
    if (!currentStep) return

    setCompleted(previous =>
      previous.includes(currentStep.step_id)
        ? previous
        : [...previous, currentStep.step_id]
    )

    if (activeIndex < totalSteps - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }

  function resetJourney() {
    setCompleted([])
    setActiveIndex(0)
  }

  if (!totalSteps) {
    return (
      <div className="rounded-3xl border border-white/60 bg-white/40 p-6 text-center">
        No application steps have been added yet.
      </div>
    )
  }

  return (
    <section
      className="rounded-[2rem] border border-white/70 bg-white/40 p-5 shadow-lg backdrop-blur-xl md:p-7"
      style={{ color: theme.colors.dark }}
    >

      {/* Section heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-4">

          <div
            className="rounded-2xl p-3 shadow-md"
            style={{
              backgroundColor: theme.colors.dark,
              color: theme.colors.accent,
            }}
          >
            <Compass size={27} />
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] opacity-60">
              YOUR GUIDED EXPERIENCE
            </p>

            <h2 className="mt-1 font-serif text-3xl">
              Let's find your way.
            </h2>

            <p className="mt-1 text-sm opacity-70">
              Understand one step before moving to the next.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={resetJourney}
          className="btn btn-sm rounded-full border-white/70 bg-white/50 normal-case"
          style={{ color: theme.colors.dark }}
        >
          <RotateCcw size={15} />
          Restart journey
        </button>

      </div>

      {/* Journey progress */}
      <div
        className="mt-6 rounded-3xl border border-white/60 p-5"
        style={{
          background: `linear-gradient(
            135deg,
            ${theme.colors.background},
            ${theme.colors.secondary}
          )`,
        }}
      >

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs font-medium opacity-60">
              GUIDE EXPLORATION
            </p>

            <p className="mt-1 font-serif text-2xl">
              {completedCount} of {totalSteps} steps reviewed
            </p>
          </div>

          <span className="font-serif text-3xl">
            {percentage}%
          </span>

        </div>

        <div
          role="progressbar"
          aria-label="Guide exploration progress"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-4 h-3 overflow-hidden rounded-full bg-white/60"
        >

          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(
                90deg,
                ${theme.colors.dark},
                ${theme.colors.primary}
              )`,
            }}
          />

        </div>

        {/* Clickable milestones */}
        <div className="mt-5 flex flex-wrap items-center gap-2">

          {orderedSteps.map((step, index) => {
            const isCompleted = completed.includes(step.step_id)
            const isActive = index === activeIndex

            return (
              <button
                type="button"
                key={step.step_id}
                title={step.step_title}
                aria-label={`Step ${step.step_number}: ${step.step_title}`}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => goToStep(index)}
                className="flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold shadow-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: isActive
                    ? theme.colors.dark
                    : isCompleted
                      ? theme.colors.accent
                      : '#ffffff80',

                  color: isActive
                    ? '#ffffff'
                    : theme.colors.dark,

                  borderColor: isActive
                    ? theme.colors.dark
                    : theme.colors.primary,

                  outline: isActive
                    ? `3px solid ${theme.colors.accent}`
                    : 'none',
                }}
              >
                {isCompleted
                  ? <Check size={18} />
                  : String(step.step_number).padStart(2, '0')}
              </button>
            )
          })}

          <Flag size={19} className="ml-2 opacity-50" />

        </div>

      </div>

      {/* Completion celebration */}
      {allCompleted && (
        <div
          className="mt-6 flex flex-wrap items-center gap-5 rounded-3xl border border-white/50 p-6 shadow-md"
          style={{
            backgroundColor: theme.colors.accent,
            color: theme.colors.dark,
          }}
        >

          <PartyPopper
            size={42}
            className="motion-safe:animate-bounce"
          />

          <div className="flex-1">
            <h3 className="font-serif text-2xl">
              Look how far you've come!
            </h3>

            <p className="mt-2 text-sm leading-relaxed">
              You've reviewed every step in this guide.
              You're now more familiar with the application
              process and what you need to prepare.
            </p>

            <p className="mt-2 text-xs">
              Reviewing the guide does not mean your actual
              application has been completed.
            </p>
          </div>

        </div>
      )}

      {/* Current step */}
      <div
        key={currentStep.step_id}
        className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/60 p-6 shadow-md md:p-8"
      >

        {/* Decorative background */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: theme.colors.accent }}
        />

        <div className="relative">

          <div className="flex items-center justify-between gap-3">

            <span
              className="rounded-full px-4 py-2 text-[10px] font-semibold tracking-widest"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.dark,
              }}
            >
              STEP {activeIndex + 1} OF {totalSteps}
            </span>

            {completed.includes(currentStep.step_id) && (
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <CheckCircle2 size={17} />
                Reviewed
              </span>
            )}

          </div>

          {/* Step number and title */}
          <div className="mt-6 flex items-center gap-4">

            <span
              className="font-serif text-5xl md:text-6xl"
              style={{ color: theme.colors.primary }}
            >
              {String(currentStep.step_number).padStart(2, '0')}
            </span>

            <h3 className="font-serif text-2xl leading-tight md:text-3xl">
              {currentStep.step_title}
            </h3>

          </div>

          <div className="my-6 border-t border-current/10" />

          {/* Complete original written instructions */}
          <div>

            <div className="mb-3 flex items-center gap-2">

              <BookOpen size={18} />

              <h4 className="text-xs font-semibold tracking-widest">
                WHAT YOU NEED TO DO
              </h4>

            </div>

            <p className="whitespace-pre-wrap break-words text-sm leading-loose md:text-base">
              {currentStep.instructions ||
                'Instructions have not been added yet.'}
            </p>

          </div>

          {/* Documents required for this step */}
          {currentStep.required_documents && (
            <div
              className="mt-6 rounded-2xl border p-5"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.secondary,
              }}
            >

              <div className="flex items-center gap-3">

                <div
                  className="rounded-xl p-2.5"
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.accent,
                  }}
                >
                  <Files size={21} />
                </div>

                <h4 className="font-semibold">
                  Documents needed for this step
                </h4>

              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
                {currentStep.required_documents}
              </p>

            </div>
          )}

          {/* Interactive reflection */}
          <div
            className="mt-6 flex items-start gap-3 rounded-2xl border border-white/60 p-4"
            style={{
              backgroundColor: theme.colors.secondary,
            }}
          >

            <Sparkles size={21} className="shrink-0" />

            <div>
              <h4 className="text-sm font-semibold">
                Before moving forward...
              </h4>

              <p className="mt-1 text-xs leading-relaxed">
                Do you understand what needs to be done in
                this step? Take your time. You can revisit
                any milestone whenever you need to.
              </p>
            </div>

          </div>

          {/* Navigation controls */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">

            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => goToStep(activeIndex - 1)}
              className="btn rounded-full border-white/70 bg-white/60 normal-case shadow-sm"
              style={{ color: theme.colors.dark }}
            >
              <ArrowLeft size={17} />
              Previous
            </button>

            <div className="flex flex-wrap gap-2">

              {activeIndex < totalSteps - 1 && (
                <button
                  type="button"
                  onClick={() => goToStep(activeIndex + 1)}
                  className="btn btn-ghost rounded-full normal-case"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              )}

              <button
                type="button"
                onClick={completeStep}
                disabled={
                  activeIndex === totalSteps - 1 &&
                  completed.includes(currentStep.step_id)
                }
                className="btn rounded-full border-white/30 normal-case text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(
                    135deg,
                    ${theme.colors.primary},
                    ${theme.colors.dark}
                  )`,
                }}
              >

                <Check size={18} />

                {activeIndex === totalSteps - 1
                  ? 'Mark final step as reviewed'
                  : 'Understood, continue'}

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Journey map */}
      <div className="mt-8">

        <h3 className="font-serif text-2xl">
          Your journey at a glance
        </h3>

        <p className="mt-1 text-xs opacity-60">
          Select any milestone to revisit its instructions.
        </p>

        <div className="mt-5 space-y-2">

          {orderedSteps.map((step, index) => {
            const isActive = activeIndex === index
            const isCompleted = completed.includes(step.step_id)

            return (
              <button
                type="button"
                key={step.step_id}
                onClick={() => goToStep(index)}
                className="group flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all duration-300 hover:translate-x-1"
                style={{
                  backgroundColor: isActive
                    ? theme.colors.secondary
                    : '#ffffff50',

                  borderColor: isActive
                    ? theme.colors.primary
                    : '#ffffff90',
                }}
              >

                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold"
                  style={{
                    backgroundColor: isCompleted
                      ? theme.colors.accent
                      : theme.colors.dark,

                    color: isCompleted
                      ? theme.colors.dark
                      : '#ffffff',
                  }}
                >
                  {isCompleted
                    ? <Check size={17} />
                    : String(step.step_number).padStart(2, '0')}
                </div>

                <span className="flex-1 text-sm font-medium">
                  {step.step_title}
                </span>

                {isActive && (
                  <span className="text-[10px] font-semibold">
                    CURRENT
                  </span>
                )}

                <ArrowRight
                  size={16}
                  className="opacity-50 transition-transform group-hover:translate-x-1"
                />

              </button>
            )
          })}

        </div>

      </div>

      <p className="mt-5 text-xs leading-relaxed opacity-60">
        This interactive journey helps you understand the guide.
        Use Start / Resume Procedure to save and track your
        actual application progress.
      </p>

    </section>
  )
}