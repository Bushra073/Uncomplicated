import {
  CheckCircle2,
  CircleDashed,
  ListChecks,
  Clock3,
  Sparkles,
  Trophy,
} from 'lucide-react'

import { getCategoryTheme } from '../Procedures/categoryThemes'

export default function TrackerHero({ tracker, categoryId }) {
  const theme = getCategoryTheme(categoryId)
  const CategoryIcon = theme.icon

  const steps = tracker.steps || []

  const completed = steps.filter(
    step => Boolean(step.is_completed)
  ).length

  const total = steps.length
  const remaining = total - completed

  const percentage = total
    ? Math.round((completed / total) * 100)
    : 0

  const finished = total > 0 && completed === total

  const radius = 76
  const circumference = 2 * Math.PI * radius

  const stats = [
    {
      label: 'Total tasks',
      value: total,
      icon: ListChecks,
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
    },
    {
      label: 'Remaining',
      value: remaining,
      icon: CircleDashed,
    },
    {
      label: 'Your status',
      value: finished
        ? 'Completed'
        : completed > 0
          ? 'In progress'
          : 'Not started',
      icon: Clock3,
    },
  ]

  return (
    <section
      className="relative isolate overflow-hidden rounded-[2.5rem] p-6 text-white shadow-xl md:p-9"
      style={{
        background: `linear-gradient(
          135deg,
          ${theme.colors.dark},
          ${theme.colors.primary}
        )`,
      }}
    >

      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_center,#ffffff40_1px,transparent_1px)] bg-[length:9px_9px]" />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full opacity-20 blur-[80px]"
        style={{ backgroundColor: theme.colors.accent }}
      />

      {/* Decorative category icon */}
      <CategoryIcon
        size={260}
        strokeWidth={0.6}
        className="pointer-events-none absolute -bottom-20 -left-12 -z-10 rotate-12 opacity-10"
      />

      <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">

        {/* Application information */}
        <div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl">

            <CategoryIcon
              size={17}
              style={{ color: theme.colors.accent }}
            />

            <span className="text-[10px] font-semibold tracking-widest">
              YOUR PERSONAL TRACKER
            </span>

          </div>

          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            {tracker.title}
          </h1>

          <p
            className="mt-4 font-serif text-xl"
            style={{ color: theme.colors.accent }}
          >
            {finished
              ? 'Look how far you have come.'
              : 'Small steps. Meaningful progress.'}
          </p>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">
            {finished
              ? 'You have completed every tracked task in this procedure.'
              : 'Stay organized, complete your tasks and move closer to your goal at your own pace.'}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">

            {finished
              ? <Trophy size={18} />
              : <Sparkles size={18} />}

            <span className="text-xs">
              {finished
                ? 'All milestones reached'
                : `${remaining} ${remaining === 1 ? 'task' : 'tasks'} left to complete`}
            </span>

          </div>

        </div>

        {/* Circular progress */}
        <div className="relative mx-auto flex w-full max-w-[250px] items-center justify-center">

          <div className="absolute inset-0 rounded-full border border-white/10" />

          <svg
            viewBox="0 0 200 200"
            className="w-full -rotate-90"
            role="img"
            aria-label={`${percentage}% of tasks completed`}
          >

            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="11"
            />

            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference -
                (percentage / 100) * circumference
              }
              className="transition-all duration-700 ease-out"
            />

          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            {finished && (
              <Trophy
                size={26}
                className="mb-2 procedure-float"
                style={{ color: theme.colors.accent }}
              />
            )}

            <strong
              className="font-serif text-5xl"
              style={{ color: theme.colors.accent }}
            >
              {percentage}%
            </strong>

            <span className="mt-2 text-xs tracking-widest text-white/70">
              COMPLETED
            </span>

          </div>

        </div>

      </div>

      {/* Progress statistics */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

        {stats.map(item => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="group rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
            >

              <Icon
                size={21}
                style={{ color: theme.colors.accent }}
              />

              <p className="mt-4 text-xs text-white/70">
                {item.label}
              </p>

              <p className="mt-1 font-serif text-2xl">
                {item.value}
              </p>

            </div>
          )
        })}

      </div>

      {/* Completion celebration */}
      {finished && (
        <div
          className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl p-5 shadow-lg"
          style={{
            backgroundColor: theme.colors.accent,
            color: theme.colors.dark,
          }}
        >

          <Trophy
            size={38}
            className="procedure-float shrink-0"
          />

          <div className="flex-1">
            <h2 className="font-serif text-2xl">
              You made it!
            </h2>

            <p className="mt-1 text-sm opacity-80">
              Every tracked task is complete.
              Take a moment to celebrate your progress.
            </p>
          </div>

          <Sparkles size={26} />

        </div>
      )}

    </section>
  )
}