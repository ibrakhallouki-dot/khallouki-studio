import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { createTRPCContext } from './context'
import { designsRouter } from './routers/designs'

const t = initTRPC.context<typeof ({} as any)>().create()

// Root router
export const appRouter = t.router({
  designs: designsRouter,
  health: t.procedure.query(() => ({ ok: true }))
})

export type AppRouter = typeof appRouter
