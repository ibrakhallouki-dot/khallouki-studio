import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.context<any>().create()

export const adminRouter = t.router({
  stats: t.procedure.query(async () => {
    const { pool } = require('../../db')
    if (!pool) return { ok: false, warning: 'DATABASE_URL not set' }

    const client = await pool.connect()
    try {
      const res = await client.query('\n        SELECT\n          (SELECT COUNT(*) FROM users) as users_count,\n          (SELECT COUNT(*) FROM designs) as designs_count,\n          (SELECT COUNT(*) FROM design_comments) as comments_count,\n          (SELECT COUNT(*) FROM design_downloads) as downloads_count\n      '
      )
      return { stats: res.rows[0] }
    } finally {
      client.release()
    }
  }),

  listUsers: t.procedure
    .input(z.object({ page: z.number().min(1).default(1), perPage: z.number().min(1).default(50) }))
    .query(async ({ input }) => {
      const { pool } = require('../../db')
      if (!pool) return { items: [], total: 0, warning: 'DATABASE_URL not set' }
      const client = await pool.connect()
      try {
        const offset = (input.page - 1) * input.perPage
        const res = await client.query('SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2', [input.perPage, offset])
        const countRes = await client.query('SELECT COUNT(*) as cnt FROM users')
        const total = parseInt(countRes.rows[0]?.cnt || '0', 10)
        return { items: res.rows, total }
      } finally {
        client.release()
      }
    })
})
