
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

app.use(cors())
app.use(express.json())

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Please log in.' })
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session.' })
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Backend is running!' })
})

// Database check
app.get('/api/db-test', async (req, res) => {
  try {
    const [result] = await db.query('SELECT DATABASE() AS databaseName')
    res.json({ status: 'success', database: result[0].databaseName })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Database connection failed.' })
  }
})

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { full_name, email, password } = req.body

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }

    const [existing] = await db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    )

    if (existing.length) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES (?, ?, ?)`,
      [full_name, email, passwordHash]
    )

    const user = {
      user_id: result.insertId,
      full_name,
      email,
    }

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ status: 'success', user, token })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Could not create account.' })
  }
})

// Log in
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const [users] = await db.query(
      `SELECT user_id, full_name, email, password_hash, role
       FROM users WHERE email = ?`,
      [email]
    )

    if (!users.length) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }

    const account = users[0]
    const validPassword = await bcrypt.compare(password, account.password_hash)

    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }

    const user = {
      user_id: account.user_id,
      full_name: account.full_name,
      email: account.email,
      role: account.role,
    }

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })

    res.json({ status: 'success', user, token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Could not log in.' })
  }
})

// Get current account
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT user_id, full_name, email, role FROM users WHERE user_id = ?',
      [req.user.user_id]
    )

    if (!users.length) {
      return res.status(404).json({ message: 'Account not found.' })
    }

    res.json({ status: 'success', user: users[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not retrieve account.' })
  }
})

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT c.category_id, c.category_name, c.description,
             COUNT(p.procedure_id) AS procedure_count
      FROM categories c
      LEFT JOIN procedures p
        ON c.category_id = p.category_id
        AND p.publication_status = 'published'
      GROUP BY c.category_id, c.category_name, c.description
      ORDER BY c.category_id
    `)

    res.json({ status: 'success', data: categories })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not retrieve categories.' })
  }
})

