import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Compass,
  BookOpen,
  ClipboardCheck,
  Files,
  Calculator,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { getCategoryTheme } from '../Procedures/categoryThemes'
import ProcedureHero from '../Procedures/ProcedureHero'
import DocumentChecklist from '../Procedures/DocumentChecklist'
import InteractiveGuide from '../Procedures/InteractiveGuide'
import EligibilityChecker from '../Procedures/EligibilityChecker'
import FeeCalculator from '../Procedures/FeeCalculator'
import WrittenGuide from '../Procedures/WrittenGuide'

import '../../styles/ProcedureAnimations.css'

const API_URL = 'http://localhost:5000/api'

const guideSections = [
  {
    id: 'eligibility',
    label: 'Eligibility',
    icon: ClipboardCheck,
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: Files,
  },
  {
    id: 'fees',
    label: 'Expenses',
    icon: Calculator,
  },
  {
    id: 'journey',
    label: 'Application journey',
    icon: Compass,
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: ExternalLink,
  },
]

function ProcedureDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const guideRef = useRef(null)

  const [procedure, setProcedure] = useState(null)
  const [requirements, setRequirements] = useState([])
  const [steps, setSteps] = useState([])
  const [resources, setResources] = useState([])

  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')
  const [startError, setStartError] = useState('')

  const [mode, setMode] = useState('interactive')
  const [activeSection, setActiveSection] = useState('eligibility')

  // Load procedure from the existing backend
  useEffect(() => {
    const controller = new AbortController()

    async function fetchProcedure() {
      try {
        setLoading(true)
        setError('')
        setStartError('')
        setProcedure(null)
        setMode('interactive')
        setActiveSection('eligibility')

        window.scrollTo(0, 0)

        const response = await fetch(
          `${API_URL}/procedures/${id}`,
          { signal: controller.signal }
        )

        const result = await response.json()

        if (!response.ok || result.status !== 'success') {
          throw new Error(
            result.message || 'Could not load this procedure.'
          )
        }

        setProcedure(result.data)
        setRequirements(result.data.requirements || [])
        setSteps(result.data.steps || [])
        setResources(result.data.resources || [])

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

    fetchProcedure()

    return () => controller.abort()
  }, [id])

  // Preserve existing Start / Resume functionality
  async function handleStartProcedure() {
    setStartError('')

    if (!token) {
      navigate('/login', {
        state: { returnTo: `/procedures/${id}` },
      })
      return
    }

    try {
      setStarting(true)

      const response = await fetch(
        `${API_URL}/my-procedures/${id}/start`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json()

      if (!response.ok || result.status !== 'success') {
        throw new Error(
          result.message || 'Could not start this procedure.'
        )
      }

      navigate(`/my-procedures/${result.user_procedure_id}`)

    } catch (err) {
      setStartError(err.message)
    } finally {
      setStarting(false)
    }
  }

  function scrollToGuide() {
    guideRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  // Loading state
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F5F0E9] text-[#112250]">
        <span className="loading loading-ring loading-lg" />

        <h2 className="font-serif text-2xl">
          Finding your way...
        </h2>

        <p className="text-sm opacity-60">
          Preparing your procedure guide.
        </p>
      </main>
    )
  }

  // Error state
  if (error || !procedure) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F5F0E9] p-6 text-[#112250]">
        <h2 className="font-serif text-3xl">
          Something went wrong.
        </h2>

        <p className="text-sm">
          {error || 'Procedure not found.'}
        </p>

        <Link
          to="/procedures"
          className="btn rounded-full bg-[#112250] normal-case text-white"
        >
          <ArrowLeft size={17} />
          Back to procedures
        </Link>
      </main>
    )
  }

  const theme = getCategoryTheme(procedure.category_id)

  const CategoryIcon = theme.icon

  const activeIndex = guideSections.findIndex(
    section => section.id === activeSection
  )

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
        className="pointer-events-none absolute -left-40 top-40 -z-10 h-96 w-96 rounded-full opacity-30 blur-[100px]"
        style={{ backgroundColor: theme.colors.secondary }}
      />

      <div
        className="pointer-events-none absolute -right-40 top-[700px] -z-10 h-96 w-96 rounded-full opacity-20 blur-[100px]"
        style={{ backgroundColor: theme.colors.accent }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-8">

        {/* Navigation */}
        <nav className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <Link
            to="/procedures"
            className="group inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            All procedures
          </Link>

          <Link
            to="/"
            className="font-serif text-2xl tracking-tight"
          >
            uncomplicated<span style={{ color: theme.colors.primary }}>.</span>
          </Link>

          <span className="hidden items-center gap-2 text-xs opacity-70 sm:flex">
            <CategoryIcon size={16} />
            {procedure.category_name || theme.mood}
          </span>

        </nav>

        {/* Procedure Hero */}
        <ProcedureHero
          procedure={procedure}
          requirements={requirements}
          steps={steps}
          token={token}
          starting={starting}
          onStart={handleStartProcedure}
          onExplore={scrollToGuide}
          startError={startError}
        />

        {/* Guide mode selection */}
        <div ref={guideRef} className="mt-8 scroll-mt-6">

          <div className="mb-5">

            <p className="text-[10px] font-semibold tracking-[0.2em] opacity-60">
              YOUR GUIDE, YOUR WAY
            </p>

            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              How would you like to explore?
            </h2>

            <p className="mt-2 text-sm opacity-70">
              Choose the experience that works best for you.
            </p>

          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            {[
              {
                id: 'interactive',
                icon: Compass,
                title: 'Interactive journey',
                description:
                  'Explore, answer questions and prepare at your own pace.',
              },
              {
                id: 'written',
                icon: BookOpen,
                title: 'Full written guide',
                description:
                  'Read the complete guidelines in one organized place.',
              },
            ].map(item => {
              const Icon = item.icon
              const selected = mode === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setMode(item.id)}
                  className="group flex items-center gap-4 rounded-3xl border p-5 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: selected
                      ? `linear-gradient(135deg, ${theme.colors.dark}, ${theme.colors.primary})`
                      : '#ffffff70',

                    color: selected
                      ? '#ffffff'
                      : theme.colors.dark,

                    borderColor: selected
                      ? theme.colors.primary
                      : '#ffffff',
                  }}
                >

                  <div
                    className="rounded-2xl p-3"
                    style={{
                      backgroundColor: selected
                        ? '#ffffff20'
                        : theme.colors.secondary,

                      color: selected
                        ? theme.colors.accent
                        : theme.colors.dark,
                    }}
                  >
                    <Icon size={28} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-xl">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed opacity-75">
                      {item.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={20}
                    className="shrink-0 transition-transform group-hover:translate-x-1"
                  />

                </button>
              )
            })}

          </div>

        </div>

        {/* Interactive mode */}
        <div
          className={`mt-7 ${
            mode === 'interactive' ? 'block' : 'hidden'
          }`}
        >

          {/* Interactive section navigation */}
          <div className="mb-6 flex flex-wrap gap-2 rounded-3xl border border-white/70 bg-white/40 p-3 shadow-sm backdrop-blur-xl">

            {guideSections.map(section => {
              const Icon = section.icon
              const selected = activeSection === section.id

              return (
                <button
                  key={section.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveSection(section.id)}
                  className="flex items-center gap-2 rounded-full px-4 py-3 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: selected
                      ? theme.colors.dark
                      : '#ffffff80',

                    color: selected
                      ? theme.colors.accent
                      : theme.colors.dark,
                  }}
                >
                  <Icon size={17} />
                  {section.label}
                </button>
              )
            })}

          </div>

          {/* Eligibility */}
          <div hidden={activeSection !== 'eligibility'}>
            <EligibilityChecker
              key={`eligibility-${id}`}
              procedure={procedure}
            />
          </div>

          {/* Documents */}
          <div hidden={activeSection !== 'documents'}>
            <DocumentChecklist
              key={`documents-${id}`}
              procedure={procedure}
              requirements={requirements}
            />
          </div>

          {/* Fees */}
          <div hidden={activeSection !== 'fees'}>
            <FeeCalculator
              key={`fees-${id}`}
              procedure={procedure}
            />
          </div>

          {/* Interactive application journey */}
          <div hidden={activeSection !== 'journey'}>
            <InteractiveGuide
              key={`journey-${id}`}
              procedure={procedure}
              steps={steps}
            />
          </div>

          {/* Official resources */}
          <div hidden={activeSection !== 'resources'}>

            <section className="rounded-[2rem] border border-white/70 bg-white/40 p-6 shadow-lg backdrop-blur-xl">

              <div className="flex items-center gap-4">

                <div
                  className="rounded-2xl p-3"
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.accent,
                  }}
                >
                  <ExternalLink size={26} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold tracking-widest opacity-60">
                    KNOW WHERE TO GO
                  </p>

                  <h2 className="mt-1 font-serif text-3xl">
                    Useful resources.
                  </h2>
                </div>

              </div>

              <p className="mt-4 text-sm opacity-70">
                Explore relevant websites, official portals
                and supporting information.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {resources.map(resource => (
                  <a
                    key={resource.resource_id}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-3xl border border-white/70 bg-white/50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >

                    <div className="flex items-center justify-between">

                      <div
                        className="rounded-xl p-3"
                        style={{
                          backgroundColor: theme.colors.secondary,
                        }}
                      >
                        <ExternalLink size={22} />
                      </div>

                      <ArrowUpRight
                        size={21}
                        className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                      />

                    </div>

                    <h3 className="mt-4 font-serif text-xl">
                      {resource.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed opacity-75">
                      {resource.description}
                    </p>

                    <p className="mt-4 text-xs font-semibold capitalize opacity-60">
                      {resource.resource_type}
                    </p>

                  </a>
                ))}

              </div>

              {!resources.length && (
                <p className="mt-5 text-sm opacity-60">
                  No additional resources have been added yet.
                </p>
              )}

              {procedure.official_link && (
                <a
                  href={procedure.official_link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn mt-6 rounded-full border-0 normal-case text-white"
                  style={{
                    backgroundColor: theme.colors.dark,
                  }}
                >
                  Visit official portal
                  <ArrowUpRight size={17} />
                </a>
              )}

            </section>

          </div>

          {/* Section navigation */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">

            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => {
                setActiveSection(guideSections[activeIndex - 1].id)
                scrollToGuide()
              }}
              className="btn rounded-full border-white/70 bg-white/60 normal-case"
              style={{ color: theme.colors.dark }}
            >
              <ArrowLeft size={17} />
              Previous section
            </button>

            <span className="text-xs opacity-60">
              Section {activeIndex + 1} of {guideSections.length}
            </span>

            <button
              type="button"
              disabled={activeIndex === guideSections.length - 1}
              onClick={() => {
                setActiveSection(guideSections[activeIndex + 1].id)
                scrollToGuide()
              }}
              className="btn rounded-full border-0 normal-case text-white shadow-md"
              style={{ backgroundColor: theme.colors.dark }}
            >
              Next section
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

        {/* Complete original written guide */}
        {mode === 'written' && (
          <div className="mt-7">
            <WrittenGuide
              procedure={procedure}
              requirements={requirements}
              steps={steps}
              resources={resources}
            />
          </div>
        )}

        {/* Start / Resume footer */}
        <footer
          className="relative mt-10 overflow-hidden rounded-[2rem] border border-white/60 p-7 shadow-lg md:p-10"
          style={{
            background: `linear-gradient(
              135deg,
              ${theme.colors.secondary},
              ${theme.colors.accent}
            )`,
          }}
        >

          <CategoryIcon
            size={200}
            strokeWidth={0.7}
            className="pointer-events-none absolute -bottom-12 -right-8 rotate-12 opacity-10"
          />

          <div className="relative">

            <Sparkles size={28} />

            <h2 className="mt-4 font-serif text-3xl md:text-4xl">
              Ready to make your move?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-80">
              Start tracking your application, organize your
              tasks and return whenever you need to continue.
              Take it one step at a time.
            </p>

            <button
              type="button"
              onClick={handleStartProcedure}
              disabled={starting}
              className="btn mt-6 rounded-full border-0 px-6 normal-case text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: theme.colors.dark,
              }}
            >
              {starting
                ? 'Starting...'
                : token
                  ? 'Start / Resume Procedure'
                  : 'Log in to track your procedure'}

              <ArrowRight size={18} />
            </button>

            {startError && (
              <p role="alert" className="mt-4 text-sm text-red-800">
                {startError}
              </p>
            )}

          </div>

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

export default ProcedureDetail