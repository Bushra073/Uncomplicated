import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  ArrowLeft,
  ArrowUpRight,
  LayoutDashboard,
  Route,
  Files,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'

import { API_URL, useAuth } from '../context/AuthContext'

import TrackerHero from '../components/ProcedureTracker/TrackerHero'
import TrackerRoadmap from '../components/ProcedureTracker/TrackerRoadmap'
import NextAction from '../components/ProcedureTracker/NextAction'

import DocumentChecklist from '../components/Procedures/DocumentChecklist'
import { getCategoryTheme } from '../components/Procedures/categoryThemes'

import '../styles/ProcedureAnimations.css'

function ProcedureTracker() {
  const { id } = useParams()
  const { token } = useAuth()

  const roadmapRef = useRef(null)
  const savingRef = useRef(false)

  const [tracker, setTracker] = useState(null)
  const [procedure, setProcedure] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailsError, setDetailsError] = useState('')

  const [updatingStepId, setUpdatingStepId] = useState(null)
  const [activeTab, setActiveTab] = useState('roadmap')
  const [roadmapVersion, setRoadmapVersion] = useState(0)

  // Retrieve saved application progress
  async function fetchTracker(signal) {
    const response = await fetch(
      `${API_URL}/my-procedures/${id}`,
      {
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const result = await response.json()

    if (!response.ok || result.status !== 'success') {
      throw new Error(
        result.message || 'Could not load your tracker.'
      )
    }

    return result.data
  }

  // Load tracker and original procedure information
  useEffect(() => {
    const controller = new AbortController()

    async function loadPage() {
      try {
        setLoading(true)
        setError('')
        setDetailsError('')
        setTracker(null)
        setProcedure(null)
        setActiveTab('roadmap')
        setRoadmapVersion(0)

        window.scrollTo(0, 0)

        const trackerData = await fetchTracker(
          controller.signal
        )

        if (controller.signal.aborted) return

        setTracker(trackerData)

        try {
          const response = await fetch(
            `${API_URL}/procedures/${trackerData.procedure_id}`,
            { signal: controller.signal }
          )

          const result = await response.json()

          if (!response.ok || result.status !== 'success') {
            throw new Error(
              result.message ||
              'Could not load procedure information.'
            )
          }

          if (!controller.signal.aborted) {
            setProcedure(result.data)
          }

        } catch (err) {
          if (err.name !== 'AbortError') {
            setDetailsError(err.message)
          }
        }

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

    loadPage()

    return () => controller.abort()
  }, [id, token])

  // Save task completion to MySQL
  async function toggleStep(step) {
    if (savingRef.current) return false

    savingRef.current = true

    try {
      setError('')
      setUpdatingStepId(step.step_id)

      const response = await fetch(
        `${API_URL}/my-procedures/${id}/steps/${step.step_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: !Boolean(step.is_completed),
          }),
        }
      )

      const result = await response.json()

      if (!response.ok || result.status !== 'success') {
        throw new Error(
          result.message || 'Could not save your progress.'
        )
      }

      // Reflect the successfully saved change immediately
      setTracker(previous => {
        const updatedSteps = previous.steps.map(item =>
          item.step_id === step.step_id
            ? {
                ...item,
                is_completed: !Boolean(step.is_completed),
              }
            : item
        )

        return {
          ...previous,
          steps: updatedSteps,
        }
      })

      // Synchronize with the database
      try {
        const updatedTracker = await fetchTracker()
        setTracker(updatedTracker)
      } catch {
        setError(
          'Your task was saved, but the latest tracker data could not be refreshed.'
        )
      }

      return true

    } catch (err) {
      setError(err.message)
      return false

    } finally {
      setUpdatingStepId(null)
      savingRef.current = false
    }
  }

  // Open the next unfinished task
  function focusNextStep() {
    setActiveTab('roadmap')

    // Reinitialize the roadmap with its next unfinished task
    setRoadmapVersion(previous => previous + 1)

    requestAnimationFrame(() => {
      roadmapRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  // Loading state
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F5F0E9] text-[#112250]">

        <span className="loading loading-ring loading-lg" />

        <h2 className="font-serif text-3xl">
          Preparing your journey...
        </h2>

        <p className="text-sm opacity-60">
          Retrieving your saved progress.
        </p>

      </main>
    )
  }

  // Error state
  if (!tracker) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F5F0E9] p-6 text-[#112250]">

        <AlertCircle size={42} />

        <h2 className="font-serif text-3xl">
          Unable to load your tracker.
        </h2>

        <p className="text-sm">
          {error || 'Tracker not found.'}
        </p>

        <Link
          to="/dashboard"
          className="btn rounded-full bg-[#112250] normal-case text-white"
        >
          <ArrowLeft size={17} />
          Return to dashboard
        </Link>

      </main>
    )
  }

  const categoryId =
    procedure?.category_id || tracker.category_id

  const theme = getCategoryTheme(categoryId)
  const CategoryIcon = theme.icon

  const requirements = procedure?.requirements || []

  const tabs = [
    {
      id: 'roadmap',
      label: 'Application roadmap',
      icon: Route,
    },
    {
      id: 'documents',
      label: 'Document readiness',
      icon: Files,
    },
  ]

  return (
    <main
      className="relative isolate min-h-screen overflow-x-clip"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.dark,
      }}
    >

      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_center,#00000018_1px,transparent_1px)] bg-[length:10px_10px]" />

      {/* Ambient lighting */}
      <div
        className="pointer-events-none absolute -left-32 top-40 -z-10 h-96 w-96 rounded-full opacity-30 blur-[100px]"
        style={{
          backgroundColor: theme.colors.secondary,
        }}
      />

      <div
        className="pointer-events-none absolute -right-32 top-[650px] -z-10 h-96 w-96 rounded-full opacity-20 blur-[100px]"
        style={{
          backgroundColor: theme.colors.accent,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-8">

        {/* Navigation */}
        <nav className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <Link
            to="/dashboard"
            className="group flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Dashboard
          </Link>

          <Link
            to="/"
            className="font-serif text-2xl tracking-tight"
          >
            uncomplicated.
          </Link>

          <div className="hidden items-center gap-2 text-xs opacity-70 sm:flex">
            <CategoryIcon size={17} />

            {procedure?.category_name || 'My procedure'}
          </div>

        </nav>

        {/* Progress dashboard */}
        <TrackerHero
          tracker={tracker}
          categoryId={categoryId}
        />

        {/* Error messages */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle size={21} className="shrink-0" />

            <p className="flex-1">{error}</p>

            <button
              type="button"
              onClick={() => setError('')}
              className="btn btn-ghost btn-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {detailsError && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Procedure details could not be loaded.
            Your saved application tasks are still available.
          </div>
        )}

        {/* Workspace heading */}
        <div className="mb-5 mt-9">

          <p className="text-[10px] font-semibold tracking-[0.2em] opacity-60">
            YOUR PERSONAL WORKSPACE
          </p>

          <h2 className="mt-2 font-serif text-3xl md:text-4xl">
            Make things happen.
          </h2>

          <p className="mt-2 text-sm opacity-70">
            Manage your tasks and prepare everything you need.
          </p>

        </div>

        {/* Workspace tabs */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">

          {tabs.map(tab => {
            const Icon = tab.icon
            const selected = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-4 rounded-2xl border border-white/70 p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: selected
                    ? theme.colors.dark
                    : '#ffffff70',

                  color: selected
                    ? '#ffffff'
                    : theme.colors.dark,
                }}
              >

                <div
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: selected
                      ? '#ffffff20'
                      : theme.colors.secondary,

                    color: selected
                      ? theme.colors.accent
                      : theme.colors.dark,
                  }}
                >
                  <Icon size={23} />
                </div>

                <div className="flex-1">

                  <h3 className="font-serif text-lg">
                    {tab.label}
                  </h3>

                  <p className="mt-1 text-xs opacity-70">
                    {tab.id === 'roadmap'
                      ? 'Manage your application tasks'
                      : 'Prepare your required documents'}
                  </p>

                </div>

              </button>
            )
          })}

        </div>

        {/* Main workspace */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* Main content */}
          <div
            ref={roadmapRef}
            className="min-w-0 scroll-mt-6"
          >

            {/* Keep roadmap mounted when switching tabs */}
            <div hidden={activeTab !== 'roadmap'}>

              <TrackerRoadmap
                key={`${id}-${roadmapVersion}`}
                tracker={tracker}
                categoryId={categoryId}
                onToggleStep={toggleStep}
                updatingStepId={updatingStepId}
              />

            </div>

            {/* Document readiness */}
            <div hidden={activeTab !== 'documents'}>

              {procedure ? (
                <DocumentChecklist
                  key={`documents-${id}`}
                  procedure={procedure}
                  requirements={requirements}
                />
              ) : (
                <section className="rounded-3xl border border-white/70 bg-white/50 p-6 shadow-sm">

                  <Files size={28} />

                  <h3 className="mt-4 font-serif text-2xl">
                    Document requirements unavailable
                  </h3>

                  <p className="mt-3 text-sm opacity-70">
                    You can still manage your documents
                    directly through your Document Hub.
                  </p>

                  <Link
                    to="/documents"
                    state={{
                      returnTo: `/my-procedures/${id}`,
                    }}
                    className="btn mt-5 rounded-full border-0 normal-case text-white"
                    style={{
                      backgroundColor: theme.colors.dark,
                    }}
                  >
                    Open Document Hub
                    <ArrowUpRight size={17} />
                  </Link>

                </section>
              )}

            </div>

          </div>

          {/* Personalized sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6">

            <NextAction
              tracker={tracker}
              categoryId={categoryId}
              onFocusStep={focusNextStep}
            />

            {/* Quick access to documents */}
            <section className="rounded-3xl border border-white/70 bg-white/50 p-5 shadow-sm backdrop-blur-xl">

              <div className="flex items-center gap-3">

                <div
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: theme.colors.secondary,
                  }}
                >
                  <Files size={23} />
                </div>

                <h3 className="font-serif text-xl">
                  Your documents.
                </h3>

              </div>

              <p className="mt-4 text-sm leading-relaxed opacity-70">
                Keep your important documents organized
                and ready whenever you need them.
              </p>

              <Link
                to="/documents"
                state={{
                  returnTo: `/my-procedures/${id}`,
                }}
                className="btn mt-4 w-full rounded-full border-white/70 bg-white/60 normal-case"
                style={{
                  color: theme.colors.dark,
                }}
              >
                Open Document Hub
                <ArrowUpRight size={17} />
              </Link>

            </section>

            {/* Saved progress information */}
            <section
              className="rounded-3xl p-5"
              style={{
                backgroundColor: theme.colors.secondary,
              }}
            >

              <ShieldCheck size={25} />

              <h3 className="mt-3 font-serif text-xl">
                Pick up where you left off.
              </h3>

              <p className="mt-2 text-xs leading-relaxed opacity-75">
                Successfully saved task completion is stored
                in your account. Return whenever you are
                ready to continue.
              </p>

            </section>

          </aside>

        </div>

        {/* Footer */}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/40 p-5">

          <div>
            <h3 className="font-serif text-xl">
              Everything in its place.
            </h3>

            <p className="mt-1 text-xs opacity-60">
              Manage all your ongoing procedures from your dashboard.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="btn rounded-full border-0 normal-case text-white shadow-md"
            style={{
              backgroundColor: theme.colors.dark,
            }}
          >
            <LayoutDashboard size={18} />
            My dashboard
          </Link>

        </footer>

        <div className="mt-8 text-center">

          <p className="font-serif text-xl">
            uncomplicated.
          </p>

          <p className="mt-1 text-xs opacity-50">
            Making complicated things a little simpler.
          </p>

        </div>

      </div>

    </main>
  )
}

export default ProcedureTracker