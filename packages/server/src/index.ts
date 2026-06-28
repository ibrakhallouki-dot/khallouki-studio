import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { router as createRouter } from './trpc'
import cors from 'cors'
import { createTRPCContext } from './context'

const app = express()
app.use(cors())
app.use(express.json())

// Mount tRPC
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: createRouter,
    createContext: ({ req, res }) => createTRPCContext({ req, res })
  })
)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})