// Get published procedures
app.get('/api/procedures', async (req, res) => {
  try {
    const { categoryId, search } = req.query

    let sql = `
      SELECT p.procedure_id, p.category_id, p.title, p.description,
             p.estimated_duration, p.official_link, c.category_name
      FROM procedures p
      JOIN categories c ON p.category_id = c.category_id
      WHERE p.publication_status = 'published'
    `
    const params = []

    if (categoryId) {
      sql += ' AND p.category_id = ?'
      params.push(categoryId)
    }

    if (search) {
      sql += ' AND (p.title LIKE ? OR p.description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += ' ORDER BY p.title'

    const [procedures] = await db.query(sql, params)
    res.json({ status: 'success', data: procedures })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not retrieve procedures.' })
  }
})

// Get procedure details
app.get('/api/procedures/:id', async (req, res) => {
  try {
    const id = req.params.id

    const [procedures] = await db.query(
      `SELECT p.*, c.category_name
       FROM procedures p
       JOIN categories c ON p.category_id = c.category_id
       WHERE p.procedure_id = ? AND p.publication_status = 'published'`,
      [id]
    )

    if (!procedures.length) {
      return res.status(404).json({ message: 'Procedure not found.' })
    }

    const [requirements] = await db.query(
      `SELECT * FROM procedure_requirements
       WHERE procedure_id = ? ORDER BY requirement_id`,
      [id]
    )

    const [steps] = await db.query(
      `SELECT * FROM procedure_steps
       WHERE procedure_id = ? ORDER BY step_number`,
      [id]
    )

    const [resources] = await db.query(
      `SELECT * FROM procedure_resources
       WHERE procedure_id = ? ORDER BY resource_id`,
      [id]
    )

    res.json({
      status: 'success',
      data: { ...procedures[0], requirements, steps, resources },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not retrieve procedure details.' })
  }
})

// Add a document
app.post('/api/documents', authenticateToken, async (req, res) => {
  try {
    const { document_name, document_type, issue_date, expiry_date, notes } = req.body

    if (!document_name) {
      return res.status(400).json({ message: 'Document name is required.' })
    }

    const [result] = await db.query(
      `INSERT INTO documents
       (user_id, document_name, document_type, issue_date, expiry_date, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.user_id,
        document_name,
        document_type || null,
        issue_date || null,
        expiry_date || null,
        notes || null,
      ]
    )

    res.status(201).json({
      status: 'success',
      document_id: result.insertId,
      message: 'Document added successfully.',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not add document.' })
  }
})

// Get the logged-in user's documents
app.get('/api/documents', authenticateToken, async (req, res) => {
  try {
    const [documents] = await db.query(
      `SELECT * FROM documents
       WHERE user_id = ?
       ORDER BY uploaded_at DESC`,
      [req.user.user_id]
    )

    res.json({ status: 'success', data: documents })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not retrieve documents.' })
  }
})



// Start or resume a procedure
app.post('/api/my-procedures/:procedureId/start', authenticateToken, async (req, res) => {
  try {
    const procedureId = req.params.procedureId

    const [procedures] = await db.query(
      `SELECT procedure_id FROM procedures
       WHERE procedure_id = ? AND publication_status = 'published'`,
      [procedureId]
    )

    if (!procedures.length) {
      return res.status(404).json({ message: 'Procedure not found.' })
    }

    let [existing] = await db.query(
      `SELECT user_procedure_id, status
       FROM user_procedures
       WHERE user_id = ? AND procedure_id = ?`,
      [req.user.user_id, procedureId]
    )

    let userProcedureId

    if (existing.length) {
      userProcedureId = existing[0].user_procedure_id
    } else {
      const [result] = await db.query(
        `INSERT INTO user_procedures (user_id, procedure_id, status)
         VALUES (?, ?, 'in_progress')`,
        [req.user.user_id, procedureId]
      )
      userProcedureId = result.insertId
    }

    const [steps] = await db.query(
      'SELECT step_id FROM procedure_steps WHERE procedure_id = ?',
      [procedureId]
    )

    for (const step of steps) {
      await db.query(
        `INSERT IGNORE INTO user_step_progress
         (user_procedure_id, step_id, is_completed)
         VALUES (?, ?, 0)`,
        [userProcedureId, step.step_id]
      )
    }

    res.json({
      status: 'success',
      user_procedure_id: userProcedureId,
      message: 'Procedure ready.',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not start procedure.' })
  }
})

// Get user's procedures and their progress
app.get('/api/my-procedures', authenticateToken, async (req, res) => {
  try {
    const [procedures] = await db.query(
      `SELECT
         up.user_procedure_id, up.procedure_id, up.status,
         up.started_at, up.completed_at, up.last_activity_at,
         p.title,
         COUNT(usp.progress_id) AS total_steps,
         SUM(CASE WHEN usp.is_completed = 1 THEN 1 ELSE 0 END) AS completed_steps
       FROM user_procedures up
       JOIN procedures p ON p.procedure_id = up.procedure_id
       LEFT JOIN user_step_progress usp
         ON usp.user_procedure_id = up.user_procedure_id
       WHERE up.user_id = ?
       GROUP BY up.user_procedure_id, up.procedure_id, up.status,
                up.started_at, up.completed_at, up.last_activity_at, p.title
       ORDER BY up.last_activity_at DESC`,
      [req.user.user_id]
    )

    res.json({ status: 'success', data: procedures })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not retrieve your procedures.' })
  }
})

// Get tracker details
app.get('/api/my-procedures/:id', authenticateToken, async (req, res) => {
  try {
    const [owned] = await db.query(
      `SELECT up.user_procedure_id, up.procedure_id, up.status, p.title
       FROM user_procedures up
       JOIN procedures p ON p.procedure_id = up.procedure_id
       WHERE up.user_procedure_id = ? AND up.user_id = ?`,
      [req.params.id, req.user.user_id]
    )

    if (!owned.length) {
      return res.status(404).json({ message: 'Tracked procedure not found.' })
    }

    const [steps] = await db.query(
      `SELECT s.step_id, s.step_number, s.step_title, s.instructions,
              s.required_documents, COALESCE(usp.is_completed, 0) AS is_completed
       FROM procedure_steps s
       LEFT JOIN user_step_progress usp
         ON usp.step_id = s.step_id AND usp.user_procedure_id = ?
       WHERE s.procedure_id = ?
       ORDER BY s.step_number`,
      [req.params.id, owned[0].procedure_id]
    )

    res.json({
      status: 'success',
      data: { ...owned[0], steps },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not retrieve tracker.' })
  }
})

// Update a step
app.patch('/api/my-procedures/:id/steps/:stepId', authenticateToken, async (req, res) => {
  try {
    const { completed } = req.body

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'A completion value is required.' })
    }

    const [owned] = await db.query(
      'SELECT user_procedure_id FROM user_procedures WHERE user_procedure_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    )

    if (!owned.length) {
      return res.status(404).json({ message: 'Tracked procedure not found.' })
    }

    const [steps] = await db.query(
      `SELECT step_id FROM procedure_steps
       WHERE step_id = ?`,
      [req.params.stepId]
    )

    if (!steps.length) {
      return res.status(404).json({ message: 'Step not found.' })
    }

    await db.query(
      `INSERT INTO user_step_progress
       (user_procedure_id, step_id, is_completed, completed_at)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         is_completed = VALUES(is_completed),
         completed_at = VALUES(completed_at)`,
      [
        req.params.id,
        req.params.stepId,
        completed ? 1 : 0,
        completed ? new Date() : null,
      ]
    )

    const [remaining] = await db.query(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN usp.is_completed = 1 THEN 1 ELSE 0 END) AS completed
       FROM procedure_steps s
       LEFT JOIN user_step_progress usp
         ON usp.step_id = s.step_id AND usp.user_procedure_id = ?
       WHERE s.procedure_id = (
         SELECT procedure_id FROM user_procedures
         WHERE user_procedure_id = ?
       )`,
      [req.params.id, req.params.id]
    )

    const allDone = Number(remaining[0].total) > 0 &&
      Number(remaining[0].completed) === Number(remaining[0].total)

    await db.query(
      `UPDATE user_procedures
       SET status = ?, completed_at = ?
       WHERE user_procedure_id = ? AND user_id = ?`,
      [
        allDone ? 'completed' : 'in_progress',
        allDone ? new Date() : null,
        req.params.id,
        req.user.user_id,
      ]
    )

    res.json({
      status: 'success',
      completed_steps: Number(remaining[0].completed),
      total_steps: Number(remaining[0].total),
      percentage: remaining[0].total
        ? Math.round((remaining[0].completed / remaining[0].total) * 100)
        : 0,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Could not update step progress.' })
  }
})


const documentRoutes = require('./documentRoutes')

app.use('/api/documents', documentRoutes(db, authenticateToken))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
