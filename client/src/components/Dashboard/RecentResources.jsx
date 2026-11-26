
import { Link } from 'react-router-dom'
import {
  Bookmark,
  BookOpen,
  Video,
  Film,
  GraduationCap,
  Globe,
  Link2,
  ArrowUpRight,
  Heart,
} from 'lucide-react'

const resourceIcons = {
  Article: BookOpen,
  Video: Video,
  Reel: Film,
  Tutorial: GraduationCap,
  Website: Globe,
  Other: Link2,
}

function RecentResources({ resources = [] }) {
  const recentResources = [...resources]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return (
    <section className="rounded-[28px] border border-white/80
      bg-gradient-to-br from-[#F6F1FC]/90 to-[#DED4EF]/70
      p-5 shadow-lg backdrop-blur-xl md:p-6">

      {/* Heading */}
      <div className="mb-5 flex items-center gap-3">

        <div className="rounded-2xl border border-white
          bg-white/60 p-3 text-[#7768AE] shadow-sm">
          <Bookmark size={23} />
        </div>

        <div>
          <p className="text-[10px] font-semibold
            tracking-[0.2em] text-[#7768AE]">
            KEEP WHAT MATTERS
          </p>

          <h2 className="text-xl font-semibold text-[#35245D]">
            Recently saved
          </h2>
        </div>

      </div>

      {/* Empty state */}
      {recentResources.length === 0 ? (
        <div className="rounded-2xl border border-white
          bg-white/40 p-6 text-center">

          <BookOpen
            size={34}
            strokeWidth={1.4}
            className="mx-auto mb-3 text-[#7768AE]"
          />

          <h3 className="text-sm font-semibold text-[#35245D]">
            Nothing saved yet
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-[#8879A5]">
            Save useful articles, videos and tutorials
            to find them whenever you need them.
          </p>

        </div>
      ) : (
        <div className="space-y-3">

          {recentResources.map(resource => {
            const Icon =
              resourceIcons[resource.resource_type] || Link2

            const safeUrl = /^https?:\/\//i.test(resource.url)
              ? resource.url
              : null

            return (
              <article
                key={resource.resource_id}
                className="group flex items-center gap-3
                  rounded-2xl border border-white/80
                  bg-white/60 p-3 transition-all
                  hover:-translate-y-0.5 hover:bg-white/90"
              >

                <div className="shrink-0 rounded-xl
                  bg-[#DED4EF] p-3 text-[#65528F]">
                  <Icon size={19} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm
                      font-semibold text-[#35245D]">
                      {resource.title}
                    </h3>

                    {Boolean(Number(resource.is_favourite)) && (
                      <Heart
                        size={13}
                        className="shrink-0 fill-[#D88D9D]
                          text-[#D88D9D]"
                      />
                    )}
                  </div>

                  <p className="mt-1 text-xs text-[#8879A5]">
                    {resource.resource_type || 'Resource'}
                    {resource.category && ` · ${resource.category}`}
                  </p>

                  {resource.procedure_title && (
                    <p className="mt-2 truncate text-[10px]
                      font-medium text-[#7768AE]">
                      Linked to: {resource.procedure_title}
                    </p>
                  )}

                </div>

                {safeUrl && (
                  <a
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${resource.title}`}
                    className="shrink-0 rounded-full border
                      border-white bg-white/60 p-2
                      text-[#65528F] transition-all
                      hover:bg-[#DED4EF]"
                  >
                    <ArrowUpRight size={17} />
                  </a>
                )}

              </article>
            )
          })}

        </div>
      )}

      {/* Knowledge Shelf shortcut */}
      <Link
        to="/knowledge"
        className="mt-5 flex w-full items-center justify-center
          gap-2 rounded-full border border-white bg-white/60
          px-4 py-3 text-xs font-semibold text-[#35245D]
          shadow-sm transition-all hover:bg-white"
      >
        Open Knowledge Shelf
        <ArrowUpRight size={16} />
      </Link>

    </section>
  )
}

export default RecentResources
