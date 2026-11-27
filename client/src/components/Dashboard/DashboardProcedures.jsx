import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Trash2,
  AlertCircle,
} from 'lucide-react'

function DashboardProcedures({
  procedures = [],
  resources = [],
  onRemove,
}) {
  const modalRef = useRef(null)
  const removingRef = useRef(false)

  const [selectedProcedure, setSelectedProcedure] = useState(null)
  const [removing, setRemoving] = useState(false)
  const [removeError, setRemoveError] = useState('')

  function openRemoveModal(procedure) {
    setSelectedProcedure(procedure)
    setRemoveError('')
    modalRef.current?.showModal()
  }

  function closeRemoveModal() {
    if (removingRef.current) return

    modalRef.current?.close()
    setSelectedProcedure(null)
    setRemoveError('')
  }

  async function confirmRemove() {
    if (!selectedProcedure || removingRef.current) return

    removingRef.current = true
    setRemoving(true)
    setRemoveError('')

    try {
      await onRemove(selectedProcedure.user_procedure_id)

      modalRef.current?.close()
      setSelectedProcedure(null)
    } catch (error) {
      setRemoveError(
        error.message || 'Could not remove procedure.'
      )
    } finally {
      removingRef.current = false
      setRemoving(false)
    }
  }

  const sortedProcedures = [...procedures].sort(
    (a, b) =>
      Number(a.status === 'completed') -
      Number(b.status === 'completed')
  )

  return (
    <section className="rounded-[28px] border border-white/80
      bg-white/50 p-5 shadow-lg backdrop-blur-xl md:p-7">

      {/* Section heading */}
      <div className="mb-6 flex flex-wrap items-center
        justify-between gap-3">

        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em]
            text-[#66847E]">
            YOUR JOURNEY
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-[#193D39]">
            My procedures
          </h2>
        </div>

        <Link
          to="/procedures"
          className="flex items-center gap-2 rounded-full
            border border-white bg-white/70 px-4 py-2
            text-xs font-medium text-[#193D39] shadow-sm
            transition-all hover:bg-white"
        >
          Explore more
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Empty state */}
      {procedures.length === 0 ? (
        <div className="rounded-3xl border border-dashed
          border-[#193D39]/20 bg-white/30 p-8 text-center">

          <Compass
            size={38}
            strokeWidth={1.4}
            className="mx-auto mb-3 text-[#66847E]"
          />

          <h3 className="font-semibold text-[#193D39]">
            Your journey starts here
          </h3>

          <p className="mt-2 text-sm text-[#66847E]">
            Start a procedure to track your progress and
            keep related resources together.
          </p>

          <Link
            to="/procedures"
            className="btn mt-4 rounded-full border-none
              bg-[#193D39] text-white hover:bg-[#285C55]"
          >
            Find a procedure
          </Link>
        </div>
      ) : (
        <div className="space-y-4">

          {sortedProcedures.map(procedure => {
            const completed = procedure.status === 'completed'

            const percentage = Number(procedure.total_steps) > 0
              ? Math.min(100, Math.max(0, Math.round(
                  (Number(procedure.completed_steps || 0) /
                    Number(procedure.total_steps)) * 100
                )))
              : 0

            const relatedResources = resources.filter(
              resource =>
                Number(resource.procedure_id) ===
                Number(procedure.procedure_id)
            )

            return (
              <article
                key={procedure.user_procedure_id}
                className="rounded-[24px] border border-white
                  bg-gradient-to-br from-white/90 to-[#E5EEEA]/60
                  p-5 shadow-sm transition-shadow hover:shadow-md"
              >

                {/* Procedure information */}
                <div className="flex items-start gap-3">

                  <div className={`shrink-0 rounded-2xl p-3
                    ${completed
                      ? 'bg-[#DDECC5] text-[#527338]'
                      : 'bg-[#DCE9E5] text-[#285C55]'
                    }`}>
                    {completed
                      ? <CheckCircle2 size={23} />
                      : <Compass size={23} />
                    }
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="font-semibold text-[#193D39]">
                      {procedure.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#66847E]">
                      {procedure.completed_steps || 0} of{' '}
                      {procedure.total_steps || 0} steps completed
                    </p>

                    <span className={`mt-2 inline-block rounded-full
                      px-3 py-1 text-[10px] font-semibold
                      ${completed
                        ? 'bg-[#DDECC5] text-[#527338]'
                        : 'bg-[#F5E7C9] text-[#94702D]'
                      }`}>
                      {completed
                        ? 'Completed'
                        : percentage === 0
                          ? 'Not started'
                          : 'In progress'}
                    </span>

                  </div>

                  <span className="text-xl font-semibold
                    text-[#193D39]">
                    {percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  role="progressbar"
                  aria-label={`${procedure.title} progress`}
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-5 h-2 overflow-hidden rounded-full
                    bg-[#193D39]/10"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r
                      from-[#397C76] to-[#A8CB78]
                      transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Related saved resources */}
                {relatedResources.length > 0 && (
                  <div className="mt-5 rounded-2xl border
                    border-[#D8CCED] bg-[#EEE8F7]/70 p-4">

                    <div className="mb-3 flex items-center
                      gap-2 text-[#65528F]">

                      <Bookmark size={16} />

                      <h4 className="text-xs font-semibold">
                        Related saved resources
                        ({relatedResources.length})
                      </h4>
                    </div>

                    <div className="space-y-2">

                      {relatedResources.slice(0, 3).map(resource => (
                        <a
                          key={resource.resource_id}
                          href={/^https?:\/\//i.test(resource.url)
                            ? resource.url
                            : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3
                            rounded-xl border border-white/80
                            bg-white/60 p-3 text-[#514371]
                            transition-colors hover:bg-white"
                        >
                          <BookOpen size={17} className="shrink-0" />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium">
                              {resource.title}
                            </p>

                            <p className="mt-1 text-[10px] opacity-60">
                              {resource.resource_type || 'Resource'}
                            </p>
                          </div>

                          <ExternalLink size={14} className="shrink-0" />
                        </a>
                      ))}

                    </div>

                    {relatedResources.length > 3 && (
                      <Link
                        to="/knowledge"
                        className="mt-3 inline-block text-xs
                          font-medium text-[#65528F]"
                      >
                        View more in Knowledge Shelf →
                      </Link>
                    )}

                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-5 flex flex-wrap
                  items-center gap-2">

                  <button
                    type="button"
                    onClick={() => openRemoveModal(procedure)}
                    aria-label={`Remove ${procedure.title}`}
                    title="Remove procedure"
                    className="mr-auto flex cursor-pointer
                      items-center gap-2 rounded-full border
                      border-red-200 bg-red-50/70 px-3 py-2
                      text-xs font-medium text-red-600
                      transition-all hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>

                  <Link
                    to={`/procedures/${procedure.procedure_id}`}
                    className="rounded-full border border-[#193D39]/15
                      bg-white/60 px-4 py-2 text-xs font-medium
                      text-[#193D39] transition-colors hover:bg-white"
                  >
                    View guide
                  </Link>

                  <Link
                    to={`/my-procedures/${procedure.user_procedure_id}`}
                    className="flex items-center gap-2 rounded-full
                      bg-[#193D39] px-4 py-2 text-xs font-medium
                      text-white shadow-md transition-all
                      hover:-translate-y-0.5 hover:bg-[#285C55]"
                  >
                    {completed ? 'View progress' : 'Resume progress'}
                    <ArrowUpRight size={15} />
                  </Link>

                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Remove confirmation modal */}
      <dialog
        ref={modalRef}
        aria-labelledby="remove-procedure-title"
        onCancel={event => {
          event.preventDefault()
          closeRemoveModal()
        }}
        className="modal backdrop:bg-[#103B37]/40
          backdrop:backdrop-blur-sm"
      >
        <div className="modal-box max-w-md rounded-[28px]
          border border-white/80 bg-[#F8F9F5] p-6
          text-[#193D39] shadow-2xl">

          <div className="mb-4 grid h-14 w-14
            place-items-center rounded-2xl
            bg-red-100 text-red-600">
            <Trash2 size={26} />
          </div>

          <h3
            id="remove-procedure-title"
            className="text-xl font-semibold"
          >
            Remove this procedure?
          </h3>

          <p className="mt-3 text-sm font-semibold">
            {selectedProcedure?.title}
          </p>

          <p className="mt-2 text-sm leading-relaxed
            text-[#66847E]">
            Your saved progress will be permanently removed.
            Your documents and saved resources will remain
            unaffected. You can start this procedure again
            whenever you want.
          </p>

          {removeError && (
            <div role="alert" className="mt-4 flex items-center
              gap-2 rounded-xl bg-red-50 p-3
              text-xs text-red-600">
              <AlertCircle size={17} className="shrink-0" />
              {removeError}
            </div>
          )}

          <div className="modal-action flex flex-wrap gap-2">

            <button
              type="button"
              disabled={removing}
              onClick={closeRemoveModal}
              className="btn rounded-full border-[#193D39]/15
                bg-white text-[#193D39]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={removing || !selectedProcedure}
              onClick={confirmRemove}
              className="btn rounded-full border-none
                bg-red-600 text-white hover:bg-red-700"
            >
              {removing ? (
                <>
                  <span className="loading loading-spinner
                    loading-xs" />
                  Removing...
                </>
              ) : (
                'Remove procedure'
              )}
            </button>

          </div>
        </div>
      </dialog>

    </section>
  )
}

export default DashboardProcedures