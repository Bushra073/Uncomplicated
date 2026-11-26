import {
  ArrowUpRight,
  ArrowRight,
  Fingerprint,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Sparkles,
  Scale,
  FileCheck,
  BriefcaseBusiness,
  TrendingUp,
  House,
  KeyRound,
  Lightbulb,
  Check,
} from 'lucide-react'

import { getCategoryTheme } from './categoryThemes'

const floatingPanel =
  'absolute rounded-2xl border border-white/30 bg-white/15 shadow-xl backdrop-blur-xl transition-all duration-700'

function CategoryArtwork({ categoryId, theme }) {
  switch (Number(categoryId)) {

    // Government & Identity
    case 1:
      return (
        <div className="relative h-40 w-52">

          <div className={`${floatingPanel} left-3 top-2 h-32 w-24 -rotate-12 p-4 group-hover:-rotate-[20deg]`}>
            <ShieldCheck size={24} />
            <p className="mt-4 text-[9px] tracking-widest">
              PASSPORT
            </p>
            <div className="mt-2 h-1 w-12 rounded-full bg-white/30" />
          </div>

          <div className={`${floatingPanel} bottom-0 right-0 h-24 w-40 rotate-6 p-4 group-hover:rotate-12 group-hover:translate-x-2`}>

            <div className="flex justify-between">
              <Fingerprint
                size={30}
                style={{ color: theme.colors.accent }}
              />
              <span className="text-[9px] tracking-widest">
                IDENTITY
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="h-1 w-20 rounded-full bg-white/40" />
              <div className="h-1 w-12 rounded-full bg-white/20" />
            </div>

          </div>
        </div>
      )

    // Education
    case 2:
      return (
        <div className="relative h-40 w-52">

          <div className="absolute left-8 top-2 h-32 w-32 rounded-full border border-white/20 transition-transform duration-700 group-hover:scale-110" />

          <div className="absolute left-12 top-6 h-24 w-24 rounded-full border border-dashed border-white/30" />

          <div className={`${floatingPanel} left-12 top-6 flex h-24 w-24 -rotate-12 items-center justify-center group-hover:rotate-0 group-hover:-translate-y-2`}>
            <GraduationCap
              size={54}
              strokeWidth={1.2}
              style={{ color: theme.colors.accent }}
            />
          </div>

          <div className={`${floatingPanel} bottom-0 right-0 rotate-6 p-3 group-hover:translate-x-2`}>
            <BookOpen size={25} />
          </div>

          <Sparkles
            size={25}
            className="absolute right-2 top-1 animate-pulse"
            style={{ color: theme.colors.accent }}
          />

          <span className="absolute bottom-0 left-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] tracking-widest">
            DREAM BIG
          </span>

        </div>
      )

    // Legal & Administrative
    case 3:
      return (
        <div className="relative h-40 w-52">

          <div className={`${floatingPanel} left-4 top-0 h-32 w-28 -rotate-12 p-4 group-hover:-rotate-[20deg]`}>
            <Scale
              size={34}
              strokeWidth={1.3}
              style={{ color: theme.colors.accent }}
            />
          </div>

          <div className={`${floatingPanel} bottom-0 right-6 h-36 w-28 rotate-6 p-4 group-hover:rotate-12`}>

            <FileCheck size={27} />

            <div className="mt-4 space-y-3">
              <div className="h-1 w-full rounded-full bg-white/40" />
              <div className="h-1 w-3/4 rounded-full bg-white/30" />
              <div className="h-1 w-full rounded-full bg-white/20" />
            </div>

            <div
              className="absolute -bottom-2 -right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.dark,
              }}
            >
              <Check size={22} />
            </div>

          </div>

        </div>
      )

    // Business & Employment
    case 4:
      return (
        <div className="relative h-40 w-52">

          <div className={`${floatingPanel} bottom-0 left-0 h-32 w-40 p-4`}>

            <div className="flex items-center justify-between">
              <TrendingUp
                size={22}
                style={{ color: theme.colors.accent }}
              />
              <span className="text-[9px] tracking-widest">
                GROWTH
              </span>
            </div>

            <div className="mt-3 flex h-16 items-end gap-2">

              {[25, 45, 35, 70, 95].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 origin-bottom rounded-t-md transition-transform duration-500 group-hover:scale-y-110"
                  style={{
                    height: `${height}%`,
                    backgroundColor: theme.colors.accent,
                    opacity: 0.35 + index * 0.15,
                    transitionDelay: `${index * 60}ms`,
                  }}
                />
              ))}

            </div>

          </div>

          <div className={`${floatingPanel} right-0 top-0 rotate-12 p-4 group-hover:-translate-y-2 group-hover:rotate-0`}>
            <BriefcaseBusiness size={30} />
          </div>

        </div>
      )

    // Personal & Household
    case 5:
      return (
        <div className="relative h-40 w-52">

          <div className={`${floatingPanel} left-8 top-4 flex h-28 w-28 -rotate-6 items-center justify-center group-hover:-translate-y-2`}>

            <House
              size={58}
              strokeWidth={1.2}
              style={{ color: theme.colors.accent }}
            />

          </div>

          <div className={`${floatingPanel} right-0 top-0 rotate-12 p-3 group-hover:rotate-[25deg]`}>
            <Lightbulb size={25} />
          </div>

          <div className={`${floatingPanel} bottom-0 left-0 -rotate-12 p-3 group-hover:-translate-x-2`}>
            <KeyRound size={25} />
          </div>

          <span className="absolute bottom-0 right-0 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[9px] tracking-widest">
            LIFE, SORTED
          </span>

        </div>
      )

    default:
      return null
  }
}

