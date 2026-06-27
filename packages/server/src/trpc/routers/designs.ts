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
        ? eq(designs.title, input.search) // simple equality for now; TODO: implement ILIKE search
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

      // Use raw SQL for atomic increment + insert into design_views.
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
    })
})
