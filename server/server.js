const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')

require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('JWT_SECRET is missing.')
  process.exit(1)
}

// Trust the deployment reverse proxy when configured
if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1)
}

app.disable('x-powered-by')

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

// Security middleware
app.use(helmet())

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map(url => url.trim())
    .filter(Boolean),
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    callback(new Error('Origin not allowed.'))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '100kb' }))

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many attempts. Please try again later.',
  },
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests. Please try again later.',
  },
})

app.use('/api', apiLimiter)

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Please log in.',
    })
  }

  const token = authHeader.slice(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    })

    if (
      !Number.isSafeInteger(decoded.user_id) ||
      decoded.user_id <= 0
    ) {
      throw new Error('Invalid account.')
    }

    req.user = decoded
    next()
  } catch {
    res.status(401).json({
      message: 'Invalid or expired session.',
    })
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend is running!',
  })
})

// Database check
app.get('/api/db-test', async (req, res) => {
  try {
    await db.query('SELECT 1')

    res.json({
      status: 'success',
      message: 'Database connected.',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Database connection failed.',
    })
  }
})

// Sign up
app.post('/api/auth/signup', authLimiter, async (req, res) => {
  try {
    const { full_name, email, password } = req.body || {}

    if (
      typeof full_name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'All fields are required.',
      })
    }

    const cleanName = full_name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({
        message: 'Enter a valid full name.',
      })
    }

    if (
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        message: 'Enter a valid email address.',
      })
    }

    if (
      password.length < 8 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and no more than 72 bytes.',
      })
    }

    const [existing] = await db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [cleanEmail]
    )

    if (existing.length) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES (?, ?, ?)`,
      [cleanName, cleanEmail, passwordHash]
    )

    const user = {
      user_id: result.insertId,
      full_name: cleanName,
      email: cleanEmail,
    }

    const token = jwt.sign(user, JWT_SECRET, {
      expiresIn: '7d',
      algorithm: 'HS256',
    })

    res.status(201).json({
      status: 'success',
      user,
      token,
    })

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }

    console.error('Signup error:', error)

    res.status(500).json({
      message: 'Could not create account.',
    })
  }
})

// Log in
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password ||
      email.length > 254 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return res.status(400).json({
        message: 'Enter a valid email and password.',
      })
    }

    const cleanEmail = email.trim().toLowerCase()

    const [users] = await db.query(
      `SELECT user_id, full_name, email, password_hash, role
       FROM users WHERE email = ?`,
      [cleanEmail]
    )

    if (!users.length) {
      return res.status(401).json({
        message: 'Incorrect email or password.',
      })
    }

    const account = users[0]

    const validPassword = await bcrypt.compare(
      password,
      account.password_hash
    )

    if (!validPassword) {
      return res.status(401).json({
        message: 'Incorrect email or password.',
      })
    }

    const user = {
      user_id: account.user_id,
      full_name: account.full_name,
      email: account.email,
      role: account.role,
    }

    const token = jwt.sign(user, JWT_SECRET, {
      expiresIn: '7d',
      algorithm: 'HS256',
    })

    res.json({
      status: 'success',
      user,
      token,
    })

  } catch (error) {
    console.error('Login error:', error)

    res.status(500).json({
      message: 'Could not log in.',
    })
  }
})

// Get current account
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT user_id, full_name, email, role
       FROM users WHERE user_id = ?`,
      [req.user.user_id]
    )

    if (!users.length) {
      return res.status(404).json({
        message: 'Account not found.',
      })
    }

    res.json({
      status: 'success',
      user: users[0],
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not retrieve account.',
    })
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

    res.json({
      status: 'success',
      data: categories,
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not retrieve categories.',
    })
  }
})

