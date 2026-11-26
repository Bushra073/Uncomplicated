import {
  Heart,
  Pencil,
  Trash2,
  ArrowUpRight,
  BookOpen,
  Video,
  Globe,
  GraduationCap,
  Film,
  FolderOpen,
  Link2,
} from 'lucide-react'

const typeIcons = {
  Article: BookOpen,
  Video: Video,
  Reel: Film,
  Tutorial: GraduationCap,
  Website: Globe,
  Other: Link2,
}

const gradients = [
  'from-[#F5EBDD] to-[#E9B8A8]/60',
  'from-[#F5EBDD] to-[#D9EDAD]/70',
  'from-[#F5EBDD] to-[#7768AE]/25',
  'from-white/70 to-[#E9B8A8]/30',
]

export default function ResourceCard({
  resource,
  index = 0,
  onEdit,
  onDelete,
  onFavourite,
}) {
  const Icon = typeIcons[resource.resource_type] || Link2

  const tags = (resource.tags || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  let domain = resource.url
  let safeUrl = null

  try {
    const parsed = new URL(resource.url)
    domain = parsed.hostname.replace(/^www\./, '')

    if (['http:', 'https:'].includes(parsed.protocol)) {
      safeUrl = parsed.href
    }
  } catch {
    domain = 'Invalid link'
  }

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br ${gradients[index % gradients.length]} p-5 text-[#29263D] shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >

      {/* Decorative icon */}
      <Icon
        size={140}
        strokeWidth={0.6}
        className="pointer-events-none absolute -right-8 -top-8 rotate-12 opacity-[0.07]"
      />

      <div className="relative flex items-start justify-between gap-3">

        <div className="rounded-2xl border border-white/80 bg-white/60 p-3 shadow-sm">
          <Icon size={26} className="text-[#7768AE]" />
        </div>

        <button
          type="button"
          aria-label="Toggle favourite"
          aria-pressed={Boolean(resource.is_favourite)}
          onClick={() => onFavourite(resource.resource_id)}
          className="btn btn-ghost btn-circle btn-sm"
        >
          <Heart
            size={22}
            fill={resource.is_favourite ? '#C45C78' : 'none'}
            className={
              resource.is_favourite
                ? 'text-[#C45C78]'
                : 'text-[#7768AE]'
            }
          />
        </button>

      </div>

      <div className="relative mt-5 flex flex-wrap gap-2">

        <span className="rounded-full bg-[#29263D] px-3 py-1 text-[10px] font-semibold text-[#F5EBDD]">
          {resource.resource_type}
        </span>

        {resource.category && (
          <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-medium">
            {resource.category}
          </span>
        )}

      </div>

      <h3 className="mt-4 break-words font-serif text-2xl">
        {resource.title}
      </h3>

      <p className="mt-2 truncate text-xs text-[#7768AE]">
        {domain}
      </p>

      {resource.notes && (
        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed opacity-75">
          {resource.notes}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded-lg border border-white/70 bg-white/40 px-2.5 py-1 text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Collection and linked procedure */}
      <div className="mt-4 space-y-2">

        {resource.collection_name && (
          <div className="flex items-center gap-2 text-xs opacity-75">
            <FolderOpen size={15} />
            {resource.collection_name}
          </div>
        )}

        {resource.procedure_title && (
          <div className="flex items-start gap-2 text-xs opacity-75">
            <Link2 size={15} className="shrink-0" />
            {resource.procedure_title}
          </div>
        )}

      </div>

      {/* Actions */}
      <div className="mt-auto pt-6">

        <div className="flex items-center gap-2 border-t border-[#29263D]/10 pt-4">

          {safeUrl ? (
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn flex-1 rounded-full border-0 bg-[#29263D] normal-case text-white"
            >
              Open resource
              <ArrowUpRight size={17} />
            </a>
          ) : (
            <span className="flex-1 text-xs">
              Invalid resource URL
            </span>
          )}

          <button
            type="button"
            title="Edit resource"
            aria-label="Edit resource"
            onClick={() => onEdit(resource)}
            className="btn btn-circle btn-ghost btn-sm"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            title="Delete resource"
            aria-label="Delete resource"
            onClick={() => onDelete(resource.resource_id)}
            className="btn btn-circle btn-ghost btn-sm text-red-600"
          >
            <Trash2 size={17} />
          </button>

        </div>

      </div>

    </article>
  )
}