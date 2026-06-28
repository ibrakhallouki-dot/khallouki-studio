import { router, publicProcedure } from '../trpc/trpc'

export const router = router({
  // Admin tools will be added here. For now, expose a simple health check and counts
  stats: publicProcedure.query(async ({ ctx }) => {
    if (ctx.db) {
      // TODO: real counts
    }
    return { users: 0, designs: 0, orders: 0 }
  })
})
