import {
  ArrowUpRight,
  ArrowRight,
  Clock3,
  CalendarDays,
  ListChecks,
  Files,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

import { getCategoryTheme } from './categoryThemes'

export default function ProcedureHero({
  procedure,
  steps = [],
  requirements = [],
  token,
  starting,
  onStart,
  onExplore,
  startError,
}) {
  const theme = getCategoryTheme(procedure.category_id)
  const Icon = theme.icon

  const mandatoryCount = requirements.filter(
    item => item.requirement_type === 'mandatory'
  ).length

  return (
    <header
      className={`
        relative isolate overflow-hidden rounded-[2rem]
        border border-white/30 bg-gradient-to-br
        p-6 text-white shadow-xl md:p-10
        ${theme.gradient}
      `}
    >

      {/* Textured surface */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#ffffff40_1px,transparent_1px)] bg-[length:8px_8px]" />

      {/* Ambient lighting */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-20 blur-[80px]"
        style={{ backgroundColor: theme.colors.accent }}
      />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">

        {/* Written information */}
        <div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-xl">

            <Icon
              size={17}
              style={{ color: theme.colors.accent }}
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              {procedure.category_name || 'Procedure guide'}
            </span>

          </div>

          <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
            {procedure.title}
          </h1>

          <p
            className="mt-3 text-sm font-medium"
            style={{ color: theme.colors.accent }}
          >
            {theme.tagline}
          </p>

          <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-white/85">
            {procedure.overview || procedure.description}
          </p>

          {/* Primary actions */}
          <div className="mt-7 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={onStart}
              disabled={starting}
              className="btn rounded-full border-white/30 px-6 normal-case shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.dark,
              }}
            >

              {starting
                ? 'Starting...'
                : token
                  ? 'Start / Resume Procedure'
                  : 'Log in to track progress'}

              <ArrowRight size={17} />

            </button>

            <button
              type="button"
              onClick={onExplore}
              className="btn rounded-full border-white/30 bg-white/10 normal-case text-white backdrop-blur-xl hover:bg-white/20"
            >
              Explore the guide
            </button>

          </div>

          {procedure.official_link && (
            <a
              href={procedure.official_link}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Visit official portal
              <ArrowUpRight size={15} />
            </a>
          )}

          {startError && (
            <p role="alert" className="mt-4 text-sm text-red-200">
              {startError}
            </p>
          )}

        </div>

        {/* Floating visual composition */}
        <div
          aria-hidden="true"
          className="group relative hidden min-h-[270px] items-center justify-center sm:flex"
        >

          <div className="absolute h-56 w-56 rounded-full border border-white/20 transition-transform duration-700 group-hover:scale-110" />

          <div className="absolute h-64 w-64 rounded-full border border-dashed border-white/20 transition-transform duration-700 group-hover:rotate-45" />

          {/* Back document */}
          <div className="absolute left-[12%] top-8 h-40 w-28 -rotate-12 rounded-2xl border border-white/30 bg-white/10 p-4 shadow-xl backdrop-blur-xl transition-all duration-700 group-hover:-rotate-[20deg]">

            <Files size={30} strokeWidth={1.3} />

            <div className="mt-6 space-y-3">
              <div className="h-1 w-full rounded-full bg-white/30" />
              <div className="h-1 w-3/4 rounded-full bg-white/20" />
              <div className="h-1 w-full rounded-full bg-white/20" />
            </div>

          </div>

          {/* Main floating card */}
          <div className="procedure-float relative z-10 flex h-48 w-40 flex-col items-center justify-center rounded-[2rem] border border-white/40 bg-white/15 shadow-2xl backdrop-blur-xl">

            <Icon
              size={65}
              strokeWidth={1.2}
              style={{ color: theme.colors.accent }}
            />

            <span className="mt-5 text-[10px] tracking-[0.2em]">
              YOUR JOURNEY
            </span>

            <span className="mt-2 font-serif text-xl">
              Made clearer.
            </span>

          </div>

          {/* Floating readiness card */}
          <div className="absolute bottom-3 right-0 z-20 rotate-6 rounded-2xl border border-white/30 bg-white/20 p-4 shadow-xl backdrop-blur-xl transition-all duration-500 group-hover:translate-x-2">

            <div className="flex items-center gap-3">

              <ShieldCheck
                size={28}
                style={{ color: theme.colors.accent }}
              />

              <div>
                <p className="text-[10px] tracking-wider text-white/70">
                  YOUR NEXT MOVE
                </p>

                <p className="mt-1 text-xs font-semibold">
                  Prepare. Apply. Track.
                </p>
              </div>

            </div>

          </div>

          <Sparkles
            size={28}
            className="absolute right-8 top-5 motion-safe:animate-pulse"
            style={{ color: theme.colors.accent }}
          />

        </div>

      </div>

      {/* Quick information */}
      <div className="relative mt-8 grid grid-cols-2 gap-3 border-t border-white/20 pt-6 lg:grid-cols-4">

        {[
          {
            icon: ListChecks,
            value: steps.length,
            label: 'Guided steps',
          },
          {
            icon: Files,
            value: mandatoryCount,
            label: 'Mandatory requirements',
          },
          {
            icon: Clock3,
            value:
              procedure.processing_time ||
              procedure.estimated_duration ||
              'Not specified',
            label: 'Estimated time',
          },
          {
            icon: CalendarDays,
            value: procedure.last_reviewed_at
              ? new Date(
                  procedure.last_reviewed_at
                ).toLocaleDateString('en-GB')
              : 'Not specified',
            label: 'Last reviewed',
          },
        ].map(({ icon: InfoIcon, value, label }) => (

          <div
            key={label}
            className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-lg transition-all duration-300 hover:bg-white/20"
          >

            <InfoIcon
              size={20}
              style={{ color: theme.colors.accent }}
            />

            <p className="mt-3 break-words text-sm font-semibold leading-relaxed">
              {value}
            </p>

            <p className="mt-1 text-[11px] text-white/70">
              {label}
            </p>

          </div>

        ))}

      </div>

    </header>
  )
}