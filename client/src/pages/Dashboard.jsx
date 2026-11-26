
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL, useAuth } from '../context/AuthContext'
import '../styles/user-pages.css'

function Dashboard() {
  const { user, token, logout } = useAuth()
  const [documents, setDocuments] = useState([])
  const [procedures, setProcedures] = useState([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    document_name: '',
    document_type: '',
    issue_date: '',
    expiry_date: '',
    notes: '',
  })

  async function loadDashboard() {
    try {
      const headers = { Authorization: `Bearer ${token}` }

      const [documentResponse, procedureResponse] = await Promise.all([
        fetch(`${API_URL}/documents`, { headers }),
        fetch(`${API_URL}/my-procedures`, { headers }),
      ])

      const documentData = await documentResponse.json()
      const procedureData = await procedureResponse.json()

      if (!documentResponse.ok) {
        throw new Error(documentData.message || 'Could not load documents.')
      }

      if (!procedureResponse.ok) {
        throw new Error(procedureData.message || 'Could not load procedures.')
      }

      setDocuments(documentData.data)
      setProcedures(procedureData.data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [token])

  async function addDocument(event) {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.message)

      setForm({
        document_name: '',
        document_type: '',
        issue_date: '',
        expiry_date: '',
        notes: '',
      })

      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteDocument(id) {
    if (!window.confirm('Delete this document record?')) return

    try {
      const response = await fetch(`${API_URL}/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message)
      }

      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="user-page">
      <header className="user-header">
        <Link to="/" className="user-brand">Uncomplicated.</Link>
        <div>
          <span>{user?.full_name}</span>
          <button className="text-button" onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="dashboard-intro">
        <p className="eyebrow">YOUR PERSONAL DASHBOARD</p>
        <h1>Welcome, {user?.full_name?.split(' ')[0]}.</h1>
        <p className="muted">
          Keep your documents, procedures and progress in one place.
        </p>
      </section>

      {error && <p className="form-error">{error}</p>}

      <section className="dashboard-stats">
        <article className="user-card">
          <span>Saved documents</span>
          <strong>{documents.length}</strong>
        </article>
        <article className="user-card">
          <span>My procedures</span>
          <strong>{procedures.length}</strong>
        </article>
        <article className="user-card">
          <span>Completed procedures</span>
          <strong>{procedures.filter(p => p.status === 'completed').length}</strong>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR JOURNEY</p>
            <h2>My procedures</h2>
          </div>
          <Link to="/procedures">Explore procedures →</Link>
        </div>

        {procedures.length === 0 ? (
          <div className="user-card empty-state">
            <p>You haven't started a procedure yet.</p>
            <Link to="/procedures">Find a procedure</Link>
          </div>
        ) : (
          <div className="user-card-list">
            {procedures.map((procedure) => {
              const percentage = procedure.total_steps
                ? Math.round(
                    (Number(procedure.completed_steps) /
                      Number(procedure.total_steps)) * 100
                  )
                : 0

              return (
                
<article className="user-card procedure-row" key={procedure.user_procedure_id}>
  <div className="procedure-row-content">
    <h3>{procedure.title}</h3>

    <p className="muted">
      {procedure.completed_steps || 0} of {procedure.total_steps} steps completed
    </p>

    <div className="progress-track">
      <div style={{ width: `${percentage}%` }} />
    </div>

    <span className="procedure-progress-label">
      {percentage}% complete
    </span>
  </div>

  <div className="procedure-row-actions">
    <Link
      to={`/procedures/${procedure.procedure_id}`}
      className="procedure-guide-link"
    >
      View Guide
    </Link>

    <Link
      to={`/my-procedures/${procedure.user_procedure_id}`}
      className="procedure-resume-link"
    >
      {procedure.status === 'completed' ? 'View Progress' : 'Resume Progress'} ↗
    </Link>
  </div>
</article>

              )
            })}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PERSONAL DOCUMENT HUB</p>
            <h2>My documents</h2>
          </div>
        </div>

        <form className="document-form user-card" onSubmit={addDocument}>
          <h3>Add a document record</h3>

          <label>
            Document name
            <input
              value={form.document_name}
              onChange={e => setForm({ ...form, document_name: e.target.value })}
              placeholder="e.g. National Identity Card"
              required
            />
          </label>

          <label>
            Document type
            <input
              value={form.document_type}
              onChange={e => setForm({ ...form, document_type: e.target.value })}
              placeholder="e.g. Identity"
            />
          </label>

          <div className="form-grid">
            <label>
              Issue date
              <input
                type="date"
                value={form.issue_date}
                onChange={e => setForm({ ...form, issue_date: e.target.value })}
              />
            </label>

            <label>
              Expiry date
              <input
                type="date"
                value={form.expiry_date}
                onChange={e => setForm({ ...form, expiry_date: e.target.value })}
              />
            </label>
          </div>

          <label>
            Notes
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional notes"
            />
          </label>

          <button className="primary-button">Save document</button>
        </form>

        {documents.length === 0 ? (
          <div className="user-card empty-state">
            <p>No documents saved yet. Add your first document above.</p>
          </div>
        ) : (
          <div className="user-card-list">
            {documents.map(document => (
              <article className="user-card document-row" key={document.document_id}>
                <div>
                  <h3>{document.document_name}</h3>
                  <p className="muted">{document.document_type || 'Document'}</p>
                  <p className="muted">
                    {document.expiry_date
                      ? `Expires: ${new Date(document.expiry_date).toLocaleDateString()}`
                      : 'No expiry date recorded'}
                  </p>
                </div>
                <button
                  className="text-button danger-text"
                  onClick={() => deleteDocument(document.document_id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard
