import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Files,
  FileCheck2,
  Check,
  Plus,
  ChevronDown,
  FolderOpen,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { getCategoryTheme } from './categoryThemes'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const requirementStyles = {
  mandatory: 'bg-red-100 text-red-800',
  conditional: 'bg-amber-100 text-amber-800',
  optional: 'bg-blue-100 text-blue-800',
}

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export default function DocumentChecklist({
  procedure,
  requirements = [],
}) {
  const { token } = useAuth()
  const location = useLocation()

  const theme = getCategoryTheme(procedure.category_id)

  const [documents, setDocuments] = useState([])
  const [checked, setChecked] = useState([])
  const [expanded, setExpanded] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Retrieve documents from the user's Document Hub
  useEffect(() => {
    const controller = new AbortController()

    setDocuments([])
    setChecked([])
    setExpanded([])
    setError('')
    setLoading(false)

    if (!token) return

    async function fetchDocuments() {
      try {
        setLoading(true)

        const response = await fetch(`${API_URL}/documents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error('Could not load your saved documents.')
        }

        setDocuments(result.data || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchDocuments()

    return () => controller.abort()
  }, [token, procedure.procedure_id])

  const mandatoryRequirements = requirements.filter(
    item => item.requirement_type === 'mandatory'
  )

  const completedMandatory = mandatoryRequirements.filter(
    item => checked.includes(item.requirement_id)
  ).length

  const percentage = mandatoryRequirements.length
    ? Math.round(
        (completedMandatory / mandatoryRequirements.length) * 100
      )
    : 0

  const allReady =
    mandatoryRequirements.length > 0 && percentage === 100

  function toggleCheck(id) {
    setChecked(previous =>
      previous.includes(id)
        ? previous.filter(item => item !== id)
        : [...previous, id]
    )
  }

  function toggleExpanded(id) {
    setExpanded(previous =>
      previous.includes(id)
        ? previous.filter(item => item !== id)
        : [...previous, id]
    )
  }

  function findMatchingDocument(requirement) {
    const name = normalizeName(requirement.requirement_name)

    if (!name) return undefined

    return documents.find(
      doc => normalizeName(doc.document_name) === name
    )
  }

  return (
    <section
      className="rounded-[2rem] border border-white/70 bg-white/40 p-5 shadow-lg backdrop-blur-xl md:p-7"
      style={{ color: theme.colors.dark }}
    >

      {/* Section heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        <div className="flex items-start gap-4">

          <div
            className="rounded-2xl p-3 shadow-md"
            style={{
              backgroundColor: theme.colors.dark,
              color: theme.colors.accent,
            }}
          >
            <Files size={25} />
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] opacity-60">
              PREPARE BEFORE YOU BEGIN
            </p>

            <h2 className="mt-1 font-serif text-3xl">
              Document readiness
            </h2>

            <p className="mt-2 text-sm opacity-70">
              Check off the requirements you have prepared.
            </p>
          </div>

        </div>

        <Link
          to="/documents"
          className="btn btn-sm rounded-full border-white/70 bg-white/50 normal-case shadow-sm"
          style={{ color: theme.colors.dark }}
        >
          <FolderOpen size={16} />
          My Document Hub
        </Link>

      </div>

      {/* Interactive readiness overview */}
      <div
        className="relative mt-6 flex flex-wrap items-center gap-6 overflow-hidden rounded-3xl border border-white/50 p-5 md:p-6"
        style={{
          background: `linear-gradient(
            135deg,
            ${theme.colors.background},
            ${theme.colors.secondary}
          )`,
        }}
      >

        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#ffffff90_1px,transparent_1px)] bg-[length:7px_7px]" />

        {/* Circular progress indicator */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">

          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 h-full w-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={theme.colors.dark}
              strokeOpacity="0.1"
              strokeWidth="8"
            />

            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={
                2 * Math.PI * 50 * (1 - percentage / 100)
              }
              className="transition-all duration-700"
            />
          </svg>

          <div className="text-center">

            <p className="font-serif text-3xl">
              {mandatoryRequirements.length
                ? `${percentage}%`
                : '—'}
            </p>

            <p className="text-[10px] opacity-60">
              READY
            </p>

          </div>

        </div>

        <div className="relative min-w-[180px] flex-1">

          <div className="flex items-center gap-2">

            {allReady && (
              <Sparkles
                size={23}
                className="motion-safe:animate-pulse"
              />
            )}

            <h3 className="font-serif text-2xl">
              {allReady
                ? 'Look at you!'
                : 'One document at a time.'}
            </h3>

          </div>

          <p className="mt-2 text-sm leading-relaxed opacity-75">
            {allReady
              ? 'You have marked every mandatory requirement as prepared. Review any conditional requirements before applying.'
              : `${completedMandatory} of ${mandatoryRequirements.length} mandatory requirements marked as prepared.`}
          </p>

          <p className="mt-3 text-xs opacity-60">
            {checked.length} of {requirements.length} total
            requirements checked
          </p>

        </div>

      </div>

      {/* Account information */}
      {!token && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/70 bg-white/50 p-4 text-sm">

          <AlertCircle size={19} className="shrink-0" />

          <p>
            You can use this checklist as a guest.{' '}
            <Link
              to="/login"
              state={{ returnTo: location.pathname }}
              className="font-semibold underline"
            >
              Log in
            </Link>
            {' '}to compare requirements with your Document Hub.
          </p>

        </div>
      )}

      {loading && (
        <p className="mt-4 text-sm opacity-60">
          Checking your Document Hub...
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Individual document requirements */}
      <div className="mt-6 space-y-3">

        {requirements.map(item => {
          const isChecked = checked.includes(item.requirement_id)

          const isExpanded = expanded.includes(item.requirement_id)

          const matchingDocument = findMatchingDocument(item)

          return (
            <article
              key={item.requirement_id}
              className="overflow-hidden rounded-2xl border bg-white/50 shadow-sm transition-all duration-300"
              style={{
                borderColor: isChecked
                  ? theme.colors.primary
                  : theme.colors.secondary,
              }}
            >

              <div className="flex items-start gap-3 p-4">

                {/* Interactive checkbox */}
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  aria-label={`Mark ${item.requirement_name} as prepared`}
                  onClick={() => toggleCheck(item.requirement_id)}
                  className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 hover:scale-110"
                  style={{
                    borderColor: theme.colors.primary,
                    backgroundColor: isChecked
                      ? theme.colors.primary
                      : 'transparent',
                    color: '#ffffff',
                  }}
                >
                  {isChecked && <Check size={18} />}
                </button>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="text-sm font-semibold md:text-base">
                      {item.requirement_name}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${
                        requirementStyles[item.requirement_type] ||
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.requirement_type}
                    </span>

                  </div>

                  {/* Document Hub matching status */}
                  {matchingDocument && (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium text-emerald-800">
                      <FileCheck2 size={13} />
                      Found in your Document Hub
                    </span>
                  )}

                  {token &&
                    !loading &&
                    !error &&
                    !matchingDocument && (
                      <p className="mt-2 text-xs opacity-60">
                        No exact name match in your Document Hub
                      </p>
                    )}

                  {isChecked && (
                    <p
                      className="mt-2 text-xs font-medium"
                      style={{ color: theme.colors.dark }}
                    >
                      Marked as prepared
                    </p>
                  )}

                </div>

                {/* Expand written instructions */}
                <button
                  type="button"
                  aria-label={`Details for ${item.requirement_name}`}
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpanded(item.requirement_id)}
                  className="btn btn-ghost btn-circle btn-sm"
                >
                  <ChevronDown
                    size={19}
                    className={`transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

              </div>

              {/* Original written requirements */}
              {isExpanded && (
                <div className="border-t border-current/10 px-5 py-4">

                  <p className="whitespace-pre-line text-sm leading-relaxed opacity-80">
                    {item.description}
                  </p>

                  {item.notes && (
                    <div
                      className="mt-3 rounded-xl p-3"
                      style={{
                        backgroundColor: theme.colors.background,
                      }}
                    >
                      <p className="text-xs font-semibold">
                        Important note
                      </p>

                      <p className="mt-1 whitespace-pre-line text-xs leading-relaxed opacity-80">
                        {item.notes}
                      </p>
                    </div>
                  )}

                  {token && !matchingDocument && (
                    <Link
                      to="/documents"
                      state={{
                        openForm: true,
                        documentName: item.requirement_name,
                        returnTo: location.pathname,
                      }}
                      className="btn btn-sm mt-4 rounded-full border-0 normal-case text-white shadow-sm"
                      style={{
                        backgroundColor: theme.colors.dark,
                      }}
                    >
                      <Plus size={15} />
                      Add to Document Hub
                    </Link>
                  )}

                  {token && matchingDocument && (
                    <Link
                      to="/documents"
                      className="mt-4 inline-flex items-center gap-2 text-xs font-semibold underline underline-offset-4"
                    >
                      <FolderOpen size={15} />
                      Open Document Hub
                    </Link>
                  )}

                </div>
              )}

            </article>
          )
        })}


        {requirements.length === 0 && (
          <p className="rounded-2xl bg-white/40 p-5 text-center text-sm opacity-70">
            No document requirements have been added yet.
          </p>
        )}

      </div>

      <p className="mt-5 text-xs leading-relaxed opacity-60">
        This checklist is a preparation aid. A saved document
        does not guarantee that it is valid or accepted by the
        relevant authority. Confirm official requirements
        before applying.
      </p>

    </section>
  )
}