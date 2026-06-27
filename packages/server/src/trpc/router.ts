@@
-import { initTRPC } from '@trpc/server'
-import { z } from 'zod'
-import { createTRPCContext } from './context'
-import { designsRouter } from './routers/designs'
-
-const t = initTRPC.context<typeof ({} as any)>().create()
-
-// Root router
-export const appRouter = t.router({
-  designs: designsRouter,
-  health: t.procedure.query(() => ({ ok: true }))
-})
-
-export type AppRouter = typeof appRouter
+import { initTRPC } from '@trpc/server'
+import { createTRPCContext } from './context'
+import { designsRouter } from './routers/designs'
+import { resourcesRouter } from './routers/resources'
+import { interactionsRouter } from './routers/interactions'
+
+const t = initTRPC.context<any>().create()
+
+export const appRouter = t.router({
+  designs: designsRouter,
+  resources: resourcesRouter,
+  interactions: interactionsRouter,
+  health: t.procedure.query(() => ({ ok: true }))
+})
+
+export type AppRouter = typeof appRouter
