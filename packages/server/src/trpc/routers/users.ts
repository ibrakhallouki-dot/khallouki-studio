import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.context<any>().create()

export const usersRouter = t.router({
  profile: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { db } = require('../../db')
      if (!db) return { user: null, warning: 'DATABASE_URL not set' }

      const rows = await db.select().from('users').where({ id: input.userId }).limit(1)
      return { user: rows[0] ?? null }
    }),

  myDesigns: t.procedure
    .input(z.object({ userId: z.string(), page: z.number().min(1).default(1), perPage: z.number().min(1).default(12) }))
    .query(async ({ input }) => {
      const { db } = require('../../db')
      if (!db) return { items: [], total: 0, warning: 'DATABASE_URL not set' }

      const offset = (input.page - 1) * input.perPage
      const items = await db.select().from('designs').where({ creator_id: input.userId }).limit(input.perPage).offset(offset)
      const totalRes = await db.select().from('designs').where({ creator_id: input.userId })
      const total = Array.isArray(totalRes) ? totalRes.length : 0
      return { items, total }
    }),

  favorites: t.procedure
    .input(z.object({ userId: z.string(), page: z.number().min(1).default(1), perPage: z.number().min(1).default(12) }))
    .query(async ({ input }) => {
      const { pool } = require('../../db')
      if (!pool) return { items: [], total: 0, warning: 'DATABASE_URL not set' }

      const client = await pool.connect()
      try {
        const offset = (input.page - 1) * input.perPage
        const res = await client.query('\n          SELECT d.* FROM designs d \n          JOIN design_favorites f ON f.design_id = d.id \n          WHERE f.user_id = $1 \n          ORDER BY f.created_at DESC \n          LIMIT $2 OFFSET $3\n        ', [input.userId, input.perPage, offset])
        const countRes = await client.query('SELECT COUNT(*) as cnt FROM design_favorites WHERE user_id = $1', [input.userId])
        const items = res.rows
        const total = parseInt(countRes.rows[0]?.cnt || '0', 10)
        return { items, total }
      } finally {
        client.release()
      }
    }),

  downloadHistory: t.procedure
    .input(z.object({ userId: z.string(), page: z.number().min(1).default(1), perPage: z.number().min(1).default(12) }))
    .query(async ({ input }) => {
      const { pool } = require('../../db')
      if (!pool) return { items: [], total: 0, warning: 'DATABASE_URL not set' }
      const client = await pool.connect()
      try {
        const offset = (input.page - 1) * input.perPage
        const res = await client.query('\n          SELECT d.* , dd.created_at as downloaded_at FROM design_downloads dd\n          JOIN designs d ON d.id = dd.design_id\n          WHERE dd.user_id = $1\n          ORDER BY dd.created_at DESC\n          LIMIT $2 OFFSET $3\n        ', [input.userId, input.perPage, offset])
        const countRes = await client.query('SELECT COUNT(*) as cnt FROM design_downloads WHERE user_id = $1', [input.userId])
        const items = res.rows
        const total = parseInt(countRes.rows[0]?.cnt || '0', 10)
        return { items, total }
      } finally {
        client.release()
      }
    })
})
