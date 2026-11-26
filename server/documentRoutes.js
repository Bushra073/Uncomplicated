const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

module.exports = function (db, authenticateToken) {
  const router = express.Router()

  const uploadDirectory = process.env.UPLOAD_DIR
  || path.join(__dirname, 'private-uploads')

  fs.mkdirSync(uploadDirectory, { recursive: true })

  router.use(authenticateToken)

  const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF, JPG and PNG files are allowed.'))
    }
  },
})

  // Test document router
  router.get('/test', (req, res) => {
    res.json({
      status: 'success',
      message: 'Document router is working!'
    })
  })



  router.post('/upload', upload.single('file'), async (req, res) => {
  let fileName = null

  try {
    const {
      document_name,
      document_type,
      issue_date,
      expiry_date,
      notes
    } = req.body

    if (!document_name?.trim()) {
      return res.status(400).json({
        message: 'Document name is required.'
      })
    }

    if (req.file) {
      const buffer = req.file.buffer

      const extensions = {
        'application/pdf': '.pdf',
        'image/jpeg': '.jpg',
        'image/png': '.png'
      }

      const validFile =
        (req.file.mimetype === 'application/pdf' &&
          buffer.subarray(0, 5).toString() === '%PDF-') ||
        (req.file.mimetype === 'image/jpeg' &&
          buffer.subarray(0, 3).toString('hex') === 'ffd8ff') ||
        (req.file.mimetype === 'image/png' &&
          buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a')

      if (!validFile) {
        return res.status(400).json({
          message: 'Invalid file format.'
        })
      }

      fileName = crypto.randomUUID() +
        extensions[req.file.mimetype]

      await fs.promises.writeFile(
        path.join(uploadDirectory, fileName),
        buffer
      )
    }

    const [result] = await db.query(
      `INSERT INTO documents
      (user_id, document_name, document_type,
       file_path, issue_date, expiry_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.user_id,
        document_name.trim(),
        document_type || null,
        fileName,
        issue_date || null,
        expiry_date || null,
        notes || null
      ]
    )

    res.status(201).json({
      status: 'success',
      message: 'Document saved successfully!',
      document_id: result.insertId
    })

  } catch (error) {
    if (fileName) {
      await fs.promises.unlink(
        path.join(uploadDirectory, fileName)
      ).catch(() => {})
    }

    console.error(error)

    res.status(500).json({
      message: 'Failed to save document.'
    })
  }
})

router.get('/:id/file', async (req, res) => {
  try {
    const [documents] = await db.query(
      `SELECT document_name, file_path
       FROM documents
       WHERE document_id = ? AND user_id = ?`,
      [req.params.id, req.user.user_id]
    )

    if (!documents.length || !documents[0].file_path) {
      return res.status(404).json({
        message: 'File not found.'
      })
    }

    const document = documents[0]

    const filePath = path.join(
      uploadDirectory,
      path.basename(document.file_path)
    )

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: 'File is missing.'
      })
    }

    res.setHeader('Cache-Control', 'private, no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    if (req.query.download === 'true') {
      const extension = path.extname(filePath)

      return res.download(
        filePath,
        document.document_name + extension
      )
    }

    res.sendFile(filePath)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to retrieve file.'
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const {
      document_name,
      document_type,
      issue_date,
      expiry_date,
      notes
    } = req.body

    if (!document_name?.trim()) {
      return res.status(400).json({
        message: 'Document name is required.'
      })
    }

    const [result] = await db.query(
      `UPDATE documents
       SET document_name = ?,
           document_type = ?,
           issue_date = ?,
           expiry_date = ?,
           notes = ?
       WHERE document_id = ? AND user_id = ?`,
      [
        document_name.trim(),
        document_type || null,
        issue_date || null,
        expiry_date || null,
        notes || null,
        req.params.id,
        req.user.user_id
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Document not found.'
      })
    }

    res.json({
      status: 'success',
      message: 'Document updated successfully!'
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to update document.'
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const [documents] = await db.query(
      `SELECT file_path FROM documents
       WHERE document_id = ? AND user_id = ?`,
      [req.params.id, req.user.user_id]
    )

    if (!documents.length) {
      return res.status(404).json({
        message: 'Document not found.'
      })
    }

    await db.query(
      `DELETE FROM documents
       WHERE document_id = ? AND user_id = ?`,
      [req.params.id, req.user.user_id]
    )

    if (documents[0].file_path) {
      const filePath = path.join(
        uploadDirectory,
        path.basename(documents[0].file_path)
      )

      await fs.promises.unlink(filePath).catch(error => {
        if (error.code !== 'ENOENT') {
          console.error('File cleanup failed:', error)
        }
      })
    }

    res.json({
      status: 'success',
      message: 'Document deleted successfully!'
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete document.'
    })
  }
})

  return router
}