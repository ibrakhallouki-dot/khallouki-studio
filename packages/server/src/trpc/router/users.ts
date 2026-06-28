import { router, publicProcedure } from '../trpc/trpc'
import { z } from 'zod'

const inMemoryUsers: any[] = []
let nextUserId = 1

export const router = router({
  current: publicProcedure.query(async ({ ctx }) => {
    if (ctx.user) return ctx.user
    return null
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    if (ctx.db) {
      // TODO DB lookup
    }
    return inMemoryUsers.find((u) => u.id === input.id) || null
  }),

  ensureUserFromSupabase: publicProcedure.input(z.object({ supabase_id: z.string(), email: z.string().optional() })).mutation(async ({ ctx, input }) => {
    if (ctx.db) {
      // TODO: create or fetch user in DB
    }
    let user = inMemoryUsers.find((u) => u.supabase_id === input.supabase_id)
    if (!user) {
      user = { id: nextUserId++, supabase_id: input.supabase_id, email: input.email, role: 'user', created_at: new Date().toISOString() }
      inMemoryUsers.push(user)
    }
    return user
  })
})
