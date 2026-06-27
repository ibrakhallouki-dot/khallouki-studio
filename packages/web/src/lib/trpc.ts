import superjson from 'superjson'
import type { AppRouter } from '../../../server/src/trpc/router'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [httpBatchLink({ url: '/trpc' })]
})
