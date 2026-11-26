import { useState } from 'react'

import {
  Check,
  CheckCircle2,
  Circle,
  ChevronDown,
  Files,
  Route,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'

import { Link } from 'react-router-dom'
import { getCategoryTheme } from '../Procedures/categoryThemes'

export default function TrackerRoadmap({
  tracker,
  categoryId,
  onToggleStep,
  updatingStepId,
}) {
  const theme = getCategoryTheme(categoryId)

  const steps = [...(tracker.steps || [])].sort(
    (a, b) => a.step_number - b.step_number
  )

  const nextStep = steps.find(
    step => !Boolean(step.is_completed)
  )

  const [expanded, setExpanded] = useState(
    nextStep?.step_id || steps[0]?.step_id || null
  )

  const [filter, setFilter] = useState('all')

  const completed = steps.filter(
    step => Boolean(step.is_completed)
  ).length

  const filteredSteps = steps.filter(step => {
    if (filter === 'completed') {
      return Boolean(step.is_completed)
    }

    if (filter === 'pending') {
      return !Boolean(step.is_completed)
    }

    return true
  })

  const filters = [
    {
      id: 'all',
      label: 'All tasks',
      count: steps.length,
    },
    {
      id: 'pending',
      label: 'Pending',
      count: steps.length - completed,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: completed,
    },
  ]

  function toggleExpanded(stepId) {
    setExpanded(previous =>
      previous === stepId ? null : stepId
    )
  }

  async function handleComplete(step) {
    const success = await onToggleStep(step)

    if (success === false) return

    if (!Boolean(step.is_completed)) {
      const next = steps.find(
        item =>
          item.step_id !== step.step_id &&
          !Boolean(item.is_completed)
      )

      setExpanded(next?.step_id || null)
    }
  }

  return (
    <section
      className="rounded-[2rem] border border-white/70 bg-white/40 p-5 shadow-lg backdrop-blur-xl md:p-7"
      style={{ color: theme.colors.dark }}
    >

      {/* Heading */}
      <div className="flex items-center gap-4">

        <div
          className="rounded-2xl p-3 shadow-md"
          style={{
            backgroundColor: theme.colors.dark,
            color: theme.colors.accent,
          }}
        >
          <Route size={28} />
        </div>

        <div>
          <p className="text-[10px] font-semibold tracking-widest opacity-60">
            YOUR APPLICATION ROADMAP
          </p>

          <h2 className="mt-1 font-serif text-3xl">
            One step closer.
          </h2>

          <p className="mt-1 text-xs opacity-70">
            Explore your tasks and mark them as you go.
          </p>
        </div>

      </div>

      {/* Clickable milestone map */}
      <div
        className="mt-6 rounded-3xl border border-white/70 p-5"
        style={{
          backgroundColor: theme.colors.secondary,
        }}
      >

        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-xl">
            Your milestones
          </h3>

          <span className="text-xs font-medium opacity-70">
            {completed}/{steps.length} completed
          </span>
        </div>

        <div className="mt-5 flex items-center overflow-x-auto pb-3">

          {steps.map((step, index) => {
            const done = Boolean(step.is_completed)
            const selected = expanded === step.step_id

            return (
              <div
                key={step.step_id}
                className="flex shrink-0 items-center"
              >

                <button
                  type="button"
                  title={step.step_title}
                  aria-label={`Open step ${step.step_number}: ${step.step_title}`}
                  aria-pressed={selected}
                  onClick={() => {
                    setFilter('all')
                    setExpanded(step.step_id)
                  }}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-serif text-lg shadow-sm transition-all duration-300 hover:scale-110 ${
                    selected
                      ? 'ring-4 ring-white/80'
                      : ''
                  }`}
                  style={{
                    backgroundColor: done
                      ? theme.colors.dark
                      : '#ffffff80',

                    color: done
                      ? theme.colors.accent
                      : theme.colors.dark,

                    borderColor: selected || done
                      ? theme.colors.dark
                      : '#ffffff',
                  }}
                >
                  {done
                    ? <Check size={22} />
                    : step.step_number}
                </button>

                {index < steps.length - 1 && (
                  <div
                    className="h-1 w-7 rounded-full sm:w-10"
                    style={{
                      backgroundColor:
                        done &&
                        Boolean(steps[index + 1].is_completed)
                          ? theme.colors.dark
                          : '#ffffff80',
                    }}
                  />
                )}

              </div>
            )
          })}

        </div>

        <p className="mt-2 text-xs opacity-65">
          Select any milestone to view its instructions.
        </p>

      </div>

      {/* Task filters */}
      <div className="my-6 flex flex-wrap gap-2">

        {filters.map(item => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className="flex items-center gap-2 rounded-full border border-white/70 px-4 py-2.5 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor:
                filter === item.id
                  ? theme.colors.dark
                  : '#ffffff80',

              color:
                filter === item.id
                  ? theme.colors.accent
                  : theme.colors.dark,
            }}
          >
            {item.label}

            <span className="rounded-full bg-white/20 px-2 py-0.5">
              {item.count}
            </span>
          </button>
        ))}

      </div>

      {/* Application tasks */}
      <div className="space-y-4">

        {filteredSteps.map(step => {
          const done = Boolean(step.is_completed)
          const isOpen = expanded === step.step_id
          const isNext = nextStep?.step_id === step.step_id
          const updating = updatingStepId === step.step_id

          return (
            <article
              key={step.step_id}
              className="overflow-hidden rounded-3xl border bg-white/50 shadow-sm transition-all duration-300"
              style={{
                borderColor: isNext
                  ? theme.colors.primary
                  : '#ffffff',
              }}
            >

              {/* Task header */}
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleExpanded(step.step_id)}
                className="flex w-full items-center gap-4 p-4 text-left md:p-5"
              >

                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-serif text-xl shadow-sm"
                  style={{
                    backgroundColor: done
                      ? theme.colors.dark
                      : theme.colors.secondary,

                    color: done
                      ? theme.colors.accent
                      : theme.colors.dark,
                  }}
                >
                  {done
                    ? <CheckCircle2 size={25} />
                    : String(step.step_number).padStart(2, '0')}
                </div>

                <div className="min-w-0 flex-1">

                  <div className="mb-1 flex flex-wrap items-center gap-2">

                    <span className="text-[10px] font-semibold tracking-widest opacity-50">
                      STEP {step.step_number}
                    </span>

                    {isNext && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
                        style={{
                          backgroundColor: theme.colors.accent,
                          color: theme.colors.dark,
                        }}
                      >
                        <Sparkles size={12} />
                        Up next
                      </span>
                    )}

                  </div>

                  <h3 className="font-serif text-lg md:text-xl">
                    {step.step_title}
                  </h3>

                  <p className="mt-1 text-xs opacity-60">
                    {done ? 'Completed' : 'Not completed'}
                  </p>

                </div>

                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />

              </button>

              {/* Expandable task instructions */}
              {isOpen && (
                <div className="border-t border-white/80 p-5">

                  <p className="mb-3 text-[10px] font-semibold tracking-widest opacity-60">
                    WHAT YOU NEED TO DO
                  </p>

                  <p className="whitespace-pre-wrap text-sm leading-loose">
                    {step.instructions ||
                      'No additional instructions available.'}
                  </p>

                  {/* Required documents */}
                  {step.required_documents && (
                    <div
                      className="mt-5 rounded-2xl p-4"
                      style={{
                        backgroundColor: theme.colors.background,
                      }}
                    >

                      <div className="flex items-center gap-2">
                        <Files size={20} />

                        <h4 className="font-semibold">
                          Documents needed
                        </h4>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed opacity-80">
                        {step.required_documents}
                      </p>

                      <Link
                        to="/documents"
                        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold hover:underline"
                        style={{
                          color: theme.colors.primary,
                        }}
                      >
                        Open Document Hub
                        <ArrowUpRight size={15} />
                      </Link>

                    </div>
                  )}

                  {/* Actual completion control */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

                    <p className="text-xs opacity-60">
                      {done
                        ? 'This task is marked as complete.'
                        : 'Mark complete after finishing this task.'}
                    </p>

                    <button
                      type="button"
                      disabled={updatingStepId != null}
                      onClick={() => handleComplete(step)}
                      className="btn rounded-full border-0 normal-case shadow-md transition-all hover:-translate-y-0.5"
                      style={{
                        backgroundColor: done
                          ? theme.colors.secondary
                          : theme.colors.dark,

                        color: done
                          ? theme.colors.dark
                          : '#ffffff',
                      }}
                    >

                      {updating ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : done ? (
                        <Circle size={18} />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}

                      {updating
                        ? 'Saving...'
                        : done
                          ? 'Mark incomplete'
                          : 'Mark as complete'}

                    </button>

                  </div>

                </div>
              )}

            </article>
          )
        })}

        {/* Empty filter state */}
        {!filteredSteps.length && (
          <div className="rounded-3xl border border-dashed border-current/20 p-8 text-center">

            <CheckCircle2
              size={35}
              className="mx-auto opacity-40"
            />

            <h3 className="mt-4 font-serif text-xl">
              {filter === 'pending'
                ? 'No pending tasks'
                : filter === 'completed'
                  ? 'No completed tasks yet'
                  : 'No tasks available'}
            </h3>

            <p className="mt-2 text-sm opacity-60">
              {filter === 'pending'
                ? 'You have no unfinished tasks in this roadmap.'
                : filter === 'completed'
                  ? 'Your completed milestones will appear here.'
                  : 'Application steps have not been added yet.'}
            </p>

          </div>
        )}

      </div>

    </section>
  )
}