// Get published procedures
app.get('/api/procedures', async (req, res) => {
  try {
    const { categoryId, search } = req.query

    let sql = `
      SELECT p.procedure_id, p.category_id, p.title,
             p.description, p.estimated_duration,
             p.official_link, c.category_name
      FROM procedures p
      JOIN categories c ON p.category_id = c.category_id
      WHERE p.publication_status = 'published'
    `

    const params = []

    if (categoryId) {
      if (!/^\d+$/.test(String(categoryId))) {
        return res.status(400).json({
          message: 'Invalid category.',
        })
      }

      sql += ' AND p.category_id = ?'
      params.push(categoryId)
    }

    if (search) {
      if (typeof search !== 'string' || search.length > 255) {
        return res.status(400).json({
          message: 'Invalid search value.',
        })
      }

      sql += ' AND (p.title LIKE ? OR p.description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += ' ORDER BY p.title'

    const [procedures] = await db.query(sql, params)

    res.json({
      status: 'success',
      data: procedures,
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not retrieve procedures.',
    })
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
       WHERE p.procedure_id = ?
       AND p.publication_status = 'published'`,
      [id]
    )

    if (!procedures.length) {
      return res.status(404).json({
        message: 'Procedure not found.',
      })
    }

    const [requirements] = await db.query(
      `SELECT * FROM procedure_requirements
       WHERE procedure_id = ?
       ORDER BY requirement_id`,
      [id]
    )

    const [steps] = await db.query(
      `SELECT * FROM procedure_steps
       WHERE procedure_id = ?
       ORDER BY step_number`,
      [id]
    )

    const [resources] = await db.query(
      `SELECT * FROM procedure_resources
       WHERE procedure_id = ?
       ORDER BY resource_id`,
      [id]
    )

    res.json({
      status: 'success',
      data: {
        ...procedures[0],
        requirements,
        steps,
        resources,
      },
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not retrieve procedure details.',
    })
  }
})

// Add a document without an attachment
app.post('/api/documents', authenticateToken, async (req, res) => {
  try {
    const {
      document_name,
      document_type,
      issue_date,
      expiry_date,
      notes,
    } = req.body || {}

    if (
      typeof document_name !== 'string' ||
      !document_name.trim()
    ) {
      return res.status(400).json({
        message: 'Document name is required.',
      })
    }

    const [result] = await db.query(
      `INSERT INTO documents
       (user_id, document_name, document_type,
        issue_date, expiry_date, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.user_id,
        document_name.trim(),
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

    res.status(500).json({
      message: 'Could not add document.',
    })
  }
})

// Get user's documents
app.get('/api/documents', authenticateToken, async (req, res) => {
  try {
    const [documents] = await db.query(
      `SELECT * FROM documents
       WHERE user_id = ?
       ORDER BY uploaded_at DESC`,
      [req.user.user_id]
    )

    res.json({
      status: 'success',
      data: documents,
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not retrieve documents.',
    })
  }
})

// Start or resume a procedure
app.post(
  '/api/my-procedures/:procedureId/start',
  authenticateToken,
  async (req, res) => {
    let connection

    try {
      const procedureId = req.params.procedureId

      connection = await db.getConnection()
      await connection.beginTransaction()

      const [procedures] = await connection.query(
        `SELECT procedure_id FROM procedures
         WHERE procedure_id = ?
         AND publication_status = 'published'`,
        [procedureId]
      )

      if (!procedures.length) {
        await connection.rollback()

        return res.status(404).json({
          message: 'Procedure not found.',
        })
      }

      const [result] = await connection.query(
        `INSERT INTO user_procedures
         (user_id, procedure_id, status)
         VALUES (?, ?, 'in_progress')
         ON DUPLICATE KEY UPDATE
         user_procedure_id = LAST_INSERT_ID(user_procedure_id)`,
        [req.user.user_id, procedureId]
      )

      const userProcedureId = result.insertId

      await connection.query(
        `INSERT IGNORE INTO user_step_progress
         (user_procedure_id, step_id, is_completed)
         SELECT ?, step_id, 0
         FROM procedure_steps
         WHERE procedure_id = ?`,
        [userProcedureId, procedureId]
      )

      await connection.commit()

      res.json({
        status: 'success',
        user_procedure_id: userProcedureId,
        message: 'Procedure ready.',
      })

    } catch (error) {
      if (connection) {
        await connection.rollback().catch(() => {})
      }

      console.error(error)

      res.status(500).json({
        message: 'Could not start procedure.',
      })

    } finally {
      if (connection) connection.release()
    }
  }
)

// Get user's procedures and progress
app.get('/api/my-procedures', authenticateToken, async (req, res) => {
  try {
    const [procedures] = await db.query(
      `SELECT
         up.user_procedure_id,
         up.procedure_id,
         up.status,
         up.started_at,
         up.completed_at,
         up.last_activity_at,
         p.title,
         COUNT(s.step_id) AS total_steps,
         SUM(
           CASE WHEN usp.is_completed = 1
           THEN 1 ELSE 0 END
         ) AS completed_steps
       FROM user_procedures up
       JOIN procedures p
         ON p.procedure_id = up.procedure_id
       LEFT JOIN procedure_steps s
         ON s.procedure_id = up.procedure_id
       LEFT JOIN user_step_progress usp
         ON usp.user_procedure_id = up.user_procedure_id
         AND usp.step_id = s.step_id
       WHERE up.user_id = ?
       GROUP BY up.user_procedure_id, up.procedure_id,
                up.status, up.started_at, up.completed_at,
                up.last_activity_at, p.title
       ORDER BY up.last_activity_at DESC`,
      [req.user.user_id]
    )

    res.json({
      status: 'success',
      data: procedures,
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not retrieve your procedures.',
    })
  }
})

// Get tracker details
app.get('/api/my-procedures/:id', authenticateToken, async (req, res) => {
  try {
    const [owned] = await db.query(
      `SELECT up.user_procedure_id, up.procedure_id,
              up.status, p.title
       FROM user_procedures up
       JOIN procedures p
         ON p.procedure_id = up.procedure_id
       WHERE up.user_procedure_id = ?
       AND up.user_id = ?`,
      [req.params.id, req.user.user_id]
    )

    if (!owned.length) {
      return res.status(404).json({
        message: 'Tracked procedure not found.',
      })
    }

    const [steps] = await db.query(
      `SELECT s.step_id, s.step_number, s.step_title,
              s.instructions, s.required_documents,
              COALESCE(usp.is_completed, 0) AS is_completed
       FROM procedure_steps s
       LEFT JOIN user_step_progress usp
         ON usp.step_id = s.step_id
         AND usp.user_procedure_id = ?
       WHERE s.procedure_id = ?
       ORDER BY s.step_number`,
      [req.params.id, owned[0].procedure_id]
    )

    res.json({
      status: 'success',
      data: {
        ...owned[0],
        steps,
      },
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not retrieve tracker.',
    })
  }
})

// Update step progress
app.patch(
  '/api/my-procedures/:id/steps/:stepId',
  authenticateToken,
  async (req, res) => {
    let connection

    try {
      const { completed } = req.body || {}

      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          message: 'A completion value is required.',
        })
      }

      connection = await db.getConnection()
      await connection.beginTransaction()

      const [owned] = await connection.query(
        `SELECT user_procedure_id, procedure_id
         FROM user_procedures
         WHERE user_procedure_id = ?
         AND user_id = ?
         FOR UPDATE`,
        [req.params.id, req.user.user_id]
      )

      if (!owned.length) {
        await connection.rollback()

        return res.status(404).json({
          message: 'Tracked procedure not found.',
        })
      }

      // Verify that the step belongs to this procedure
      const [steps] = await connection.query(
        `SELECT step_id FROM procedure_steps
         WHERE step_id = ?
         AND procedure_id = ?`,
        [req.params.stepId, owned[0].procedure_id]
      )

      if (!steps.length) {
        await connection.rollback()

        return res.status(404).json({
          message: 'Step does not belong to this procedure.',
        })
      }

      await connection.query(
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

      const [remaining] = await connection.query(
        `SELECT COUNT(*) AS total,
                SUM(
                  CASE WHEN usp.is_completed = 1
                  THEN 1 ELSE 0 END
                ) AS completed
         FROM procedure_steps s
         LEFT JOIN user_step_progress usp
           ON usp.step_id = s.step_id
           AND usp.user_procedure_id = ?
         WHERE s.procedure_id = ?`,
        [req.params.id, owned[0].procedure_id]
      )

      const total = Number(remaining[0].total)
      const completedSteps = Number(remaining[0].completed)

      const allDone = total > 0 && completedSteps === total

      await connection.query(
        `UPDATE user_procedures
         SET status = ?,
             completed_at = ?,
             last_activity_at = CURRENT_TIMESTAMP
         WHERE user_procedure_id = ?
         AND user_id = ?`,
        [
          allDone ? 'completed' : 'in_progress',
          allDone ? new Date() : null,
          req.params.id,
          req.user.user_id,
        ]
      )

      await connection.commit()

      res.json({
        status: 'success',
        completed_steps: completedSteps,
        total_steps: total,
        percentage: total
          ? Math.round((completedSteps / total) * 100)
          : 0,
      })

    } catch (error) {
      if (connection) {
        await connection.rollback().catch(() => {})
      }

      console.error(error)

      res.status(500).json({
        message: 'Could not update step progress.',
      })

    } finally {
      if (connection) connection.release()
    }
  }
)

// Document routes
const documentRoutes = require('./documentRoutes')

app.use(
  '/api/documents',
  documentRoutes(db, authenticateToken)
)

// Knowledge Shelf routes
const knowledgeRoutes = require('./knowledgeRoutes')

app.use(
  '/api/knowledge',
  knowledgeRoutes(db, authenticateToken)
)

// Unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found.',
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error(error)

  if (res.headersSent) {
    return next(error)
  }

  if (error.message === 'Origin not allowed.') {
    return res.status(403).json({
      message: 'Origin not allowed.',
    })
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'File must be smaller than 10 MB.',
    })
  }

  if (error.message === 'Only PDF, JPG and PNG files are allowed.') {
    return res.status(400).json({
      message: error.message,
    })
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Invalid request data.',
    })
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'Request is too large.',
    })
  }

  res.status(500).json({
    message: 'Something went wrong.',
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})