export default function CategoryCard({
  category,
  selected = false,
  onSelect,
}) {
  const theme = getCategoryTheme(category.category_id)
  const Icon = theme.icon

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(category.category_id)}
      className={`
        group relative isolate flex min-h-[290px]
        w-full flex-col overflow-hidden rounded-[2rem]
        border border-white/30 bg-gradient-to-br
        p-6 text-left text-white shadow-lg
        transition-all duration-500
        hover:-translate-y-1 hover:shadow-2xl
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-4
        ${theme.gradient}
        ${selected ? 'ring-2 ring-offset-4' : ''}
      `}
      style={{
        '--tw-ring-color': theme.colors.accent,
        outlineColor: theme.colors.primary,
      }}
    >

      {/* Surface texture */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#ffffff40_1px,transparent_1px)] bg-[length:7px_7px]" />

      {/* Ambient lighting */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
        style={{ backgroundColor: theme.colors.accent }}
      />

      {/* Card header */}
      <div className="relative flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-lg">
            <Icon
              size={21}
              style={{ color: theme.colors.accent }}
            />
          </div>

          <span className="text-[10px] tracking-[0.2em] text-white/80">
            {theme.mood}
          </span>

        </div>

        <span className="font-serif text-2xl text-white/60">
          {theme.number}
        </span>

      </div>

      {/* Unique category artwork */}
      <div className="relative flex flex-1 items-center justify-center py-4">

        <CategoryArtwork
          categoryId={category.category_id}
          theme={theme}
        />

      </div>

      {/* Category information */}
      <div className="relative">

        <h2 className="font-serif text-2xl leading-tight lg:text-3xl">
          {category.category_name}
        </h2>

        <p
          className="mt-2 text-sm font-medium"
          style={{ color: theme.colors.accent }}
        >
          {theme.tagline}
        </p>

        <p className="mt-3 text-xs leading-relaxed text-white/80">
          {category.description}
        </p>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/20 pt-4">

          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] backdrop-blur-lg">
            {category.procedure_count ?? 0} procedures
          </span>

          <div
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.dark,
            }}
          >

            {selected ? 'Selected' : 'Explore'}

            {selected
              ? <ArrowRight size={15} />
              : <ArrowUpRight size={15} />
            }

          </div>

        </div>

      </div>

    </button>
  )
}