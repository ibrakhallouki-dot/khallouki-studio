import cors from 'cors'
import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './trpc/router'
import dotenv from 'dotenv'
import { createTRPCContext } from './trpc/context'
import { pool } from './db'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/sync-user', async (req, res) => {
  const { id, email, displayName, avatarUrl, role } = req.body || {}
  if (!id) return res.status(400).json({ error: 'id is required' })
  if (!pool) return res.status(500).json({ error: 'DATABASE_URL not set' })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO users (id, email, display_name, avatar_url, role) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         display_name = EXCLUDED.display_name,
         avatar_url = EXCLUDED.avatar_url,
         role = COALESCE(EXCLUDED.role, users.role)`,
      [id, email || null, displayName || null, avatarUrl || null, role || 'user']
    )
    await client.query('COMMIT')
    res.json({ ok: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('/api/sync-user error', err)
    res.status(500).json({ error: String(err) })
  } finally {
    client.release()
  }
})

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext
  })
)

const port = process.env.PORT ?? 4000
app.listen(port, () => console.log(`Server listening on port ${port}`))
