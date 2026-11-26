import { Link } from 'react-router-dom'

import {
  ArrowUpRight,
  ArrowRight,
  Clock3,
  BookOpen,
  Fingerprint,
  GraduationCap,
  Scale,
  BriefcaseBusiness,
  House,
  Compass,
  FileText,
  Sparkles,
  MapPin,
} from 'lucide-react'

import { getCategoryTheme } from './categoryThemes'

const categoryIcons = {
  1: Fingerprint,
  2: GraduationCap,
  3: Scale,
  4: BriefcaseBusiness,
  5: House,
}

export default function ProcedureCard({
  procedure,
  categoryId,
  index = 0,
}) {
  const id = categoryId || procedure.category_id
  const theme = getCategoryTheme(id)
  const Icon = categoryIcons[id] || Compass

  return (
    <Link
      to={`/procedures/${procedure.procedure_id}`}
      className="group relative isolate flex h-full min-h-[280px] flex-col overflow-hidden rounded-[1.75rem] border p-6 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{
        background: `linear-gradient(
          145deg,
          ${theme.colors.background},
          ${theme.colors.secondary}
        )`,
        borderColor: theme.colors.secondary,
        color: theme.colors.dark,
        outlineColor: theme.colors.primary,
      }}
    >

      {/* Surface texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(
            ${theme.colors.primary} 1px,
            transparent 1px
          )`,
          backgroundSize: '8px 8px',
        }}
      />

      {/* Ambient lighting */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl transition-all duration-700 group-hover:scale-150"
        style={{
          backgroundColor: theme.colors.accent,
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between">

        <span className="text-[10px] font-semibold tracking-[0.2em] opacity-60">
          GUIDE {String(index + 1).padStart(2, '0')}
        </span>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/40 backdrop-blur-xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
        >
          <ArrowUpRight size={20} />
        </div>

      </div>

      {/* Animated miniature artwork */}
      <div className="relative my-5 flex h-24 items-center">

        <div
          className="absolute left-5 top-1 flex h-20 w-16 -rotate-12 items-center justify-center rounded-2xl border border-white/60 bg-white/40 shadow-md backdrop-blur-lg transition-all duration-500 group-hover:-rotate-[20deg] group-hover:-translate-x-2"
        >
          <FileText size={27} strokeWidth={1.3} />
        </div>

        <div
          className="absolute left-14 top-3 flex h-20 w-20 rotate-6 items-center justify-center rounded-2xl border border-white/30 shadow-lg transition-all duration-500 group-hover:rotate-12 group-hover:-translate-y-2"
          style={{
            background: `linear-gradient(
              135deg,
              ${theme.colors.primary},
              ${theme.colors.dark}
            )`,
            color: theme.colors.accent,
          }}
        >
          <Icon size={36} strokeWidth={1.4} />
        </div>

        <Sparkles
          size={20}
          className="absolute left-36 top-0 opacity-60 transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-100"
        />

        <div className="absolute right-0 bottom-0 hidden items-center gap-1 text-[10px] tracking-widest opacity-50 sm:flex">
          <MapPin size={13} />
          BANGLADESH
        </div>

      </div>

      {/* Procedure information */}
      <div className="relative">

        <h3 className="font-serif text-2xl leading-tight transition-transform duration-300 group-hover:translate-x-1">
          {procedure.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed opacity-75">
          {procedure.description ||
            'Explore the requirements, instructions and resources for this procedure.'}
        </p>

      </div>

      {/* Quick information */}
      <div className="relative mt-5 flex flex-wrap gap-2">

        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-[11px] backdrop-blur-md">
          <BookOpen size={13} />
          Step-by-step guide
        </span>

        {procedure.estimated_duration && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-[11px] backdrop-blur-md">
            <Clock3 size={13} />
            {procedure.estimated_duration}
          </span>
        )}

      </div>

      {/* Bottom action */}
      <div className="relative mt-auto pt-6">

        <div className="flex items-center justify-between gap-3 border-t border-current/10 pt-4">

          <span className="text-xs font-medium opacity-60">
            Discover your next step
          </span>

          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2.5 text-xs font-semibold shadow-md transition-all duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(
                135deg,
                ${theme.colors.primary},
                ${theme.colors.dark}
              )`,
              color: '#ffffff',
            }}
          >
            Explore guide

            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />

          </span>

        </div>

      </div>

    </Link>
  )
}