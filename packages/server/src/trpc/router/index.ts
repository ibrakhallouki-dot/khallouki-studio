import { router as t } from '../trpc/trpc'
import { router as designsRouter } from './designs'
import { router as usersRouter } from './users'
import { router as resourcesRouter } from './resources'
import { router as ordersRouter } from './orders'
import { z } from 'zod'

// Compose the root router
export const router = t({
  designs: designsRouter,
  users: usersRouter,
  resources: resourcesRouter,
  orders: ordersRouter,
})

export type AppRouter = typeof router
