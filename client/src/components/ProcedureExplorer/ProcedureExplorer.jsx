import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
  Compass,
  Sparkles,
  Layers3,
  BookOpen,
  X,
  CheckCircle2,
  Map,
} from 'lucide-react'

import CategoryCard from '../Procedures/CategoryCard'
import ProcedureCard from '../Procedures/ProcedureCard'
import { getCategoryTheme } from '../Procedures/categoryThemes'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ProcedureExplorer() {
  const [categories, setCategories] = useState([])
  const [procedures, setProcedures] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const resultsRef = useRef(null)
  const categoriesRef = useRef(null)

  // Load categories and all published procedures
  useEffect(() => {
    const controller = new AbortController()

    async function loadData() {
      try {
        setLoading(true)
        setError('')

        const [categoryResponse, procedureResponse] =
          await Promise.all([
            fetch(`${API_URL}/categories`, {
              signal: controller.signal,
            }),
            fetch(`${API_URL}/procedures`, {
              signal: controller.signal,
            }),
          ])

        if (!categoryResponse.ok || !procedureResponse.ok) {
          throw new Error('Could not load the procedure library.')
        }

        const categoryResult = await categoryResponse.json()
        const procedureResult = await procedureResponse.json()

        setCategories(categoryResult.data || [])
        setProcedures(procedureResult.data || [])
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

    loadData()

    return () => controller.abort()
  }, [])

  const selectedCategory = categories.find(
    category => Number(category.category_id) === Number(selectedId)
  )

  const theme = getCategoryTheme(selectedId)
  const ThemeIcon = theme.icon

  const isSearching = search.trim().length > 0

  // Search across all procedures or within a category
  const filteredProcedures = procedures.filter(procedure => {
    const matchesCategory =
      selectedId === null ||
      Number(procedure.category_id) === Number(selectedId)

    const searchableText = [
      procedure.title,
      procedure.description,
      categories.find(
        category =>
          Number(category.category_id) ===
          Number(procedure.category_id)
      )?.category_name,
    ]
      .join(' ')
      .toLowerCase()

    return (
      matchesCategory &&
      searchableText.includes(search.trim().toLowerCase())
    )
  })

  function scrollToResults() {
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  function selectCategory(id) {
    setSelectedId(id)
    setSearch('')
    scrollToResults()
  }

  function clearSelection() {
    setSelectedId(null)
    setSearch('')
  }

  function handleSearch(event) {
    setSearch(event.target.value)
    setSelectedId(null)
  }

  function browseCategories() {
    categoriesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden transition-colors duration-700"
      style={{
        backgroundColor: selectedId
          ? theme.colors.background
          : '#F5F0E9',
        color: selectedId
          ? theme.colors.dark
          : '#112250',
      }}
    >

      {/* Ambient background */}
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[450px] w-[450px] rounded-full opacity-20 blur-[100px] transition-colors duration-700"
        style={{ backgroundColor: theme.colors.accent }}
      />

      <div
        className="pointer-events-none absolute -left-40 top-[500px] h-[400px] w-[400px] rounded-full opacity-10 blur-[100px] transition-colors duration-700"
        style={{ backgroundColor: theme.colors.primary }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,#11225012_1px,transparent_1px)] bg-[length:9px_9px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-6 md:px-10 lg:pr-24">

        {/* Navigation */}
        <header className="flex items-center justify-between gap-4">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl font-serif text-3xl text-white shadow-lg transition-colors duration-500"
              style={{ backgroundColor: theme.colors.dark }}
            >
              u.
            </span>

            <span className="hidden text-xs font-semibold tracking-[0.2em] sm:block">
              UNCOMPLICATED
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2.5 text-xs font-medium shadow-sm backdrop-blur-xl transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

        </header>

        {/* Main introduction */}
        <section className="grid items-center gap-8 py-12 md:grid-cols-[1.2fr_1fr] md:py-16">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-lg">

              <Compass size={16} />

              <span className="text-[10px] font-semibold tracking-[0.2em]">
                YOUR NEXT STEP STARTS HERE
              </span>

            </div>

            <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
              Find your way.
              <br />

              <em
                className="transition-colors duration-700"
                style={{ color: theme.colors.primary }}
              >
                One step
                <br />
                at a time.
              </em>

            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed opacity-75 md:text-base">
              Life comes with complicated processes.
              Discover what you need, understand where to begin,
              and move forward with a little more confidence.
            </p>

            <button
              type="button"
              onClick={browseCategories}
              className="btn mt-6 rounded-full border-white/30 px-6 normal-case text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${theme.colors.primary},
                  ${theme.colors.dark}
                )`,
              }}
            >
              Explore your options
              <ArrowRight size={18} />
            </button>

          </div>

          {/* Interactive hero artwork */}
          <div className="group relative flex min-h-[300px] items-center justify-center">

            <div
              className="absolute h-64 w-64 rounded-full border opacity-30 transition-all duration-700 group-hover:scale-110"
              style={{ borderColor: theme.colors.primary }}
            />

            <div
              className="absolute h-80 w-80 max-w-full rounded-full border border-dashed opacity-20 transition-transform duration-700 group-hover:rotate-45"
              style={{ borderColor: theme.colors.primary }}
            />

            <div
              className="absolute h-56 w-56 rounded-full opacity-30 blur-3xl"
              style={{ backgroundColor: theme.colors.accent }}
            />

            {/* Background guide card */}
            <div className="absolute left-[10%] top-8 h-40 w-32 -rotate-12 rounded-3xl border border-white/70 bg-white/40 p-5 shadow-xl backdrop-blur-xl transition-all duration-700 group-hover:-rotate-[20deg]">

              <BookOpen size={30} strokeWidth={1.4} />

              <p className="mt-4 text-[10px] tracking-widest">
                UNDERSTAND
              </p>

              <div className="mt-3 space-y-2">
                <div className="h-1 w-full rounded-full bg-current opacity-20" />
                <div className="h-1 w-3/4 rounded-full bg-current opacity-10" />
              </div>

            </div>

            {/* Main navigation card */}
            <div
              className="relative z-10 flex h-52 w-44 rotate-6 flex-col items-center justify-center rounded-[2rem] border border-white/40 text-white shadow-2xl transition-all duration-700 group-hover:-translate-y-3 group-hover:rotate-0"
              style={{
                background: `linear-gradient(
                  145deg,
                  ${theme.colors.primary},
                  ${theme.colors.dark}
                )`,
              }}
            >

              <ThemeIcon
                size={65}
                strokeWidth={1.2}
                style={{ color: theme.colors.accent }}
              />

              <p className="mt-5 text-[10px] tracking-[0.25em]">
                YOUR JOURNEY
              </p>

              <p className="mt-2 font-serif text-xl">
                Starts here.
              </p>

            </div>

            {/* Floating milestone card */}
            <div className="absolute bottom-6 right-[5%] z-20 rotate-6 rounded-2xl border border-white/70 bg-white/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-700 group-hover:translate-x-2 group-hover:rotate-12">

              <div className="flex items-center gap-3">

                <div
                  className="rounded-full p-2"
                  style={{
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.dark,
                  }}
                >
                  <CheckCircle2 size={23} />
                </div>

                <div>
                  <p className="text-[10px] opacity-60">
                    ONE STEP CLOSER
                  </p>

                  <p className="text-xs font-semibold">
                    You've got this.
                  </p>
                </div>

              </div>

            </div>

            <Sparkles
              size={28}
              className="absolute right-10 top-5 motion-safe:animate-pulse"
              style={{ color: theme.colors.primary }}
            />

          </div>

        </section>

        {/* Library overview */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">

          {[
            {
              icon: Layers3,
              value: categories.length,
              label: 'Areas of life',
            },
            {
              icon: BookOpen,
              value: procedures.length,
              label: 'Available guides',
            },
            {
              icon: Map,
              value: '01',
              label: 'Step at a time',
            },
          ].map(({ icon: Icon, value, label }, index) => (
            <div
              key={label}
              className={`flex items-center gap-4 rounded-2xl border border-white/70 bg-white/40 p-4 shadow-sm backdrop-blur-xl ${
                index === 2 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >

              <div
                className="rounded-xl p-3"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.dark,
                }}
              >
                <Icon size={22} />
              </div>

              <div>
                <p className="font-serif text-2xl">
                  {String(value).padStart(2, '0')}
                </p>

                <p className="text-xs opacity-60">
                  {label}
                </p>
              </div>

            </div>
          ))}

        </div>

        {/* Global search */}
        <form
          onSubmit={event => {
            event.preventDefault()
            scrollToResults()
          }}
          className="mb-12 flex flex-wrap items-center gap-3 rounded-3xl border border-white/80 bg-white/50 p-3 shadow-lg backdrop-blur-xl"
        >

          <div className="relative min-w-[200px] flex-1">

            <Search
              size={21}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
            />

            <input
              type="search"
              aria-label="Search all procedures"
              placeholder="What do you need help with?"
              value={search}
              onChange={handleSearch}
              className="input w-full border-0 bg-transparent pl-12 text-sm outline-none focus:outline-none"
              style={{ color: theme.colors.dark }}
            />

          </div>

          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch('')}
              className="btn btn-circle btn-ghost btn-sm"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="submit"
            className="btn rounded-2xl border-0 px-6 normal-case text-white"
            style={{ backgroundColor: theme.colors.dark }}
          >
            Find a guide
            <ArrowRight size={17} />
          </button>

        </form>

        {/* Error state */}
        {error && (
          <div role="alert" className="alert alert-error mb-8">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {/* Categories */}
        {!loading && !error && (
          <section
            ref={categoriesRef}
            className="scroll-mt-8"
          >

            <div className="mb-7">

              <p className="text-[10px] font-semibold tracking-[0.25em] opacity-60">
                EXPLORE YOUR WORLD
              </p>

              <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                What brings you here?
              </h2>

              <p className="mt-2 text-sm opacity-65">
                Five areas of life. Find the one that fits your needs.
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">

              {categories.map((category, index) => (
                <div
                  key={category.category_id}
                  className={`${
                    index < 3
                      ? 'lg:col-span-2'
                      : 'lg:col-span-3'
                  } ${
                    index === 4 ? 'sm:col-span-2' : ''
                  }`}
                >

                  <CategoryCard
                    category={category}
                    selected={
                      Number(selectedId) ===
                      Number(category.category_id)
                    }
                    onSelect={selectCategory}
                  />

                </div>
              ))}

            </div>

          </section>
        )}

        {/* Procedure results */}
        {!loading && !error && (
          <section
            ref={resultsRef}
            className="mt-14 scroll-mt-8 pb-16"
          >

            {/* Selected category banner */}
            {selectedCategory && (
              <div
                className="relative isolate mb-8 overflow-hidden rounded-[2rem] border border-white/30 p-7 text-white shadow-xl md:p-10"
                style={{
                  background: `linear-gradient(
                    135deg,
                    ${theme.colors.dark},
                    ${theme.colors.primary}
                  )`,
                }}
              >

                <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#ffffff40_1px,transparent_1px)] bg-[length:8px_8px]" />

                <ThemeIcon
                  size={180}
                  strokeWidth={0.7}
                  className="pointer-events-none absolute -bottom-10 right-4 rotate-12 opacity-10"
                />

                <div className="relative">

                  <div className="flex items-center justify-between gap-4">

                    <span
                      className="text-[10px] tracking-[0.25em]"
                      style={{ color: theme.colors.accent }}
                    >
                      {theme.mood}
                    </span>

                    <button
                      type="button"
                      onClick={clearSelection}
                      className="btn btn-sm rounded-full border-white/20 bg-white/10 normal-case text-white"
                    >
                      <X size={15} />
                      Clear selection
                    </button>

                  </div>

                  <h2 className="mt-5 font-serif text-3xl md:text-5xl">
                    {selectedCategory.category_name}
                  </h2>

                  <p
                    className="mt-3 text-sm font-medium"
                    style={{ color: theme.colors.accent }}
                  >
                    {theme.tagline}
                  </p>

                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
                    {selectedCategory.description}
                  </p>

                </div>

              </div>
            )}

            {/* Results heading */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

              <div>

                <p className="text-[10px] tracking-[0.25em] opacity-60">
                  YOUR NEXT MOVE
                </p>

                <h2 className="mt-2 font-serif text-3xl">

                  {isSearching
                    ? 'Search results'
                    : selectedCategory
                      ? 'Explore these guides.'
                      : 'All available guides.'}

                </h2>

                <p className="mt-2 text-sm opacity-65">
                  {filteredProcedures.length} guides available
                </p>

              </div>

              {(selectedId !== null || isSearching) && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="btn btn-sm rounded-full border-white/70 bg-white/50 normal-case shadow-sm"
                  style={{ color: theme.colors.dark }}
                >
                  View all guides
                  <ArrowUpRight size={15} />
                </button>
              )}

            </div>

            {/* Category-specific search */}
            {selectedCategory && (
              <div className="relative mb-6">

                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
                />

                <input
                  type="search"
                  aria-label="Search within selected category"
                  placeholder={`Search ${selectedCategory.category_name}...`}
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  className="input w-full rounded-2xl border-white/70 bg-white/50 pl-11 shadow-sm backdrop-blur-lg"
                  style={{ color: theme.colors.dark }}
                />

              </div>
            )}

            {/* Procedure cards */}
            {filteredProcedures.length > 0 ? (

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {filteredProcedures.map((procedure, index) => (
                  <ProcedureCard
                    key={procedure.procedure_id}
                    procedure={procedure}
                    categoryId={procedure.category_id}
                    index={index}
                  />
                ))}

              </div>

            ) : (

              <div className="rounded-3xl border border-white/70 bg-white/40 p-12 text-center shadow-sm">

                <Search
                  size={36}
                  className="mx-auto opacity-40"
                />

                <h3 className="mt-4 font-serif text-2xl">
                  No matching guides
                </h3>

                <p className="mt-2 text-sm opacity-60">
                  Try a different search or explore another category.
                </p>

                <button
                  type="button"
                  onClick={clearSelection}
                  className="btn mt-5 rounded-full border-0 normal-case text-white"
                  style={{ backgroundColor: theme.colors.dark }}
                >
                  Explore all procedures
                </button>

              </div>

            )}

          </section>
        )}

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-current/10 py-6">

          <p className="font-serif text-lg">
            Life, a little less complicated.
          </p>

          <span className="text-[10px] tracking-widest opacity-50">
            UNCOMPLICATED
          </span>

        </footer>

      </div>

    </main>
  )
}