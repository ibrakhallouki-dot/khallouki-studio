import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { designs } from '../../db/schema'
import { db, pool } from '../../db'
import { eq } from 'drizzle-orm'

const t = initTRPC.context<any>().create()

export const designsRouter = t.router({
  list: t.procedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(12),
        search: z.string().optional()
      }).optional()
    )
    .query(async ({ input }) => {
      const page = input?.page ?? 1
      const perPage = input?.perPage ?? 12
      const offset = (page - 1) * perPage

      if (!db) {
        return { items: [], total: 0, warning: 'DATABASE_URL not set; DB queries are disabled' }
      }

      const whereClause = input?.search
        ? eq(designs.title, input.search) // simple equality for now
        : undefined

      const items = await db.select().from(designs).limit(perPage).offset(offset)
      const totalRes = await db.select({ count: designs.id }).from(designs)
      const total = Array.isArray(totalRes) ? totalRes.length : 0

      return { items, total }
    }),

  getBySlug: t.procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      if (!db || !pool) {
        return { design: null, warning: 'DATABASE_URL not set; DB queries are disabled' }
      }

      const rows = await db.select().from(designs).where(eq(designs.slug, input.slug)).limit(1)
      const design = rows[0] ?? null

      return { design }
    }),

  incrementView: t.procedure
    .input(z.object({ designId: z.number() }))
    .mutation(async ({ input }) => {
      if (!pool) {
        return { ok: false, warning: 'DATABASE_URL not set; cannot record view' }
      }

      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query('UPDATE designs SET views_count = views_count + 1 WHERE id = $1', [input.designId])
        await client.query('INSERT INTO design_views (design_id, created_at) VALUES ($1, now())', [input.designId])
        await client.query('COMMIT')
        return { ok: true }
      } catch (err) {
        await client.query('ROLLBACK')
        console.error('incrementView error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    }),

  create: t.procedure
    .input(z.object({ title: z.string().min(1), slug: z.string().min(1), description: z.string().optional(), imageUrl: z.string().optional(), priceCents: z.number().min(0).default(0), isPremium: z.boolean().default(false) }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.pool) return { ok: false, warning: 'DATABASE_URL not set' }
      if (!ctx.user) return { ok: false, error: 'Unauthorized' }

      const client = await ctx.pool.connect()
      try {
        await client.query('BEGIN')
        const res = await client.query(
          `INSERT INTO designs (title, slug, description, image_url, price_cents, is_premium, creator_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [input.title, input.slug, input.description || null, input.imageUrl || null, input.priceCents || 0, input.isPremium, ctx.user.id]
        )
        await client.query('COMMIT')
        return { ok: true, design: res.rows[0] }
      } catch (err) {
        await client.query('ROLLBACK')
        console.error('designs.create error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    }),

  update: t.procedure
    .input(z.object({ id: z.number(), title: z.string().min(1).optional(), description: z.string().optional(), imageUrl: z.string().optional(), priceCents: z.number().min(0).optional(), isPremium: z.boolean().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.pool) return { ok: false, warning: 'DATABASE_URL not set' }
      if (!ctx.user) return { ok: false, error: 'Unauthorized' }

      const client = await ctx.pool.connect()
      try {
        const existing = await client.query('SELECT * FROM designs WHERE id = $1 LIMIT 1', [input.id])
        if (!existing.rows[0]) return { ok: false, error: 'Not found' }
        const design = existing.rows[0]
        if (design.creator_id !== ctx.user.id && ctx.user.role !== 'admin') return { ok: false, error: 'Forbidden' }

        const fields: string[] = []
        const values: any[] = []
        let idx = 1
        if (input.title !== undefined) { fields.push(`title = $${idx++}`); values.push(input.title) }
        if (input.description !== undefined) { fields.push(`description = $${idx++}`); values.push(input.description) }
        if (input.imageUrl !== undefined) { fields.push(`image_url = $${idx++}`); values.push(input.imageUrl) }
        if (input.priceCents !== undefined) { fields.push(`price_cents = $${idx++}`); values.push(input.priceCents) }
        if (input.isPremium !== undefined) { fields.push(`is_premium = $${idx++}`); values.push(input.isPremium) }
        if (!fields.length) return { ok: true, design }

        const q = `UPDATE designs SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`
        values.push(input.id)
        const res = await client.query(q, values)
        return { ok: true, design: res.rows[0] }
      } catch (err) {
        console.error('designs.update error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    }),

  delete: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.pool) return { ok: false, warning: 'DATABASE_URL not set' }
      if (!ctx.user) return { ok: false, error: 'Unauthorized' }

      const client = await ctx.pool.connect()
      try {
        const existing = await client.query('SELECT * FROM designs WHERE id = $1 LIMIT 1', [input.id])
        if (!existing.rows[0]) return { ok: false, error: 'Not found' }
        const design = existing.rows[0]
        if (design.creator_id !== ctx.user.id && ctx.user.role !== 'admin') return { ok: false, error: 'Forbidden' }

        await client.query('DELETE FROM designs WHERE id = $1', [input.id])
        return { ok: true }
      } catch (err) {
        console.error('designs.delete error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    })
})
