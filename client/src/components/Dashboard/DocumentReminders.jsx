
import { Link } from 'react-router-dom'
import {
  Bell,
  CalendarClock,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react'

import {
  daysUntilExpiry,
  formatDate,
} from '../DocumentHub/documentUtils'

function DocumentReminders({ documents = [] }) {
  const reminders = documents
    .filter(doc => doc.expiry_date)
    .map(doc => ({
      ...doc,
      daysLeft: daysUntilExpiry(doc.expiry_date),
    }))
    .filter(doc => Number.isFinite(doc.daysLeft) && doc.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const expired = reminders.filter(doc => doc.daysLeft < 0).length
  const upcoming = reminders.length - expired

  return (
    <section className="rounded-[28px] border border-white/80
      bg-gradient-to-br from-[#FFF9ED]/90 to-[#F1E3CC]/70
      p-5 shadow-lg backdrop-blur-xl md:p-6">

      {/* Heading */}
      <div className="mb-5 flex items-center gap-3">

        <div className="rounded-2xl border border-white
          bg-white/60 p-3 text-[#A87936] shadow-sm">
          <Bell size={23} />
        </div>

        <div>
          <p className="text-[10px] font-semibold
            tracking-[0.2em] text-[#A87936]">
            STAY AHEAD
          </p>

          <h2 className="text-xl font-semibold text-[#604B32]">
            Needs your attention
          </h2>
        </div>

        {reminders.length > 0 && (
          <span className="ml-auto rounded-full
            bg-[#E8C58C] px-3 py-1 text-xs
            font-semibold text-[#604B32]">
            {reminders.length}
          </span>
        )}
      </div>

      {/* Reminder summary */}
      {reminders.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3">

          <div className="rounded-2xl border border-white/80
            bg-[#F9DEDA]/70 p-3">
            <p className="text-xs text-[#A34F45]">Expired</p>
            <p className="mt-1 text-2xl font-semibold text-[#A34F45]">
              {expired}
            </p>
          </div>

          <div className="rounded-2xl border border-white/80
            bg-[#F9E9C4]/70 p-3">
            <p className="text-xs text-[#94702D]">Expiring soon</p>
            <p className="mt-1 text-2xl font-semibold text-[#94702D]">
              {upcoming}
            </p>
          </div>

        </div>
      )}

      {/* Empty state */}
      {reminders.length === 0 ? (
        <div className="rounded-2xl border border-white
          bg-white/50 p-6 text-center">

          <CheckCircle2
            size={34}
            className="mx-auto mb-3 text-[#72945B]"
            strokeWidth={1.5}
          />

          <h3 className="text-sm font-semibold text-[#604B32]">
            {documents.length === 0
              ? 'No documents saved yet'
              : 'No urgent expiry reminders'}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-[#927F65]">
            Add expiry dates to your documents and we'll help
            you keep track of upcoming renewals.
          </p>

        </div>
      ) : (
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">

          {reminders.map(doc => {
            const isExpired = doc.daysLeft < 0

            const message = isExpired
              ? `Expired ${Math.abs(doc.daysLeft)} day(s) ago`
              : doc.daysLeft === 0
                ? 'Expires today'
                : `Expires in ${doc.daysLeft} day(s)`

            return (
              <article
                key={doc.document_id}
                className="flex items-start gap-3 rounded-2xl
                  border border-white/80 bg-white/60 p-3"
              >

                <div className={`shrink-0 rounded-xl p-2.5
                  ${isExpired
                    ? 'bg-[#F9DEDA] text-[#A34F45]'
                    : 'bg-[#F9E9C4] text-[#94702D]'
                  }`}>

                  {isExpired
                    ? <AlertCircle size={20} />
                    : <CalendarClock size={20} />}
                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="break-words text-sm font-semibold
                    text-[#604B32]">
                    {doc.document_name}
                  </h3>

                  <p className={`mt-1 text-xs font-medium
                    ${isExpired
                      ? 'text-[#A34F45]'
                      : 'text-[#94702D]'
                    }`}>
                    {message}
                  </p>

                  <p className="mt-1 text-[11px] text-[#927F65]">
                    Expiry: {formatDate(doc.expiry_date)}
                  </p>

                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Document Hub shortcut */}
      <Link
        to="/documents"
        className="mt-5 flex w-full items-center justify-center
          gap-2 rounded-full border border-white bg-white/60
          px-4 py-3 text-xs font-semibold text-[#604B32]
          shadow-sm transition-all hover:bg-white"
      >
        Open Document Hub
        <ArrowUpRight size={16} />
      </Link>

    </section>
  )
}

export default DocumentReminders
