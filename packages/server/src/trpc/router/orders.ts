import { router, publicProcedure } from '../trpc/trpc'
import { z } from 'zod'

const inMemoryOrders: any[] = []
let nextOrderId = 1

export const router = router({
  create: publicProcedure.input(z.object({ user_id: z.number().optional(), design_id: z.number().optional(), custom_request: z.string().optional() })).mutation(async ({ ctx, input }) => {
    const userId = input.user_id || ctx.user?.id || 1
    const newOrder = { id: nextOrderId++, user_id: userId, design_id: input.design_id || null, custom_request: input.custom_request || null, status: 'pending', created_at: new Date().toISOString() }
    if (ctx.db) {
      // TODO DB save
    } else {
      inMemoryOrders.push(newOrder)
    }
    return newOrder
  }),

  getByUser: publicProcedure.input(z.object({ user_id: z.number() })).query(async ({ ctx, input }) => {
    if (ctx.db) {
      // TODO DB
    }
    return inMemoryOrders.filter((o) => o.user_id === input.user_id)
  }),

  updateStatus: publicProcedure.input(z.object({ id: z.number(), status: z.string() })).mutation(async ({ ctx, input }) => {
    if (ctx.db) {
      // TODO DB
    }
    const ord = inMemoryOrders.find((o) => o.id === input.id)
    if (!ord) throw new Error('Not found')
    ord.status = input.status
    return { success: true }
  })
})
