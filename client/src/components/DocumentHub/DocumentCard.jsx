import {
  Fingerprint,
  GraduationCap,
  Scale,
  BriefcaseBusiness,
  Wallet,
  HeartPulse,
  Folder,
  FileText,
  CalendarDays,
  Paperclip,
  Eye,
  Download,
  Pencil,
  Trash2,
} from 'lucide-react'

import {
  formatDate,
  getStatus,
  daysUntilExpiry,
  glassPanel,
} from './documentUtils'

const categoryIcons = {
  Identity: Fingerprint,
  Education: GraduationCap,
  Legal: Scale,
  Employment: BriefcaseBusiness,
  Financial: Wallet,
  Medical: HeartPulse,
  Personal: Folder,
  Other: FileText,
}

const themes = [
  'from-[#112250] to-[#3C507D] text-[#F5F0E9]',
  'from-[#F5F0E9] to-[#E0C58F] text-[#112250]',
  'from-[#F5F0E9] to-[#D9CBC2] text-[#112250]',
  'from-[#3C507D] to-[#112250] text-[#F5F0E9]',
]

const statusStyles = {
  'Expired': 'bg-red-100 text-red-800',
  'Expiring soon': 'bg-[#E0C58F] text-[#112250]',
  'Not expired': 'bg-emerald-100 text-emerald-800',
  'No expiry set': 'bg-[#F5F0E9] text-[#3C507D]',
}

const actionStyle =
  'btn btn-sm rounded-full normal-case border-white/30 bg-white/15 text-inherit backdrop-blur-md hover:bg-white/30 transition-all duration-300'

export default function DocumentCard({
  document: doc,
  index = 0,
  onEdit,
  onDelete,
  onOpen,
}) {
  const Icon = categoryIcons[doc.document_type] || FileText
  const status = getStatus(doc)
  const days = daysUntilExpiry(doc.expiry_date)
  const theme = themes[index % themes.length]

  return (
    <article
      className={`${glassPanel} ${theme}
        relative isolate overflow-hidden bg-gradient-to-br
        transition-all duration-300 hover:-translate-y-1
        hover:shadow-xl`}
    >

      {/* Subtle surface texture */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#ffffff40_1px,transparent_1px)] bg-[length:7px_7px]" />

      <div className="relative flex h-full flex-col p-5">

        {/* Category and status */}
        <div className="flex items-start justify-between gap-3">

          <div className="rounded-2xl border border-white/30 bg-white/20 p-3 backdrop-blur-lg">
            <Icon size={27} strokeWidth={1.5} />
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${statusStyles[status]}`}
          >
            {status}
          </span>

        </div>

        {/* Document name */}
        <div className="mt-5">

          <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">
            {doc.document_type || 'Other'}
          </p>

          <h3 className="mt-1 break-words font-serif text-2xl">
            {doc.document_name}
          </h3>

        </div>

        {/* Document dates */}
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">

          <div>
            <p className="flex items-center gap-1 text-[10px] opacity-70">
              <CalendarDays size={12} />
              Issue date
            </p>

            <p className="mt-1 text-xs font-medium">
              {formatDate(doc.issue_date)}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1 text-[10px] opacity-70">
              <CalendarDays size={12} />
              Expiry date
            </p>

            <p className="mt-1 text-xs font-medium">
              {formatDate(doc.expiry_date)}
            </p>
          </div>

        </div>

        {/* Expiry reminder */}
        {status === 'Expiring soon' && (
          <p className="mt-3 rounded-xl bg-[#E0C58F] px-3 py-2 text-xs font-medium text-[#112250]">
            {days === 0
              ? 'Expires today'
              : `Expires in ${days} day${days === 1 ? '' : 's'}`}
          </p>
        )}

        {/* Notes */}
        {doc.notes && (
          <p className="mt-4 whitespace-pre-wrap break-words text-xs leading-relaxed opacity-80">
            {doc.notes}
          </p>
        )}

        {/* Attachment information */}
        <div className="mt-auto pt-5">

          <div className="mb-4 flex items-center gap-2 text-xs opacity-80">
            <Paperclip size={15} />

            {doc.file_path
              ? 'Attachment available'
              : 'Document record only'}
          </div>

          {/* View and download */}
          {doc.file_path && (
            <div className="mb-3 grid grid-cols-2 gap-2">

              <button
                type="button"
                className={actionStyle}
                onClick={() => onOpen(doc, false)}
              >
                <Eye size={15} />
                Preview
              </button>

              <button
                type="button"
                className={actionStyle}
                onClick={() => onOpen(doc, true)}
              >
                <Download size={15} />
                Download
              </button>

            </div>
          )}

          {/* Edit and delete */}
          <div className="grid grid-cols-2 gap-2">

            <button
              type="button"
              className={actionStyle}
              onClick={() => onEdit(doc)}
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              type="button"
              className={`${actionStyle} hover:border-red-300 hover:bg-red-100 hover:text-red-800`}
              onClick={() => onDelete(doc.document_id)}
            >
              <Trash2 size={14} />
              Delete
            </button>

          </div>

        </div>

      </div>

    </article>
  )
}