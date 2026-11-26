import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  ArrowLeft,
  Plus,
  Search,
  FolderOpen,
  X,
  SlidersHorizontal,
  CheckCircle,
} from 'lucide-react'

import { API_URL, useAuth } from '../context/AuthContext'

import DocumentHero from '../components/DocumentHub/DocumentHero'
import DocumentCard from '../components/DocumentHub/DocumentCard'
import DocumentForm from '../components/DocumentHub/DocumentForm'

import {
  documentTypes,
  matchesFilter,
  goldButton,
  blueButton,
  inputStyle,
  selectStyle,
} from '../components/DocumentHub/documentUtils'

import '../styles/DocumentHubAnimations.css'

export default function DocumentHub() {
  const { token } = useAuth()
  const location = useLocation()

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  const [form, setForm] = useState(
    location.state?.openForm
      ? { initialName: location.state?.documentName || '' }
      : null
  )

  const [preview, setPreview] = useState(null)

  const returnTo = location.state?.returnTo || '/dashboard'

  // API request helper
  async function request(endpoint = '', options = {}) {
    const response = await fetch(
      `${API_URL}/documents${endpoint}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong.')
    }

    return result
  }

  // Retrieve documents
  async function loadDocuments() {
    try {
      const result = await request()

      setDocuments(result.data || [])
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [token])

  // Automatically dismiss success messages
  useEffect(() => {
    if (!notice) return

    const timer = setTimeout(() => setNotice(''), 4000)

    return () => clearTimeout(timer)
  }, [notice])

  // Clean up temporary preview URLs
  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url)
      }
    }
  }, [preview])

  // Add or edit a document
  async function saveDocument(data, id) {
    if (id) {
      await request(`/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      setNotice('Document updated successfully.')
    } else {
      await request('/upload', {
        method: 'POST',
        body: data,
      })

      setNotice('Document added successfully.')

      setSearch('')
      setCategory('all')
      setFilter('all')
    }

    setForm(null)
    await loadDocuments()
  }

  // Delete a document
  async function deleteDocument(id) {
    const confirmed = window.confirm(
      'Delete this document and its attachment? This cannot be undone.'
    )

    if (!confirmed) return

    try {
      await request(`/${id}`, {
        method: 'DELETE',
      })

      setNotice('Document deleted successfully.')
      await loadDocuments()
    } catch (err) {
      setError(err.message)
    }
  }

  // Preview or download an attachment
  async function openFile(doc, download = false) {
    try {
      setError('')

      const response = await fetch(
        `${API_URL}/documents/${doc.document_id}/file`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Unable to retrieve the attachment.')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      if (download) {
        const extension = doc.file_path
          .split('.')
          .pop()

        const link = window.document.createElement('a')

        link.href = url
        link.download = `${doc.document_name}.${extension}`

        window.document.body.appendChild(link)
        link.click()
        link.remove()

        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } else {
        setPreview({
          url,
          type: blob.type,
          name: doc.document_name,
        })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Overview card filtering
  function handleFilter(value) {
    setFilter(value)
    setSearch('')
    setCategory('all')

    window.document
      .getElementById('document-collection')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

  // Include existing custom categories
  const categories = [
    ...new Set([
      ...documentTypes,
      ...documents.map(doc => doc.document_type || 'Other'),
    ]),
  ]

  // Search and filter
  const filteredDocuments = documents.filter(doc => {
    const query = search.trim().toLowerCase()

    const searchableText = [
      doc.document_name,
      doc.document_type,
      doc.notes,
    ].join(' ').toLowerCase()

    const matchesSearch = searchableText.includes(query)

    const matchesCategory =
      category === 'all' ||
      (doc.document_type || 'Other') === category

    return (
      matchesSearch &&
      matchesCategory &&
      matchesFilter(doc, filter)
    )
  })

  // Sort the filtered collection
  filteredDocuments.sort((a, b) => {
    if (sort === 'name') {
      return a.document_name.localeCompare(b.document_name)
    }

    if (sort === 'expiry') {
      const first = a.expiry_date
        ? new Date(a.expiry_date).getTime()
        : Infinity

      const second = b.expiry_date
        ? new Date(b.expiry_date).getTime()
        : Infinity

      if (first === second) return 0

      return first - second
    }

    return b.document_id - a.document_id
  })

  const filterLabels = {
    all: 'All documents',
    expiring: 'Expiring soon',
    attached: 'Attached files',
    expired: 'Expired documents',
  }

  const hasFilters =
    search !== '' ||
    category !== 'all' ||
    filter !== 'all'

  function clearFilters() {
    setSearch('')
    setCategory('all')
    setFilter('all')
  }

  return (
    <main className="min-h-screen bg-[#F5F0E9] text-[#112250]">

      <div className="min-h-screen bg-[radial-gradient(circle_at_center,#1122500b_1px,transparent_1px)] bg-[length:8px_8px] px-5 py-8 md:px-10 lg:pr-24">

        <div className="mx-auto max-w-7xl">

          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">

            <Link
              to={returnTo}
              className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:-translate-x-1"
            >
              <ArrowLeft size={18} />

              {returnTo === '/dashboard'
                ? 'Back to dashboard'
                : 'Return to procedure'}
            </Link>

            <span className="hidden text-[10px] tracking-[0.2em] opacity-60 sm:block">
              UNCOMPLICATED / DOCUMENT HUB
            </span>

          </div>

          {/* Hero and interactive overview */}
          <DocumentHero
            documents={documents}
            activeFilter={filter}
            onFilter={handleFilter}
            onAdd={() => setForm({})}
          />

          {/* Success message */}
          {notice && (
            <div
              role="status"
              className="alert mt-6 border border-green-200 bg-green-50 text-green-800 shadow-sm"
            >
              <CheckCircle size={20} />

              <span>{notice}</span>

              <button
                type="button"
                aria-label="Dismiss message"
                onClick={() => setNotice('')}
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div role="alert" className="alert alert-error mt-6">
              <span>{error}</span>

              <button
                type="button"
                aria-label="Dismiss error"
                onClick={() => setError('')}
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Document collection */}
          <section
            id="document-collection"
            className="mt-10 scroll-mt-8"
          >

            {/* Collection heading */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

              <div>
                <p className="text-[10px] tracking-[0.25em] text-[#3C507D]">
                  YOUR PERSONAL COLLECTION
                </p>

                <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                  Your documents.
                </h2>

                <p className="mt-2 text-sm opacity-60">
                  Everything important, right where you need it.
                </p>
              </div>

              <button
                type="button"
                className={blueButton}
                onClick={() => setForm({})}
              >
                <Plus size={18} />
                New document
              </button>

            </div>

            {/* Search and sorting */}
            <div className="rounded-3xl border border-white/70 bg-white/40 p-4 shadow-sm backdrop-blur-xl">

              <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">

                <div className="relative">

                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 opacity-50"
                  />

                  <input
                    type="search"
                    aria-label="Search documents"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Search your documents..."
                    className={`${inputStyle} pl-11`}
                  />

                </div>

                <select
                  aria-label="Filter by category"
                  value={category}
                  onChange={event => setCategory(event.target.value)}
                  className={selectStyle}
                >
                  <option value="all">All categories</option>

                  {categories.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Sort documents"
                  value={sort}
                  onChange={event => setSort(event.target.value)}
                  className={selectStyle}
                >
                  <option value="newest">Newest first</option>
                  <option value="name">Name: A–Z</option>
                  <option value="expiry">Expiry date</option>
                </select>

              </div>

              {/* Status filter pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2">

                <SlidersHorizontal
                  size={16}
                  className="mr-1 opacity-50"
                />

                {Object.entries(filterLabels).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300
                      ${filter === value
                        ? 'border-[#112250] bg-[#112250] text-[#F5F0E9] shadow-md'
                        : 'border-[#D9CBC2] bg-white/50 hover:bg-[#E0C58F]/40'
                      }`}
                  >
                    {label}
                  </button>
                ))}

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="ml-auto flex items-center gap-1 text-xs hover:underline"
                  >
                    <X size={14} />
                    Clear filters
                  </button>
                )}

              </div>

            </div>

            {/* Collection count */}
            <div className="my-5 flex items-center justify-between text-xs opacity-70">

              <span>
                {filterLabels[filter]}
              </span>

              <span>
                Showing {filteredDocuments.length} of {documents.length}
              </span>

            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg" />
              </div>
            )}

            {/* Empty collection */}
            {!loading && !error && documents.length === 0 && (
              <div className="rounded-3xl border border-white/70 bg-white/40 p-10 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E0C58F]/40">
                  <FolderOpen size={36} strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-2xl">
                  A little room for everything.
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm opacity-60">
                  Start your personal collection by adding your
                  first important document.
                </p>

                <button
                  type="button"
                  className={`${goldButton} mt-5`}
                  onClick={() => setForm({})}
                >
                  <Plus size={18} />
                  Add your first document
                </button>

              </div>
            )}

            {/* No matching results */}
            {!loading &&
              !error &&
              documents.length > 0 &&
              filteredDocuments.length === 0 && (

                <div className="rounded-3xl border border-[#D9CBC2] bg-white/40 p-10 text-center">

                  <Search
                    size={30}
                    className="mx-auto mb-3 opacity-40"
                  />

                  <h3 className="font-serif text-xl">
                    No matching documents
                  </h3>

                  <p className="mt-2 text-sm opacity-60">
                    Try another search or change your filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className={`${blueButton} btn-sm mt-4`}
                  >
                    Clear filters
                  </button>

                </div>
              )}

            {/* Document cards */}
            {!loading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {filteredDocuments.map((doc, index) => (
                  <DocumentCard
                    key={doc.document_id}
                    document={doc}
                    index={index}
                    onEdit={document => setForm({ document })}
                    onDelete={deleteDocument}
                    onOpen={openFile}
                  />
                ))}

              </div>
            )}

          </section>

          {/* Add and edit modal */}
          {form && (
            <DocumentForm
              document={form.document}
              initialName={form.initialName}
              onSave={saveDocument}
              onClose={() => setForm(null)}
            />
          )}

          {/* File preview modal */}
          {preview && (
            <div
              className="modal modal-open"
              role="dialog"
              aria-modal="true"
              aria-label="Document preview"
            >

              <div className="modal-box max-w-5xl rounded-3xl bg-[#F5F0E9] p-0 text-[#112250]">

                <div className="flex items-center justify-between gap-4 bg-gradient-to-br from-[#112250] to-[#3C507D] p-5 text-[#F5F0E9]">

                  <div className="min-w-0">
                    <p className="text-[10px] tracking-widest text-[#E0C58F]">
                      DOCUMENT PREVIEW
                    </p>

                    <h3 className="mt-1 break-words font-serif text-2xl">
                      {preview.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    aria-label="Close preview"
                    onClick={() => setPreview(null)}
                    className="btn btn-circle btn-sm shrink-0 border-white/30 bg-white/10 text-white"
                  >
                    <X size={18} />
                  </button>

                </div>

                <div className="p-4">

                  {preview.type.includes('pdf') ? (
                    <iframe
                      src={preview.url}
                      title={preview.name}
                      className="h-[65vh] w-full rounded-2xl border border-[#D9CBC2]"
                    />
                  ) : (
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="mx-auto max-h-[65vh] max-w-full rounded-2xl object-contain"
                    />
                  )}

                </div>

              </div>

              <button
                type="button"
                className="modal-backdrop"
                aria-label="Close document preview"
                onClick={() => setPreview(null)}
              />

            </div>
          )}

        </div>

      </div>

    </main>
  )
}