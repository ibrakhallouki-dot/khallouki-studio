import { router, publicProcedure } from '../trpc/trpc'
import { z } from 'zod'

const inMemoryResources: any[] = []
let nextResourceId = 1

export const router = router({
  list: publicProcedure
    .input(z.object({ page: z.number().min(1).default(1), perPage: z.number().min(1).max(100).default(12), q: z.string().optional(), category: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.db) {
        // TODO DB
      }
      let items = inMemoryResources.slice()
      if (input.q) {
        const q = input.q.toLowerCase()
        items = items.filter((r) => r.title.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q)))
      }
      if (input.category) items = items.filter((r) => r.category_id === input.category)
      const start = (input.page - 1) * input.perPage
      const paged = items.slice(start, start + input.perPage)
      return { items: paged, total: items.length }
    }),

  create: publicProcedure.input(z.object({ title: z.string().min(1), description: z.string().optional(), storage_path: z.string().min(1), category_id: z.number().optional() })).mutation(async ({ ctx, input }) => {
    const authorId = ctx.user?.id || 1
    const newItem = { id: nextResourceId++, title: input.title, description: input.description || '', storage_path: input.storage_path, author_id: authorId, downloads_count: 0, category_id: input.category_id }
    if (ctx.db) {
      // TODO DB save
    } else {
      inMemoryResources.push(newItem)
    }
    return newItem
  }),

  incrementDownload: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.db) {
      // TODO DB increment
    }
    const found = inMemoryResources.find((r) => r.id === input.id)
    if (!found) throw new Error('Not found')
    found.downloads_count = (found.downloads_count || 0) + 1
    return { success: true }
  })
})
