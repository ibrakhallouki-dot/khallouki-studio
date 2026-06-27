import { initTRPC } from '@trpc/server'
import { createTRPCContext } from './context'
import { designsRouter } from './routers/designs'
import { resourcesRouter } from './routers/resources'
import { interactionsRouter } from './routers/interactions'
import { usersRouter } from './routers/users'
import { adminRouter } from './routers/admin'

const t = initTRPC.context<any>().create()

export const appRouter = t.router({
  designs: designsRouter,
  resources: resourcesRouter,
  interactions: interactionsRouter,
  users: usersRouter,
  admin: adminRouter,
  health: t.procedure.query(() => ({ ok: true }))
})

export type AppRouter = typeof appRouter
