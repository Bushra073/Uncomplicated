const express = require('express')

module.exports = function (db, authenticateToken) {
  const router = express.Router()

  router.use(authenticateToken)

  // Validate resource information
  async function validateResource(body, userId) {
    const {
      title,
      url,
      collection_id,
      procedure_id,
    } = body

    if (!title?.trim() || !url?.trim()) {
      throw new Error('Title and URL are required.')
    }

    try {
      const link = new URL(url)

      if (!['http:', 'https:'].includes(link.protocol)) {
        throw new Error()
      }
    } catch {
      throw new Error('Please enter a valid website URL.')
    }

    if (collection_id) {
      const [collections] = await db.query(
        `SELECT collection_id FROM collections
         WHERE collection_id = ? AND user_id = ?`,
        [collection_id, userId]
      )

      if (!collections.length) {
        throw new Error('Invalid collection.')
      }
    }

    if (procedure_id) {
      const [procedures] = await db.query(
        `SELECT procedure_id FROM procedures
         WHERE procedure_id = ?
         AND publication_status = 'published'`,
        [procedure_id]
      )

      if (!procedures.length) {
        throw new Error('Invalid procedure.')
      }
    }
  }

  // GET all saved resources
  router.get('/resources', async (req, res) => {
    try {
      const [resources] = await db.query(
        `SELECT r.*,
                c.name AS collection_name,
                p.title AS procedure_title
         FROM saved_resources r
         LEFT JOIN collections c
           ON r.collection_id = c.collection_id
           AND r.user_id = c.user_id
         LEFT JOIN procedures p
           ON r.procedure_id = p.procedure_id
         WHERE r.user_id = ?
         ORDER BY r.is_favourite DESC,
                  r.created_at DESC`,
        [req.user.user_id]
      )

      res.json({
        status: 'success',
        data: resources,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Could not load resources.',
      })
    }
  })

  // SAVE a new resource
  router.post('/resources', async (req, res) => {
    try {
      const userId = req.user.user_id

      try {
        await validateResource(req.body, userId)
      } catch (error) {
        return res.status(400).json({
          message: error.message,
        })
      }

      const {
        title,
        url,
        resource_type,
        category,
        tags,
        notes,
        collection_id,
        procedure_id,
      } = req.body

      const [result] = await db.query(
        `INSERT INTO saved_resources
         (user_id, title, url, resource_type,
          category, tags, notes,
          collection_id, procedure_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          title.trim(),
          url.trim(),
          resource_type || 'Website',
          category || null,
          tags || null,
          notes || null,
          collection_id || null,
          procedure_id || null,
        ]
      )

      res.status(201).json({
        status: 'success',
        message: 'Resource saved successfully!',
        resource_id: result.insertId,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Could not save resource.',
      })
    }
  })

  // EDIT a saved resource
  router.put('/resources/:id', async (req, res) => {
    try {
      const userId = req.user.user_id

      try {
        await validateResource(req.body, userId)
      } catch (error) {
        return res.status(400).json({
          message: error.message,
        })
      }

      const {
        title,
        url,
        resource_type,
        category,
        tags,
        notes,
        collection_id,
        procedure_id,
      } = req.body

      const [result] = await db.query(
        `UPDATE saved_resources
         SET title = ?, url = ?, resource_type = ?,
             category = ?, tags = ?, notes = ?,
             collection_id = ?, procedure_id = ?
         WHERE resource_id = ? AND user_id = ?`,
        [
          title.trim(),
          url.trim(),
          resource_type || 'Website',
          category || null,
          tags || null,
          notes || null,
          collection_id || null,
          procedure_id || null,
          req.params.id,
          userId,
        ]
      )

      if (!result.affectedRows) {
        return res.status(404).json({
          message: 'Resource not found.',
        })
      }

      res.json({
        status: 'success',
        message: 'Resource updated successfully!',
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Could not update resource.',
      })
    }
  })

  // TOGGLE favourite
  router.patch('/resources/:id/favourite', async (req, res) => {
    try {
      const [result] = await db.query(
        `UPDATE saved_resources
         SET is_favourite = NOT is_favourite
         WHERE resource_id = ? AND user_id = ?`,
        [req.params.id, req.user.user_id]
      )

      if (!result.affectedRows) {
        return res.status(404).json({
          message: 'Resource not found.',
        })
      }

      res.json({
        status: 'success',
        message: 'Favourite updated.',
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Could not update favourite.',
      })
    }
  })

  // DELETE a resource
  router.delete('/resources/:id', async (req, res) => {
    try {
      const [result] = await db.query(
        `DELETE FROM saved_resources
         WHERE resource_id = ? AND user_id = ?`,
        [req.params.id, req.user.user_id]
      )

      if (!result.affectedRows) {
        return res.status(404).json({
          message: 'Resource not found.',
        })
      }

      res.json({
        status: 'success',
        message: 'Resource deleted successfully!',
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Could not delete resource.',
      })
    }
  })

  // GET all collections
  router.get('/collections', async (req, res) => {
    try {
      const [collections] = await db.query(
        `SELECT c.*,
                COUNT(r.resource_id) AS resource_count
         FROM collections c
         LEFT JOIN saved_resources r
           ON c.collection_id = r.collection_id
           AND c.user_id = r.user_id
         WHERE c.user_id = ?
         GROUP BY c.collection_id
         ORDER BY c.created_at DESC`,
        [req.user.user_id]
      )

      res.json({
        status: 'success',
        data: collections,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Could not load collections.',
      })
    }
  })

  // CREATE a collection
  router.post('/collections', async (req, res) => {
    try {
      const { name } = req.body

      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          message: 'Collection name is required.',
        })
      }

      if (name.trim().length > 150) {
        return res.status(400).json({
          message: 'Collection name is too long.',
        })
      }

      const [result] = await db.query(
        `INSERT INTO collections (user_id, name)
         VALUES (?, ?)`,
        [req.user.user_id, name.trim()]
      )

      res.status(201).json({
        status: 'success',
        message: 'Collection created!',
        collection_id: result.insertId,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Could not create collection.',
      })
    }
  })

  // RENAME a collection
  router.put('/collections/:id', async (req, res) => {
    try {
      const { name } = req.body

      if (
        typeof name !== 'string' ||
        !name.trim() ||
        name.trim().length > 150
      ) {
        return res.status(400).json({
          message: 'Enter a valid collection name.',
        })
      }

      const [result] = await db.query(
        `UPDATE collections SET name = ?
         WHERE collection_id = ? AND user_id = ?`,
        [name.trim(), req.params.id, req.user.user_id]
      )

      if (!result.affectedRows) {
        return res.status(404).json({
          message: 'Collection not found.',
        })
      }

      res.json({
        status: 'success',
        message: 'Collection renamed!',
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Could not rename collection.',
      })
    }
  })

  // DELETE a collection without deleting its resources
  router.delete('/collections/:id', async (req, res) => {
    try {
      const [result] = await db.query(
        `DELETE FROM collections
         WHERE collection_id = ? AND user_id = ?`,
        [req.params.id, req.user.user_id]
      )

      if (!result.affectedRows) {
        return res.status(404).json({
          message: 'Collection not found.',
        })
      }

      res.json({
        status: 'success',
        message: 'Collection deleted. Your resources are safe.',
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Could not delete collection.',
      })
    }
  })

  return router
}