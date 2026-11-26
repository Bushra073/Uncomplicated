
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Home,
  LogOut,
  UserRound,
  RefreshCw,
  AlertCircle,
  FolderOpen,
  ArrowUpRight,
  FileText,
} from 'lucide-react'

import { API_URL, useAuth } from '../context/AuthContext'

import DashboardHero from '../components/Dashboard/DashboardHero'
import DashboardProcedures from '../components/Dashboard/DashboardProcedures'
import DocumentReminders from '../components/Dashboard/DocumentReminders'
import RecentResources from '../components/Dashboard/RecentResources'

import '../styles/ProcedureAnimations.css'

function Dashboard() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const [documents, setDocuments] = useState([])
  const [procedures, setProcedures] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!token) return

    const controller = new AbortController()

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        async function getData(endpoint) {
          const response = await fetch(`${API_URL}${endpoint}`, {
            headers,
            signal: controller.signal,
          })

          const result = await response.json()

          if (!response.ok || result.status !== 'success') {
            throw new Error(
              result.message || `Could not load ${endpoint}`
            )
          }

          return result.data
        }

        const [documentData, procedureData, resourceData] =
          await Promise.all([
            getData('/documents'),
            getData('/my-procedures'),
            getData('/knowledge/resources'),
          ])

        if (!controller.signal.aborted) {
          setDocuments(documentData)
          setProcedures(procedureData)
          setResources(resourceData)
        }

      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => controller.abort()
  }, [token, refreshKey])

  function handleLogout() {
    logout()
    navigate('/')
  }

  const recentDocuments = [...documents]
    .sort((a, b) =>
      new Date(b.uploaded_at) - new Date(a.uploaded_at)
    )
    .slice(0, 3)

  return (
    <main className="relative min-h-screen bg-[#E4EBE6]
      text-[#193D39]">

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0
        bg-[radial-gradient(ellipse_at_top_left,#F8F5E9,transparent_50%)]" />

      <div className="pointer-events-none absolute right-0
        top-96 h-72 w-72 rounded-full bg-[#C9E879]/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]
        px-4 pb-12 sm:px-7 lg:px-12">

        {/* Navigation */}
        <header className="flex flex-wrap items-center
          justify-between gap-4 py-6">

          <Link to="/" className="flex items-center gap-3">

            <span className="flex h-10 w-10 items-center
              justify-center rounded-xl bg-[#16443F]
              font-serif text-2xl text-white shadow-md">
              u.
            </span>

            <span className="text-[10px] font-bold
              tracking-[0.18em]">
              UNCOMPLICATED
            </span>

          </Link>

          <div className="flex items-center gap-2">

            <Link
              to="/"
              aria-label="Home"
              className="btn btn-circle border-white
                bg-white/60 text-[#193D39] shadow-sm"
            >
              <Home size={18} />
            </Link>

            <div className="flex items-center gap-2
              rounded-full border border-white/80
              bg-white/50 p-1.5 pr-3 shadow-sm">

              <span className="flex h-9 w-9 items-center
                justify-center rounded-full bg-[#16443F]
                text-white">
                <UserRound size={18} />
              </span>

              <span className="hidden max-w-36 truncate
                text-xs font-medium sm:block">
                {user?.full_name || 'My account'}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
                className="rounded-full p-2 text-[#66847E]
                  transition-colors hover:bg-red-100
                  hover:text-red-600"
              >
                <LogOut size={17} />
              </button>

            </div>
          </div>
        </header>

        {/* Loading state */}
        {loading ? (
          <div className="flex min-h-[60vh] flex-col
            items-center justify-center gap-4">

            <span className="loading loading-spinner
              loading-lg text-[#397C76]" />

            <p className="text-sm text-[#66847E]">
              Getting your workspace ready...
            </p>

          </div>
        ) : error ? (

          /* Error state */
          <div className="mx-auto mt-16 max-w-lg rounded-3xl
            border border-white bg-white/60 p-8
            text-center shadow-lg">

            <AlertCircle
              size={38}
              className="mx-auto mb-4 text-red-500"
            />

            <h2 className="text-xl font-semibold">
              Couldn't load your workspace
            </h2>

            <p className="mt-3 text-sm text-[#66847E]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRefreshKey(key => key + 1)}
              className="btn mt-5 rounded-full border-none
                bg-[#193D39] text-white hover:bg-[#285C55]"
            >
              <RefreshCw size={16} />
              Try again
            </button>

          </div>

        ) : (
          <div className="space-y-6">

            {/* Welcome and statistics */}
            <DashboardHero
              user={user}
              documents={documents}
              procedures={procedures}
              resources={resources}
            />

            {/* Main dashboard layout */}
            <div className="grid items-start gap-6
              lg:grid-cols-[1.65fr_1fr]">

              {/* Left column */}
              <div className="min-w-0 space-y-6">

                <DashboardProcedures
                  procedures={procedures}
                  resources={resources}
                />

                {/* Recent documents */}
                <section className="rounded-[28px]
                  border border-white/80 bg-white/50
                  p-5 shadow-lg backdrop-blur-xl md:p-7">

                  <div className="mb-5 flex flex-wrap
                    items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="rounded-2xl border
                        border-white bg-[#DDECC5] p-3
                        text-[#527338]">
                        <FolderOpen size={23} />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold
                          tracking-[0.2em] text-[#66847E]">
                          KEEP THINGS TOGETHER
                        </p>

                        <h2 className="text-xl font-semibold">
                          Recent documents
                        </h2>
                      </div>

                    </div>

                    <Link
                      to="/documents"
                      className="flex items-center gap-2
                        rounded-full border border-white
                        bg-white/70 px-4 py-2 text-xs
                        font-medium shadow-sm hover:bg-white"
                    >
                      View all
                      <ArrowUpRight size={15} />
                    </Link>

                  </div>

                  {recentDocuments.length === 0 ? (
                    <div className="rounded-2xl border
                      border-dashed border-[#193D39]/20
                      p-6 text-center">

                      <FileText
                        size={32}
                        className="mx-auto mb-3 text-[#66847E]"
                      />

                      <p className="text-sm text-[#66847E]">
                        No documents saved yet.
                      </p>

                      <Link
                        to="/documents"
                        state={{ openForm: true }}
                        className="btn mt-4 rounded-full
                          border-none bg-[#193D39] text-white"
                      >
                        Add a document
                      </Link>

                    </div>
                  ) : (
                    <div className="space-y-3">

                      {recentDocuments.map(doc => (
                        <Link
                          key={doc.document_id}
                          to="/documents"
                          className="group flex items-center
                            gap-3 rounded-2xl border border-white
                            bg-white/60 p-4 transition-all
                            hover:bg-white hover:shadow-sm"
                        >

                          <div className="shrink-0 rounded-xl
                            bg-[#E2ECD5] p-3 text-[#527338]">
                            <FileText size={21} />
                          </div>

                          <div className="min-w-0 flex-1">

                            <h3 className="truncate text-sm
                              font-semibold">
                              {doc.document_name}
                            </h3>

                            <p className="mt-1 text-xs
                              text-[#66847E]">
                              {doc.document_type || 'Document'}
                            </p>

                            <p className="mt-1 text-[10px]
                              text-[#66847E]">
                              {doc.file_path
                                ? 'File attached'
                                : 'Document record'}
                            </p>

                          </div>

                          <ArrowUpRight
                            size={18}
                            className="shrink-0 text-[#66847E]
                              transition-transform
                              group-hover:-translate-y-1"
                          />

                        </Link>
                      ))}

                    </div>
                  )}
                </section>
              </div>

              {/* Right column */}
              <aside className="min-w-0 space-y-6">

                <DocumentReminders documents={documents} />

                <RecentResources resources={resources} />

              </aside>
            </div>

          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 flex flex-wrap items-center
          justify-between gap-3 border-t border-[#193D39]/10
          pt-6 text-xs text-[#66847E]">

          <span>Uncomplicated. Made for real life.</span>

          <span>Less chaos. More clarity. ✳</span>

        </footer>

      </div>
    </main>
  )
}

export default Dashboard
