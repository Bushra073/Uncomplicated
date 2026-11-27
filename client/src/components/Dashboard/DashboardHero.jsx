import { Link } from 'react-router-dom'
import {
  Compass,
  FolderOpen,
  Bookmark,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

function DashboardHero({
  user,
  documents = [],
  procedures = [],
  resources = [],
}) {
  const completed = procedures.filter(
    p => p.status === 'completed'
  ).length

  // Determine where My procedures should navigate
  const myProceduresRoute =
    procedures.length === 0
      ? '/procedures'
      : procedures.length === 1
        ? `/my-procedures/${procedures[0].user_procedure_id}`
        : '/dashboard#my-procedures'

  function handleShortcutClick(event, item) {
    if (
      item.label === 'My procedures' &&
      procedures.length > 1
    ) {
      event.preventDefault()

      document.getElementById('my-procedures')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const stats = [
    {
      label: 'My procedures',
      count: procedures.length,
      detail: `${completed} completed`,
      icon: Compass,
      route: myProceduresRoute,
      style: 'from-[#F9E4D9] to-[#EBC2AD]',
    },
    {
      label: 'My documents',
      count: documents.length,
      detail: 'Personal Document Hub',
      icon: FolderOpen,
      route: '/documents',
      style: 'from-[#EDF4D9] to-[#C7DDA1]',
    },
    {
      label: 'Saved resources',
      count: resources.length,
      detail: 'Knowledge Shelf',
      icon: Bookmark,
      route: '/knowledge',
      style: 'from-[#F0E8FA] to-[#CDBCE9]',
    },
  ]

  return (
    <section className="space-y-5">

      {/* Welcome panel */}
      <div className="relative isolate overflow-hidden rounded-[32px]
        bg-gradient-to-br from-[#245C57] via-[#16443F] to-[#102F2D]
        p-7 text-white shadow-xl md:p-10">

        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-16 -top-24
          h-80 w-80 rounded-full border border-white/10
          bg-white/5" />

        <div className="pointer-events-none absolute right-12 top-12
          h-48 w-48 rounded-full bg-[#C9E879]/10 blur-3xl" />

        <div className="relative z-10 max-w-xl">

          <div className="mb-5 inline-flex items-center gap-2
            rounded-full border border-white/20 bg-white/10
            px-4 py-2 text-xs tracking-widest backdrop-blur-md">

            <Sparkles size={14} className="text-[#DDF478]" />
            YOUR PERSONAL WORKSPACE
          </div>

          <h1 className="text-3xl font-medium tracking-tight md:text-5xl">
            Welcome, {user?.full_name?.split(' ')[0] || 'there'}.
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            A little less chaos, a little more clarity.
            Everything you're working towards, together in one place.
          </p>

          <Link
            to="/procedures"
            className="mt-6 inline-flex items-center gap-3
              rounded-full bg-[#DDF478] px-5 py-3 text-sm
              font-semibold text-[#16443F] shadow-lg
              transition-all hover:-translate-y-1 hover:bg-[#E9FFA4]"
          >
            Explore procedures
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Floating illustration */}
        <div className="procedure-float absolute right-12 top-1/2
          hidden -translate-y-1/2 lg:block">

          <div className="relative flex h-40 w-40 items-center
            justify-center rounded-[40px] border border-white/30
            bg-white/10 shadow-2xl backdrop-blur-xl">

            <Compass size={76} strokeWidth={1} className="text-[#DDF478]" />

            <div className="absolute -bottom-3 -right-4 rounded-2xl
              border border-white/30 bg-white/20 p-4
              shadow-lg backdrop-blur-xl">
              <CheckCircle2 size={27} />
            </div>
          </div>
        </div>
      </div>

      {/* Workspace shortcuts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {stats.map(item => {
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              to={item.route}
              onClick={event => handleShortcutClick(event, item)}
              className={`group relative overflow-hidden rounded-[26px]
                border border-white/80 bg-gradient-to-br ${item.style}
                p-5 text-[#193D39] shadow-md transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="absolute -bottom-12 -right-10 h-36 w-36
                rounded-full border border-white/40 bg-white/20" />

              <div className="relative flex items-center justify-between">
                <div className="rounded-2xl border border-white/70
                  bg-white/40 p-3 shadow-sm backdrop-blur-md">
                  <Icon size={23} strokeWidth={1.7} />
                </div>

                <ArrowUpRight
                  size={19}
                  className="transition-transform group-hover:-translate-y-1
                    group-hover:translate-x-1"
                />
              </div>

              <div className="relative mt-5">
                <p className="text-sm font-medium">{item.label}</p>

                <h2 className="mt-1 text-4xl font-semibold tracking-tight">
                  {item.count}
                </h2>

                <p className="mt-2 text-xs opacity-60">
                  {item.detail}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default DashboardHero