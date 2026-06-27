import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

export const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query(({ input }) => ({ greeting: `Hello ${input?.name ?? 'world'}` })),
  health: t.procedure.query(() => ({ ok: true }))
})

export type AppRouter = typeof appRouter
