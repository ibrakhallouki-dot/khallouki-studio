import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '../../../server/src/trpc/router'

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({ url: '/trpc' })
  ]
})
