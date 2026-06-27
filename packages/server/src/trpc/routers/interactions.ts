import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { designs, design_likes, design_favorites, design_comments, design_downloads } from '../../db/schema'

const t = initTRPC.context<any>().create()

export const interactionsRouter = t.router({
  like: t.procedure
    .input(z.object({ designId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const { db, pool } = require('../../db')
      if (!db || !pool) return { ok: false, warning: 'DATABASE_URL not set' }

      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query('INSERT INTO design_likes (user_id, design_id, created_at) VALUES ($1,$2,now()) ON CONFLICT DO NOTHING', [input.userId, input.designId])
        await client.query('COMMIT')
        return { ok: true }
      } catch (err) {
        await client.query('ROLLBACK')
        console.error('like error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    }),

  unlike: t.procedure
    .input(z.object({ designId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const { pool } = require('../../db')
      if (!pool) return { ok: false, warning: 'DATABASE_URL not set' }
      const client = await pool.connect()
      try {
        await client.query('DELETE FROM design_likes WHERE user_id = $1 AND design_id = $2', [input.userId, input.designId])
        return { ok: true }
      } catch (err) {
        console.error('unlike error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    }),

  favorite: t.procedure
    .input(z.object({ designId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const { pool } = require('../../db')
      if (!pool) return { ok: false, warning: 'DATABASE_URL not set' }
      const client = await pool.connect()
      try {
        await client.query('INSERT INTO design_favorites (user_id, design_id, created_at) VALUES ($1,$2,now()) ON CONFLICT DO NOTHING', [input.userId, input.designId])
        return { ok: true }
      } catch (err) {
        console.error('favorite error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    }),

  unfavorite: t.procedure
    .input(z.object({ designId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const { pool } = require('../../db')
      if (!pool) return { ok: false, warning: 'DATABASE_URL not set' }
      const client = await pool.connect()
      try {
        await client.query('DELETE FROM design_favorites WHERE user_id = $1 AND design_id = $2', [input.userId, input.designId])
        return { ok: true }
      } catch (err) {
        console.error('unfavorite error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    }),

  comment: t.procedure
    .input(z.object({ designId: z.number(), userId: z.string(), rating: z.number().min(1).max(5), comment: z.string().optional() }))
    .mutation(async ({ input }) => {
      const { pool } = require('../../db')
      if (!pool) return { ok: false, warning: 'DATABASE_URL not set' }
      const client = await pool.connect()
      try {
        await client.query('INSERT INTO design_comments (design_id, user_id, rating, comment, created_at) VALUES ($1,$2,$3,$4,now())', [input.designId, input.userId, input.rating, input.comment || null])
        return { ok: true }
      } catch (err) {
        console.error('comment error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    }),

  recordDownload: t.procedure
    .input(z.object({ designId: z.number(), userId: z.string().optional() }))
    .mutation(async ({ input }) => {
      const { pool } = require('../../db')
      if (!pool) return { ok: false, warning: 'DATABASE_URL not set' }
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query('INSERT INTO design_downloads (design_id, user_id, created_at) VALUES ($1, $2, now())', [input.designId, input.userId || null])
        await client.query('UPDATE designs SET downloads_count = downloads_count + 1 WHERE id = $1', [input.designId])
        await client.query('COMMIT')
        return { ok: true }
      } catch (err) {
        await client.query('ROLLBACK')
        console.error('recordDownload error', err)
        return { ok: false, error: String(err) }
      } finally {
        client.release()
      }
    })
})
