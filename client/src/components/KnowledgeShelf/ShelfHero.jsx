import {
  Bookmark,
  FolderOpen,
  Heart,
  Plus,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react'

export default function ShelfHero({
  resources = [],
  collections = [],
  onAdd,
  onFilter,
}) {
  const favourites = resources.filter(
    item => Boolean(item.is_favourite)
  ).length

  const stats = [
    {
      label: 'Saved resources',
      value: resources.length,
      icon: Bookmark,
      filter: 'all',
    },
    {
      label: 'Collections',
      value: collections.length,
      icon: FolderOpen,
      filter: 'collections',
    },
    {
      label: 'Favourites',
      value: favourites,
      icon: Heart,
      filter: 'favourites',
    },
  ]

  return (
    <section className="relative isolate overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#29263D] via-[#494064] to-[#7768AE] p-6 text-[#F5EBDD] shadow-xl md:p-9">

      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,#ffffff40_1px,transparent_1px)] bg-[length:9px_9px] opacity-20" />

      <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-[#E9B8A8] opacity-20 blur-[100px]" />

      <div className="grid items-center gap-6 md:grid-cols-[1.5fr_1fr]">

        {/* Hero content */}
        <div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl">
            <Sparkles size={15} className="text-[#D9EDAD]" />

            <span className="text-[10px] font-semibold tracking-widest">
              YOUR PERSONAL KNOWLEDGE SHELF
            </span>
          </div>

          <h1 className="font-serif text-5xl leading-tight md:text-6xl">
            Keep what
            <span className="block italic text-[#D9EDAD]">
              matters.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75">
            All those useful articles, reels, tutorials and
            little discoveries — finally, a place to keep
            them together.
          </p>

          <button
            type="button"
            onClick={onAdd}
            className="btn mt-6 rounded-full border-0 bg-gradient-to-br from-[#F5EBDD] to-[#D9EDAD] px-6 normal-case text-[#29263D] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Plus size={20} />
            Save a resource
          </button>

        </div>

        {/* Floating scrapbook artwork */}
        <div className="relative mx-auto hidden h-64 w-full max-w-[300px] md:block">

          <div className="absolute left-10 top-8 h-44 w-36 -rotate-12 rounded-3xl border border-white/30 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
            <BookOpen size={35} className="text-[#E9B8A8]" />

            <div className="mt-5 space-y-2">
              <div className="h-2 w-full rounded-full bg-white/30" />
              <div className="h-2 w-3/4 rounded-full bg-white/20" />
              <div className="h-2 w-1/2 rounded-full bg-white/20" />
            </div>
          </div>

          <div className="procedure-float absolute right-5 top-5 h-48 w-40 rounded-3xl border border-white/40 bg-[#F5EBDD]/90 p-5 text-[#29263D] shadow-2xl backdrop-blur-xl">

            <Bookmark size={30} className="text-[#7768AE]" />

            <p className="mt-5 font-serif text-2xl">
              Worth remembering.
            </p>

            <div className="mt-4 h-2 w-3/4 rounded-full bg-[#7768AE]/30" />
            <div className="mt-2 h-2 w-1/2 rounded-full bg-[#7768AE]/20" />

          </div>

          <div className="absolute bottom-3 left-4 -rotate-6 rounded-2xl border border-white/50 bg-[#E9B8A8] p-4 text-[#29263D] shadow-lg">
            <Heart size={24} />
          </div>

          <div className="absolute -right-2 bottom-5 rotate-12 rounded-2xl bg-[#D9EDAD] p-4 text-[#29263D] shadow-lg">
            <Layers size={25} />
          </div>

        </div>

      </div>

      {/* Interactive statistics */}
      <div className="mt-8 grid grid-cols-3 gap-3">

        {stats.map(item => {
          const Icon = item.icon

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onFilter(item.filter)}
              className="rounded-2xl border border-white/20 bg-white/10 p-3 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 md:p-5"
            >
              <Icon size={21} className="text-[#D9EDAD]" />

              <p className="mt-3 font-serif text-3xl">
                {item.value}
              </p>

              <p className="mt-1 text-xs text-white/70">
                {item.label}
              </p>
            </button>
          )
        })}

      </div>

    </section>
  )
}