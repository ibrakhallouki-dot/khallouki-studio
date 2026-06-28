import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { db, pool } from '../../db'

const t = initTRPC.context<any>().create()

export const usersRouter = t.router({
  me: t.procedure.query(async ({ ctx }) => {
    if (!ctx.user) return { user: null }
    if (!ctx.pool) return { user: ctx.user }

    try {
      const res = await ctx.pool.query('SELECT id, email, display_name, avatar_url, role, created_at FROM users WHERE id = $1 LIMIT 1', [ctx.user.id])
      return { user: res.rows[0] ?? null }
    } catch (err) {
      console.error('users.me error', err)
      return { user: null, error: String(err) }
    }
  }),

  sync: t.procedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().optional(),
        displayName: z.string().optional(),
        avatarUrl: z.string().optional(),
        role: z.string().optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.pool) return { ok: false, warning: 'DATABASE_URL not set' }

      const client = await ctx.pool.connect()
      try {
        await client.query('BEGIN')
        await client.query(
          `INSERT INTO users (id, email, display_name, avatar_url, role) VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET
             email = EXCLUDED.email,
             display_name = EXCLUDED.display_name,
             avatar_url = EXCLUDED.avatar_url,
             role = COALESCE(EXCLUDED.role, users.role)`,
          [input.id, input.email || null, input.displayName || null, input.avatarUrl || null, input.role || 'user']
        )
        await client.query('COMMIT')
        return { ok: true }
      } catch (err) {
        await client.query('ROLLBACK')
        console.error('users.sync error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    })
})
