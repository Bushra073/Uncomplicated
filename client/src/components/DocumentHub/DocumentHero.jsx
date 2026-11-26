import {
  Plus,
  Files,
  Clock,
  Paperclip,
  AlertCircle,
  Fingerprint,
  ShieldCheck,
  FileText,
  ArrowUpRight,
} from 'lucide-react'

import {
  matchesFilter,
  goldButton,
} from './documentUtils'

export default function DocumentHero({
  documents = [],
  onAdd,
  onFilter,
  activeFilter = 'all',
}) {
  const stats = [
    {
      label: 'Total documents',
      filter: 'all',
      icon: Files,
      style: 'bg-gradient-to-br from-[#3C507D] to-[#112250] text-[#F5F0E9]',
    },
    {
      label: 'Expiring soon',
      filter: 'expiring',
      icon: Clock,
      style: 'bg-gradient-to-br from-[#F5F0E9] to-[#E0C58F]',
    },
    {
      label: 'Attached files',
      filter: 'attached',
      icon: Paperclip,
      style: 'bg-gradient-to-br from-[#3C507D] to-[#112250] text-[#F5F0E9]',
    },
    {
      label: 'Expired',
      filter: 'expired',
      icon: AlertCircle,
      style: 'bg-gradient-to-br from-[#F5F0E9] to-[#D9CBC2]',
    },
  ]

  return (
    <div className="space-y-5">

      {/* Main hero */}
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#112250] via-[#3C507D] to-[#112250] text-[#F5F0E9] shadow-xl">

        {/* Background lighting and texture */}
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#E0C58F]/20 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#ffffff30_1px,transparent_1px)] bg-[length:8px_8px]" />

        <div className="relative grid items-center gap-8 p-8 md:grid-cols-2 md:p-10">

          {/* Hero content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl">
              <ShieldCheck
                size={15}
                className="text-[#E0C58F]"
              />

              <span className="text-[10px] uppercase tracking-[0.2em]">
                Your personal archive
              </span>
            </div>

            <h1 className="mt-5 font-serif text-4xl leading-tight lg:text-6xl">
              Everything
              <br />
              <em className="text-[#E0C58F]">
                in its place.
              </em>
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              A little less searching, a little more certainty.
              Keep life's important documents together.
            </p>

            <button
              type="button"
              onClick={onAdd}
              disabled={!onAdd}
              className={`${goldButton} mt-6 px-6`}
            >
              <Plus size={19} />
              Add document
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Floating document wallet */}
          <div className="relative flex h-64 items-center justify-center">

            <div className="document-float relative h-52 w-64">

              {/* Back document */}
              <div className="absolute left-6 top-0 h-36 w-48 -rotate-12 rounded-2xl bg-gradient-to-br from-[#F5F0E9] to-[#D9CBC2] p-5 text-[#112250] shadow-xl">

                <FileText size={25} />

                <div className="mt-4 space-y-2">
                  <div className="h-1 w-24 rounded-full bg-[#3C507D]/30" />
                  <div className="h-1 w-16 rounded-full bg-[#3C507D]/20" />
                </div>

              </div>

              {/* Identity card */}
              <div className="absolute right-1 top-2 h-32 w-44 rotate-12 rounded-2xl bg-gradient-to-br from-[#E0C58F] to-[#D9CBC2] p-5 text-[#112250] shadow-xl">

                <Fingerprint size={30} />

                <p className="mt-3 text-[10px] tracking-widest">
                  PERSONAL IDENTITY
                </p>

              </div>

              {/* Front glass wallet */}
              <div className="absolute bottom-0 h-36 w-full rounded-3xl border border-white/30 bg-gradient-to-br from-white/25 to-white/5 p-5 shadow-2xl backdrop-blur-xl">

                <div className="flex items-center justify-between">

                  <span className="text-[10px] tracking-[0.2em]">
                    UNCOMPLICATED
                  </span>

                  <ShieldCheck
                    size={23}
                    className="text-[#E0C58F]"
                  />

                </div>

                <p className="mt-4 font-serif text-2xl">
                  My documents
                </p>

                <div className="mt-3 flex justify-between text-xs text-white/60">
                  <span>PERSONAL COLLECTION</span>
                  <span>{documents.length} ITEMS</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Interactive statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {stats.map(({ label, filter, icon: Icon, style }) => {

          const count = documents.filter(doc =>
            matchesFilter(doc, filter)
          ).length

          const selected = activeFilter === filter

          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilter?.(filter)}
              disabled={!onFilter}
              aria-pressed={selected}
              className={`
                group relative overflow-hidden
                rounded-2xl border border-white/40
                p-5 text-left shadow-md
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
                ${style}
                ${selected
                  ? 'ring-2 ring-[#E0C58F] ring-offset-4'
                  : ''}
              `}
            >

              <div className="flex items-center justify-between">

                <span className="text-xs font-medium opacity-80">
                  {label}
                </span>

                <div className="rounded-xl border border-white/20 bg-white/20 p-2 backdrop-blur-md">
                  <Icon size={19} />
                </div>

              </div>

              <p className="mt-2 font-serif text-4xl">
                {String(count).padStart(2, '0')}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs opacity-70">

                <span>
                  {selected ? 'Selected' : 'View documents'}
                </span>

                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />

              </div>

            </button>
          )
        })}

      </div>

    </div>
  )
}