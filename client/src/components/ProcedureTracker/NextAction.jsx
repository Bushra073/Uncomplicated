import {
  Target,
  ArrowRight,
  Files,
  Trophy,
  Sparkles,
  Clock3,
} from 'lucide-react'

import { getCategoryTheme } from '../Procedures/categoryThemes'

export default function NextAction({
  tracker,
  categoryId,
  onFocusStep,
}) {
  const theme = getCategoryTheme(categoryId)

  const steps = [...(tracker.steps || [])].sort(
    (a, b) => a.step_number - b.step_number
  )

  const nextStep = steps.find(
    step => !Boolean(step.is_completed)
  )

  const completed = steps.filter(
    step => Boolean(step.is_completed)
  ).length

  const finished =
    steps.length > 0 && completed === steps.length

  const Icon = finished ? Trophy : Target

  return (
    <section
      className="relative isolate overflow-hidden rounded-[2rem] border border-white/70 p-6 shadow-lg"
      style={{
        background: `linear-gradient(
          145deg,
          ${theme.colors.secondary},
          ${theme.colors.background}
        )`,
        color: theme.colors.dark,
      }}
    >

      {/* Decorative background */}
      <Icon
        size={180}
        strokeWidth={0.6}
        className="pointer-events-none absolute -bottom-10 -right-10 -z-10 rotate-12 opacity-10"
      />

      <div className="flex items-center gap-3">

        <div
          className="rounded-2xl p-3 shadow-md"
          style={{
            backgroundColor: theme.colors.dark,
            color: theme.colors.accent,
          }}
        >
          <Icon size={25} />
        </div>

        <div>
          <p className="text-[10px] font-semibold tracking-widest opacity-60">
            PERSONALIZED GUIDANCE
          </p>

          <h2 className="mt-1 font-serif text-2xl">
            {finished ? 'Milestone reached.' : 'Your next move.'}
          </h2>
        </div>

      </div>

      {/* Next unfinished task */}
      {nextStep && (
        <div className="mt-5">

          <div className="rounded-2xl border border-white/80 bg-white/50 p-4 backdrop-blur-xl">

            <div className="flex items-center gap-2">

              <span
                className="rounded-full px-3 py-1 text-[10px] font-semibold"
                style={{
                  backgroundColor: theme.colors.dark,
                  color: theme.colors.accent,
                }}
              >
                STEP {nextStep.step_number}
              </span>

              <span className="flex items-center gap-1 text-xs opacity-60">
                <Clock3 size={13} />
                Pending
              </span>

            </div>

            <h3 className="mt-4 font-serif text-xl">
              {nextStep.step_title}
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed opacity-75">
              {nextStep.instructions}
            </p>

            {nextStep.required_documents && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/60 p-3">

                <Files size={18} className="shrink-0" />

                <p className="text-xs">
                  This task requires document preparation.
                </p>

              </div>
            )}

            <button
              type="button"
              onClick={() => onFocusStep(nextStep.step_id)}
              className="btn mt-5 w-full rounded-full border-0 normal-case text-white shadow-md transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: theme.colors.dark,
              }}
            >
              Continue this task
              <ArrowRight size={18} />
            </button>

          </div>

          <div className="mt-5 flex items-start gap-2">

            <Sparkles
              size={18}
              className="mt-0.5 shrink-0"
              style={{ color: theme.colors.primary }}
            />

            <p className="text-xs leading-relaxed opacity-70">
              Focus on one task at a time.
              You don't have to figure everything out at once.
            </p>

          </div>

        </div>
      )}

      {/* Completed procedure */}
      {finished && (
        <div className="mt-6 text-center">

          <Trophy
            size={60}
            className="procedure-float mx-auto"
            style={{ color: theme.colors.primary }}
          />

          <h3 className="mt-5 font-serif text-3xl">
            You did it!
          </h3>

          <p className="mt-3 text-sm leading-relaxed opacity-75">
            You've completed all {steps.length} tracked tasks.
            Your application roadmap is complete.
          </p>

          <div
            className="mt-5 rounded-full px-4 py-3 text-sm font-semibold"
            style={{
              backgroundColor: theme.colors.accent,
            }}
          >
            All milestones completed
          </div>

        </div>
      )}

      {/* Empty procedure */}
      {!steps.length && (
        <p className="mt-5 text-sm opacity-70">
          No application tasks are available yet.
        </p>
      )}

      {/* Mini progress indicator */}
      {steps.length > 0 && (
        <div className="mt-6 border-t border-current/10 pt-5">

          <div className="flex items-center justify-between text-xs">

            <span className="opacity-70">
              Your journey so far
            </span>

            <strong>
              {completed}/{steps.length}
            </strong>

          </div>

          <div className="mt-3 flex gap-1.5">

            {steps.map(step => (
              <div
                key={step.step_id}
                title={step.step_title}
                className="h-2 flex-1 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: Boolean(step.is_completed)
                    ? theme.colors.dark
                    : '#ffffff90',
                }}
              />
            ))}

          </div>

        </div>
      )}

    </section>
  )
}