import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ArrowLeft,
  Search,
  Plus,
  FolderOpen,
  Bookmark,
  Heart,
  Pencil,
  Trash2,
  X,
  LibraryBig,
} from 'lucide-react'

import { API_URL, useAuth } from '../context/AuthContext'

import ShelfHero from '../components/KnowledgeShelf/ShelfHero'
import ResourceCard from '../components/KnowledgeShelf/ResourceCard'

import ResourceForm, {
  resourceTypes,
  resourceCategories,
} from '../components/KnowledgeShelf/ResourceForm'

import '../styles/ProcedureAnimations.css'

export default function KnowledgeShelf() {
  const { token } = useAuth()
  const contentRef = useRef(null)

  const [resources, setResources] = useState([])
  const [collections, setCollections] = useState([])
  const [procedures, setProcedures] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')
  const [filter, setFilter] = useState('all')
  const [collectionId, setCollectionId] = useState('all')
  const [sort, setSort] = useState('newest')

  const [form, setForm] = useState(null)

  const [collectionForm, setCollectionForm] = useState(null)
  const [collectionName, setCollectionName] = useState('')
  const [savingCollection, setSavingCollection] = useState(false)
  const [collectionError, setCollectionError] = useState('')

  const [busy, setBusy] = useState(false)

  // API helper
  async function request(endpoint, options = {}) {
    const response = await fetch(
      `${API_URL}/knowledge${endpoint}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }
    )

    const result = await response.json().catch(() => ({}))

    if (!response.ok || result.status !== 'success') {
      throw new Error(
        result.message || 'Something went wrong.'
      )
    }

    return result
  }

  // Retrieve resources and collections
  async function loadShelf() {
    const [resourceResult, collectionResult] =
      await Promise.all([
        request('/resources'),
        request('/collections'),
      ])

    setResources(resourceResult.data)
    setCollections(collectionResult.data)
  }

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true)
        setError('')

        await loadShelf()

        try {
          const response = await fetch(
            `${API_URL}/procedures`
          )

          const result = await response.json()

          if (response.ok && result.status === 'success') {
            setProcedures(result.data || [])
          }
        } catch {
          // Resources can still be saved without a procedure.
          setProcedures([])
        }

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) loadPage()
  }, [token])

  // Automatically dismiss success messages
  useEffect(() => {
    if (!notice) return

    const timer = setTimeout(() => {
      setNotice('')
    }, 4000)

    return () => clearTimeout(timer)
  }, [notice])

  // Save or edit a resource
  async function saveResource(data, id) {
    const result = await request(
      id ? `/resources/${id}` : '/resources',
      {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(data),
      }
    )

    setForm(null)
    setNotice(result.message)

    if (!id) {
      setFilter('all')
      setSearch('')
      setType('all')
      setCategory('all')
      setCollectionId('all')
    }

    try {
      await loadShelf()
    } catch {
      setError('Resource saved, but the shelf could not refresh.')
    }
  }

  // Toggle favourite
  async function toggleFavourite(id) {
    if (busy) return

    try {
      setBusy(true)
      setError('')

      await request(`/resources/${id}/favourite`, {
        method: 'PATCH',
      })

      await loadShelf()

    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  // Delete resource
  async function deleteResource(id) {
    if (busy) return

    if (!window.confirm('Delete this saved resource?')) {
      return
    }

    try {
      setBusy(true)
      setError('')

      const result = await request(`/resources/${id}`, {
        method: 'DELETE',
      })

      setNotice(result.message)
      await loadShelf()

    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  // Create or rename a collection
  function openCollectionForm(collection = null) {
    setCollectionForm(collection || {})
    setCollectionName(collection?.name || '')
    setCollectionError('')
  }

  async function saveCollection(event) {
    event.preventDefault()

    if (!collectionName.trim()) return

    try {
      setSavingCollection(true)
      setCollectionError('')

      const id = collectionForm.collection_id

      const result = await request(
        id ? `/collections/${id}` : '/collections',
        {
          method: id ? 'PUT' : 'POST',
          body: JSON.stringify({
            name: collectionName.trim(),
          }),
        }
      )

      setCollectionForm(null)
      setNotice(result.message)

      try {
        await loadShelf()
      } catch {
        setError('Collection saved, but the shelf could not refresh.')
      }

    } catch (err) {
      setCollectionError(err.message)
    } finally {
      setSavingCollection(false)
    }
  }

  // Delete collection, preserve its resources
  async function deleteCollection(id) {
    if (busy) return

    if (!window.confirm(
      'Delete this collection? Your saved resources will remain safe.'
    )) {
      return
    }

    try {
      setBusy(true)
      setError('')

      const result = await request(`/collections/${id}`, {
        method: 'DELETE',
      })

      if (String(collectionId) === String(id)) {
        setCollectionId('all')
      }

      setNotice(result.message)
      await loadShelf()

    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function handleHeroFilter(value) {
    setFilter(value)
    setCollectionId('all')
    setSearch('')
    setType('all')
    setCategory('all')

    contentRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function clearFilters() {
    setSearch('')
    setType('all')
    setCategory('all')
    setFilter('all')
    setCollectionId('all')
  }

  // Search and filter resources
  const filteredResources = resources
    .filter(resource => {
      const query = search.trim().toLowerCase()

      const searchable = [
        resource.title,
        resource.url,
        resource.notes,
        resource.tags,
        resource.category,
        resource.collection_name,
        resource.procedure_title,
      ].filter(Boolean).join(' ').toLowerCase()

      const matchesSearch = searchable.includes(query)

      const matchesType =
        type === 'all' || resource.resource_type === type

      const matchesCategory =
        category === 'all' || resource.category === category

      const matchesFavourite =
        filter !== 'favourites' ||
        Boolean(resource.is_favourite)

      const matchesCollection =
        collectionId === 'all' ||
        String(resource.collection_id) === String(collectionId)

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesFavourite &&
        matchesCollection
      )
    })
    .sort((a, b) => {
      if (sort === 'name') {
        return a.title.localeCompare(b.title)
      }

      if (sort === 'oldest') {
        return a.resource_id - b.resource_id
      }

      return b.resource_id - a.resource_id
    })

  const inputStyle =
    'input input-bordered w-full rounded-xl border-white/80 bg-white/60 text-[#29263D]'

  const selectStyle =
    'select select-bordered w-full rounded-xl border-white/80 bg-white/60 text-[#29263D]'

  return (
    <main className="relative isolate min-h-screen overflow-x-clip bg-[#F5EBDD] text-[#29263D]">

      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,#29263D15_1px,transparent_1px)] bg-[length:10px_10px] opacity-30" />

      <div className="pointer-events-none absolute -right-40 top-96 -z-10 h-96 w-96 rounded-full bg-[#7768AE]/20 blur-[100px]" />

      <div className="pointer-events-none absolute -left-40 top-[800px] -z-10 h-96 w-96 rounded-full bg-[#E9B8A8]/40 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-8">

        {/* Navigation */}
        <nav className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

          <Link
            to="/"
            className="font-serif text-2xl"
          >
            uncomplicated.
          </Link>

          <span className="hidden items-center gap-2 text-xs opacity-70 sm:flex">
            <LibraryBig size={17} />
            Knowledge Shelf
          </span>

        </nav>

        <ShelfHero
          resources={resources}
          collections={collections}
          onAdd={() => setForm({})}
          onFilter={handleHeroFilter}
        />

        {/* Messages */}
        {notice && (
          <div
            role="status"
            className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-red-100 p-4 text-sm text-red-800"
          >
            {error}

            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Dismiss error"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Main shelf */}
        <div ref={contentRef} className="mt-9 scroll-mt-6">

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

            <div>
              <p className="text-[10px] font-semibold tracking-widest text-[#7768AE]">
                YOUR LITTLE LIBRARY
              </p>

              <h2 className="mt-2 font-serif text-4xl">
                Good things, gathered.
              </h2>

              <p className="mt-2 text-sm opacity-65">
                Find the things you saved when you need them.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setForm({})}
              className="btn rounded-full border-0 bg-[#29263D] normal-case text-white shadow-md"
            >
              <Plus size={18} />
              Save resource
            </button>

          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">

            {/* Sidebar */}
            <aside className="space-y-4 lg:sticky lg:top-6">

              <div className="rounded-3xl border border-white/80 bg-white/40 p-4 shadow-sm backdrop-blur-xl">

                <h3 className="mb-4 font-serif text-xl">
                  Your library
                </h3>

                {[
                  {
                    id: 'all',
                    label: 'All resources',
                    icon: Bookmark,
                  },
                  {
                    id: 'favourites',
                    label: 'Favourites',
                    icon: Heart,
                  },
                  {
                    id: 'collections',
                    label: 'Collections',
                    icon: FolderOpen,
                  },
                ].map(item => {
                  const Icon = item.icon

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleHeroFilter(item.id)}
                      className={`mb-2 flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm transition-all ${
                        filter === item.id &&
                        collectionId === 'all'
                          ? 'bg-[#29263D] text-[#F5EBDD]'
                          : 'hover:bg-white/70'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  )
                })}

              </div>

              {/* Collections */}
              <div className="rounded-3xl border border-white/80 bg-white/40 p-4 shadow-sm backdrop-blur-xl">

                <div className="flex items-center justify-between">

                  <h3 className="font-serif text-xl">
                    Collections
                  </h3>

                  <button
                    type="button"
                    title="New collection"
                    aria-label="New collection"
                    onClick={() => openCollectionForm()}
                    className="btn btn-circle btn-sm border-0 bg-[#D9EDAD] text-[#29263D]"
                  >
                    <Plus size={18} />
                  </button>

                </div>

                <div className="mt-4 space-y-2">

                  {collections.map(collection => (
                    <button
                      key={collection.collection_id}
                      type="button"
                      onClick={() => {
                        setCollectionId(collection.collection_id)
                        setFilter('all')
                        setSearch('')
                        setType('all')
                        setCategory('all')
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl p-3 text-left text-xs ${
                        String(collectionId) ===
                        String(collection.collection_id)
                          ? 'bg-[#7768AE] text-white'
                          : 'bg-white/40 hover:bg-white/80'
                      }`}
                    >
                      <FolderOpen size={17} className="shrink-0" />

                      <span className="min-w-0 flex-1 truncate">
                        {collection.name}
                      </span>

                      <span>{collection.resource_count}</span>
                    </button>
                  ))}

                  {!collections.length && (
                    <p className="text-xs leading-relaxed opacity-60">
                      Create a collection to group related resources.
                    </p>
                  )}

                </div>

              </div>

            </aside>

            {/* Main content */}
            <div className="min-w-0">

              {filter === 'collections' ? (

                <section>

                  <div className="mb-5 flex items-center justify-between gap-3">

                    <h3 className="font-serif text-2xl">
                      Your collections
                    </h3>

                    <button
                      type="button"
                      onClick={() => openCollectionForm()}
                      className="btn btn-sm rounded-full border-0 bg-[#29263D] normal-case text-white"
                    >
                      <Plus size={16} />
                      New collection
                    </button>

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {collections.map((collection, index) => (
                      <article
                        key={collection.collection_id}
                        className={`rounded-3xl border border-white/80 p-5 shadow-md transition-all hover:-translate-y-1 ${
                          index % 2 === 0
                            ? 'bg-[#E9B8A8]/50'
                            : 'bg-[#D9EDAD]/70'
                        }`}
                      >

                        <FolderOpen size={36} />

                        <h3 className="mt-4 break-words font-serif text-2xl">
                          {collection.name}
                        </h3>

                        <p className="mt-2 text-xs opacity-65">
                          {collection.resource_count} saved resources
                        </p>

                        <div className="mt-5 flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() => {
                              setCollectionId(collection.collection_id)
                              setFilter('all')
                              setSearch('')
                              setType('all')
                              setCategory('all')
                            }}
                            className="btn btn-sm flex-1 rounded-full border-0 bg-[#29263D] normal-case text-white"
                          >
                            Open collection
                          </button>

                          <button
                            type="button"
                            aria-label="Rename collection"
                            onClick={() =>
                              openCollectionForm(collection)
                            }
                            className="btn btn-circle btn-ghost btn-sm"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            aria-label="Delete collection"
                            onClick={() =>
                              deleteCollection(collection.collection_id)
                            }
                            className="btn btn-circle btn-ghost btn-sm text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </article>
                    ))}

                  </div>

                  {!collections.length && (
                    <div className="rounded-3xl border border-dashed border-[#7768AE]/40 p-10 text-center">

                      <FolderOpen
                        size={45}
                        className="mx-auto text-[#7768AE]"
                      />

                      <h3 className="mt-4 font-serif text-2xl">
                        Make a little collection.
                      </h3>

                      <p className="mt-2 text-sm opacity-65">
                        Group resources around a topic or goal.
                      </p>

                    </div>
                  )}

                </section>

              ) : (

                <>

                  {/* Search and filters */}
                  <div className="rounded-3xl border border-white/80 bg-white/40 p-4 shadow-sm backdrop-blur-xl">

                    <div className="relative">

                      <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7768AE]"
                      />

                      <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search titles, tags, notes..."
                        className={`${inputStyle} pl-12`}
                      />

                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3">

                      <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className={selectStyle}
                        aria-label="Filter by content type"
                      >
                        <option value="all">All content types</option>

                        {resourceTypes.map(item => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>

                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className={selectStyle}
                        aria-label="Filter by category"
                      >
                        <option value="all">All categories</option>

                        {resourceCategories.map(item => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>

                      <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        className={selectStyle}
                        aria-label="Sort resources"
                      >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="name">Name A–Z</option>
                      </select>

                    </div>

                  </div>

                  <div className="my-5 flex items-center justify-between gap-3">

                    <p className="text-sm opacity-70">
                      {filteredResources.length} resources
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-[#7768AE] hover:underline"
                    >
                      Clear filters
                    </button>

                  </div>

                  {loading ? (

                    <div className="py-16 text-center">
                      <span className="loading loading-ring loading-lg text-[#7768AE]" />

                      <p className="mt-3 text-sm">
                        Opening your shelf...
                      </p>
                    </div>

                  ) : filteredResources.length ? (

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                      {filteredResources.map((resource, index) => (
                        <ResourceCard
                          key={resource.resource_id}
                          resource={resource}
                          index={index}
                          onEdit={item =>
                            setForm({ resource: item })
                          }
                          onDelete={deleteResource}
                          onFavourite={toggleFavourite}
                        />
                      ))}

                    </div>

                  ) : (

                    <div className="rounded-3xl border border-dashed border-[#7768AE]/40 bg-white/30 p-10 text-center">

                      <Bookmark
                        size={48}
                        className="mx-auto text-[#7768AE]"
                      />

                      <h3 className="mt-5 font-serif text-3xl">
                        {resources.length
                          ? 'Nothing found.'
                          : 'Your shelf is waiting.'}
                      </h3>

                      <p className="mt-3 text-sm opacity-65">
                        {resources.length
                          ? 'Try changing your search or filters.'
                          : 'Save your first useful link and start building your personal library.'}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          resources.length
                            ? clearFilters()
                            : setForm({})
                        }
                        className="btn mt-5 rounded-full border-0 bg-[#29263D] normal-case text-white"
                      >
                        {resources.length
                          ? 'Clear filters'
                          : 'Save your first resource'}
                      </button>

                    </div>

                  )}

                </>

              )}

            </div>

          </div>

        </div>

        <footer className="mt-12 text-center">

          <p className="font-serif text-xl">
            uncomplicated.
          </p>

          <p className="mt-2 text-xs opacity-50">
            Good knowledge deserves a good home.
          </p>

        </footer>

      </div>

      {/* Save/edit resource modal */}
      {form && (
        <ResourceForm
          resource={form.resource}
          collections={collections}
          procedures={procedures}
          initialCollection={
            collectionId === 'all' ? '' : collectionId
          }
          onSave={saveResource}
          onClose={() => setForm(null)}
        />
      )}

      {/* Collection modal */}
      {collectionForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#29263D]/50 p-4 backdrop-blur-sm"
        >

          <form
            role="dialog"
            aria-modal="true"
            aria-label="Manage collection"
            onSubmit={saveCollection}
            className="w-full max-w-md rounded-3xl bg-[#F5EBDD] p-6 shadow-2xl"
          >

            <FolderOpen size={32} className="text-[#7768AE]" />

            <h2 className="mt-4 font-serif text-3xl">
              {collectionForm.collection_id
                ? 'Rename collection'
                : 'Create a collection'}
            </h2>

            <input
              required
              autoFocus
              maxLength={150}
              value={collectionName}
              onChange={e =>
                setCollectionName(e.target.value)
              }
              placeholder="e.g. Study abroad preparation"
              aria-label="Collection name"
              className={`${inputStyle} mt-5`}
            />

            {collectionError && (
              <p className="mt-3 text-sm text-red-700">
                {collectionError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">

              <button
                type="button"
                disabled={savingCollection}
                onClick={() => setCollectionForm(null)}
                className="btn rounded-full border-white/70 bg-white/60 normal-case text-[#29263D]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingCollection}
                className="btn rounded-full border-0 bg-[#29263D] normal-case text-white"
              >
                {savingCollection ? 'Saving...' : 'Save collection'}
              </button>

            </div>

          </form>

        </div>
      )}

    </main>
  )
}