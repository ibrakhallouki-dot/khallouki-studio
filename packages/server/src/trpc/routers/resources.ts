import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { resources } from '../../db/schema'

const t = initTRPC.context<any>().create()

export const resourcesRouter = t.router({
  list: t.procedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(12),
        search: z.string().optional(),
        isPremium: z.boolean().optional()
      }).optional()
    )
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const perPage = input?.perPage ?? 12
      const offset = (page - 1) * perPage

      const { db } = require('../../db')
      if (!db) {
        return { items: [], total: 0, warning: 'DATABASE_URL not set; DB queries are disabled' }
      }

      let q = db.select().from(resources).limit(perPage).offset(offset)
      if (input?.isPremium !== undefined) {
        q = q.where({ is_premium: input.isPremium })
      }

      const items = await q
      const totalRes = await db.select().from(resources)
      const total = Array.isArray(totalRes) ? totalRes.length : 0

      return { items, total }
    }),

  get: t.procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { db } = require('../../db')
      if (!db) return { resource: null, warning: 'DATABASE_URL not set' }

      const rows = await db.select().from(resources).where({ id: input.id }).limit(1)
      return { resource: rows[0] ?? null }
    }),

  recordDownload: t.procedure
    .input(z.object({ resourceId: z.number(), userId: z.string().optional() }))
    .mutation(async ({ input }) => {
      const { pool } = require('../../db')
      if (!pool) return { ok: false, warning: 'DATABASE_URL not set' }

      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query('INSERT INTO resources_downloads (resource_id, user_id, created_at) VALUES ($1, $2, now())', [input.resourceId, input.userId || null])
        await client.query('UPDATE resources SET downloads_count = COALESCE(downloads_count, 0) + 1 WHERE id = $1', [input.resourceId])
        await client.query('COMMIT')
        return { ok: true }
      } catch (err) {
        await client.query('ROLLBACK')
        console.error('recordDownload error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    }),

  create: t.procedure
    .input(z.object({ title: z.string().min(1), description: z.string().optional(), fileUrl: z.string().optional(), isPremium: z.boolean().default(false), priceCents: z.number().min(0).default(0) }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.pool) return { ok: false, warning: 'DATABASE_URL not set' }
      if (!ctx.user) return { ok: false, error: 'Unauthorized' }

      const client = await ctx.pool.connect()
      try {
        await client.query('BEGIN')
        const res = await client.query(
          `INSERT INTO resources (title, description, file_url, is_premium, price_cents, creator_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [input.title, input.description || null, input.fileUrl || null, input.isPremium, input.priceCents, ctx.user.id]
        )
        await client.query('COMMIT')
        return { ok: true, resource: res.rows[0] }
      } catch (err) {
        await client.query('ROLLBACK')
        console.error('resources.create error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    })
})
