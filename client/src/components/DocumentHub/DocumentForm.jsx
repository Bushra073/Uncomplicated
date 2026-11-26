import { useEffect, useRef, useState } from 'react'
import {
  X,
  UploadCloud,
  FileText,
  Check,
  Save,
  Paperclip,
} from 'lucide-react'

import {
  documentTypes,
  emptyForm,
  dateOnly,
  inputStyle,
  selectStyle,
  blueButton,
} from './documentUtils'

export default function DocumentForm({
  document,
  initialName = '',
  onSave,
  onClose,
}) {
  const dialogRef = useRef(null)
  const fileInput = useRef(null)

  const [form, setForm] = useState(
    document
      ? {
          document_name: document.document_name || '',
          document_type: document.document_type || 'Other',
          issue_date: dateOnly(document.issue_date),
          expiry_date: dateOnly(document.expiry_date),
          notes: document.notes || '',
        }
      : {
          ...emptyForm,
          document_name: initialName,
        }
  )

  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
    }
  }, [])

  function updateField(event) {
    const { name, value } = event.target

    setForm(previous => ({
      ...previous,
      [name]: value,
    }))
  }

  function selectFile(selectedFile) {
    if (!selectedFile) return

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF, JPG and PNG files are allowed.')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('The file must be smaller than 10 MB.')
      return
    }

    setFile(selectedFile)
    setError('')
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.document_name.trim()) {
      setError('Please enter a document name.')
      return
    }

    if (
      form.issue_date &&
      form.expiry_date &&
      form.expiry_date < form.issue_date
    ) {
      setError('Expiry date cannot be before the issue date.')
      return
    }

    setSaving(true)

    try {
      if (document) {
        // Existing backend accepts JSON for editing
        await onSave(form, document.document_id)
      } else {
        // Upload endpoint accepts FormData
        const data = new FormData()

        Object.entries(form).forEach(([key, value]) => {
          data.append(key, value)
        })

        if (file) {
          data.append('file', file)
        }

        await onSave(data, null)
      }
    } catch (err) {
      setError(err.message || 'Failed to save document.')
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
      <div className="modal-box max-w-2xl rounded-3xl bg-[#F5F0E9] text-[#112250] shadow-2xl p-0">

        {/* Modal header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#112250] to-[#3C507D] p-6 text-[#F5F0E9]">

          <button
            type="button"
            aria-label="Close form"
            disabled={saving}
            onClick={onClose}
            className="btn btn-sm btn-circle absolute right-4 top-4 border-white/20 bg-white/10 text-white"
          >
            <X size={18} />
          </button>

          <p className="text-[10px] tracking-[0.25em] text-[#E0C58F]">
            YOUR PERSONAL ARCHIVE
          </p>

          <h2 className="mt-2 font-serif text-3xl">
            {document ? 'Edit document' : 'Add a document'}
          </h2>

          <p className="mt-2 text-sm opacity-70">
            Keep important information within reach.
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          {/* File upload */}
          {!document && (
            <div>

              <input
                ref={fileInput}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={event => {
                  selectFile(event.target.files[0])
                  event.target.value = ''
                }}
              />

              <button
                type="button"
                onClick={() => fileInput.current.click()}
                onDragOver={event => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`w-full rounded-2xl border-2 border-dashed p-6 text-center transition-all
                  ${dragging
                    ? 'border-[#3C507D] bg-[#E0C58F]/40'
                    : 'border-[#D9CBC2] bg-white/40 hover:bg-white/70'
                  }`}
              >

                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0C58F]/40">

                  {file
                    ? <FileText size={28} />
                    : <UploadCloud size={28} />
                  }

                </div>

                <p className="font-semibold break-all">
                  {file
                    ? file.name
                    : 'Click or drag a file here'}
                </p>

                <p className="mt-1 text-xs opacity-60">
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : 'PDF, JPG or PNG · Maximum 10 MB'}
                </p>

              </button>

              {file && (
                <div className="mt-2 flex items-center justify-between">

                  <span className="flex items-center gap-1 text-xs text-green-700">
                    <Check size={15} />
                    File selected
                  </span>

                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove file
                  </button>

                </div>
              )}

              <p className="mt-2 text-xs opacity-60">
                Attachments are optional. You can also save a
                document record without uploading a file.
              </p>

            </div>
          )}

          {/* Existing attachment */}
          {document?.file_path && (
            <div className="flex items-center gap-3 rounded-xl border border-[#D9CBC2] bg-white/50 p-4">

              <Paperclip size={20} />

              <div>
                <p className="text-sm font-medium">
                  Existing attachment
                </p>

                <p className="text-xs opacity-60">
                  Your attachment will be preserved.
                </p>
              </div>

            </div>
          )}

          {/* Name and category */}
          <div className="grid gap-4 sm:grid-cols-2">

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Document name *
              </span>

              <input
                className={inputStyle}
                name="document_name"
                value={form.document_name}
                onChange={updateField}
                placeholder="e.g. National ID"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Category
              </span>

              <select
                className={selectStyle}
                name="document_type"
                value={form.document_type}
                onChange={updateField}
              >
                {[...new Set([
                  ...documentTypes,
                  form.document_type
                ])].map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Issue date
              </span>

              <input
                type="date"
                className={inputStyle}
                name="issue_date"
                value={form.issue_date}
                onChange={updateField}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Expiry date
              </span>

              <input
                type="date"
                className={inputStyle}
                name="expiry_date"
                value={form.expiry_date}
                onChange={updateField}
                min={form.issue_date || undefined}
              />
            </label>

          </div>

          {/* Notes */}
          <label className="block">

            <span className="mb-2 block text-sm font-medium">
              Personal notes
            </span>

            <textarea
              className="textarea textarea-bordered w-full rounded-xl border-[#D9CBC2] bg-white/60 text-[#112250]"
              name="notes"
              value={form.notes}
              onChange={updateField}
              placeholder="Anything you want to remember..."
              rows={3}
            />

          </label>

          {/* Error message */}
          {error && (
            <div className="alert alert-error text-sm">
              {error}
            </div>
          )}

          {/* Form actions */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#D9CBC2] pt-5">

            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="btn btn-ghost rounded-full normal-case"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className={blueButton}
            >

              {saving
                ? <span className="loading loading-spinner loading-sm" />
                : <Save size={17} />
              }

              {saving
                ? 'Saving...'
                : document
                  ? 'Save changes'
                  : 'Save document'
              }

            </button>

          </div>

        </form>

      </div>
    </dialog>
  )
}