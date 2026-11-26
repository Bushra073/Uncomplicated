import { useEffect, useRef, useState } from 'react'
import { Bookmark, X, Save, Link2 } from 'lucide-react'

export const resourceTypes = [
  'Website',
  'Article',
  'Video',
  'Reel',
  'Tutorial',
  'Other',
]

export const resourceCategories = [
  'Education',
  'Career',
  'Government',
  'Legal',
  'Business',
  'Personal',
  'Technology',
  'Other',
]

export default function ResourceForm({
  resource,
  collections = [],
  procedures = [],
  initialCollection = '',
  onSave,
  onClose,
}) {
  const dialogRef = useRef(null)

  const [form, setForm] = useState({
    title: resource?.title || '',
    url: resource?.url || '',
    resource_type: resource?.resource_type || 'Website',
    category: resource?.category || 'Other',
    tags: resource?.tags || '',
    notes: resource?.notes || '',
    collection_id:
      resource?.collection_id || initialCollection || '',
    procedure_id: resource?.procedure_id || '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const inputStyle =
    'input input-bordered w-full rounded-xl border-[#7768AE]/20 bg-white/70 text-[#29263D]'

  const selectStyle =
    'select select-bordered w-full rounded-xl border-[#7768AE]/20 bg-white/70 text-[#29263D]'

  function update(field, value) {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Please enter a title.')
      return
    }

    try {
      const parsed = new URL(form.url.trim())

      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error()
      }
    } catch {
      setError('Please enter a valid website URL.')
      return
    }

    try {
      setSaving(true)

      await onSave(
        {
          ...form,
          title: form.title.trim(),
          url: form.url.trim(),
          collection_id: form.collection_id || null,
          procedure_id: form.procedure_id || null,
        },
        resource?.resource_id || null
      )

    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onCancel={event => {
        event.preventDefault()
        if (!saving) onClose()
      }}
    >

      <div className="modal-box max-w-2xl rounded-[2rem] bg-[#F5EBDD] p-6 text-[#29263D] shadow-2xl">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-[#29263D] p-3 text-[#D9EDAD]">
              <Bookmark size={24} />
            </div>

            <div>
              <h2 className="font-serif text-3xl">
                {resource ? 'Edit resource' : 'Save something useful.'}
              </h2>

              <p className="mt-1 text-xs opacity-65">
                Keep it somewhere you can find it again.
              </p>
            </div>

          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm"
            aria-label="Close form"
          >
            <X size={21} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          <label className="block text-sm font-medium">
            Resource title *

            <input
              required
              maxLength={255}
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="e.g. IELTS speaking tips"
              className={`${inputStyle} mt-2`}
            />
          </label>

          <label className="block text-sm font-medium">
            <span className="flex items-center gap-2">
              <Link2 size={16} />
              Resource URL *
            </span>

            <input
              required
              type="url"
              value={form.url}
              onChange={e => update('url', e.target.value)}
              placeholder="https://..."
              className={`${inputStyle} mt-2`}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">

            <label className="text-sm font-medium">
              Content type

              <select
                value={form.resource_type}
                onChange={e =>
                  update('resource_type', e.target.value)
                }
                className={`${selectStyle} mt-2`}
              >
                {resourceTypes.map(type => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Category

              <select
                value={form.category}
                onChange={e =>
                  update('category', e.target.value)
                }
                className={`${selectStyle} mt-2`}
              >
                {resourceCategories.map(category => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Collection

              <select
                value={form.collection_id}
                onChange={e =>
                  update('collection_id', e.target.value)
                }
                className={`${selectStyle} mt-2`}
              >
                <option value="">No collection</option>

                {collections.map(collection => (
                  <option
                    key={collection.collection_id}
                    value={collection.collection_id}
                  >
                    {collection.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Link to a procedure

              <select
                value={form.procedure_id}
                onChange={e =>
                  update('procedure_id', e.target.value)
                }
                className={`${selectStyle} mt-2`}
              >
                <option value="">No linked procedure</option>

                {procedures.map(procedure => (
                  <option
                    key={procedure.procedure_id}
                    value={procedure.procedure_id}
                  >
                    {procedure.title}
                  </option>
                ))}
              </select>
            </label>

          </div>

          <label className="block text-sm font-medium">
            Tags

            <input
              maxLength={500}
              value={form.tags}
              onChange={e => update('tags', e.target.value)}
              placeholder="IELTS, scholarship, speaking"
              className={`${inputStyle} mt-2`}
            />

            <span className="mt-1 block text-xs opacity-60">
              Separate tags using commas.
            </span>
          </label>

          <label className="block text-sm font-medium">
            Personal notes

            <textarea
              rows={3}
              maxLength={5000}
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Why is this resource worth saving?"
              className="textarea textarea-bordered mt-2 w-full rounded-xl border-[#7768AE]/20 bg-white/70 text-[#29263D]"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-100 p-3 text-sm text-red-800"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="btn rounded-full border-white/80 bg-white/60 normal-case text-[#29263D]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn rounded-full border-0 bg-[#29263D] normal-case text-white"
            >
              {saving
                ? <span className="loading loading-spinner loading-sm" />
                : <Save size={18} />}

              {saving ? 'Saving...' : 'Save resource'}
            </button>

          </div>

        </form>

      </div>

    </dialog>
  )
}