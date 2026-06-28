import { router, publicProcedure } from '../trpc/trpc'
import { z } from 'zod'

// In-memory fallback store when DB is not configured
const inMemoryDesigns: any[] = []
let nextId = 1

export const router = router({
  list: publicProcedure
    .input(z.object({ page: z.number().min(1).default(1), perPage: z.number().min(1).max(100).default(12), q: z.string().optional(), category: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.db) {
        // TODO: implement actual DB queries using Drizzle when ctx.db exists
        // For now, read from DB if available else fallback
      }
      // Fallback: simple filter + pagination
      let items = inMemoryDesigns.slice()
      if (input.q) {
        const q = input.q.toLowerCase()
        items = items.filter((d) => d.title.toLowerCase().includes(q) || (d.description && d.description.toLowerCase().includes(q)))
      }
      if (input.category) {
        items = items.filter((d) => d.category_id === input.category)
      }
      const start = (input.page - 1) * input.perPage
      const paged = items.slice(start, start + input.perPage)
      return { items: paged, total: items.length }
    }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    if (ctx.db) {
      // TODO: implement DB lookup
    }
    const found = inMemoryDesigns.find((d) => d.slug === input.slug)
    if (!found) throw new Error('Not found')
    return found
  }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1), description: z.string().optional(), slug: z.string().min(1), storage_path: z.string().min(1), category_id: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      // Require auth in production; for now allow creation and attribute to system user if unauthenticated
      const authorId = ctx.user?.id || 1
      const newItem = {
        id: nextId++,
        title: input.title,
        description: input.description || '',
        slug: input.slug,
        author_id: authorId,
        storage_path: input.storage_path,
        preview_path: input.storage_path,
        category_id: input.category_id,
        likes_count: 0,
        downloads_count: 0,
        created_at: new Date().toISOString(),
      }
      if (ctx.db) {
        // TODO: persist to DB
      } else {
        inMemoryDesigns.push(newItem)
      }
      return newItem
    }),

  like: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.db) {
      // TODO: DB increment
    }
    const found = inMemoryDesigns.find((d) => d.id === input.id)
    if (!found) throw new Error('Design not found')
    found.likes_count = (found.likes_count || 0) + 1
    return { success: true }
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.db) {
      // TODO: DB delete
    }
    const idx = inMemoryDesigns.findIndex((d) => d.id === input.id)
    if (idx === -1) throw new Error('Not found')
    inMemoryDesigns.splice(idx, 1)
    return { success: true }
  })
})
