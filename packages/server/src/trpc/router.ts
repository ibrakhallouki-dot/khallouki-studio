import { usersRouter } from './routers/users'
import { adminRouter } from './routers/admin'
@@
 export const appRouter = t.router({
   designs: designsRouter,
   resources: resourcesRouter,
   interactions: interactionsRouter,
+  users: usersRouter,
+  admin: adminRouter,
   health: t.procedure.query(() => ({ ok: true }))
 })
