import cors from 'cors'
import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './trpc/router'
import dotenv from 'dotenv'
import { createTRPCContext } from './trpc/context'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext
  })
)

const port = process.env.PORT ?? 4000
app.listen(port, () => console.log(`Server listening on port ${port}`))
