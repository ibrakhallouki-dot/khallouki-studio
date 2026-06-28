import superjson from 'superjson'
import type { AppRouter } from '../../../server/src/trpc/router'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'

// React hooks/provider instance
export const trpc = createTRPCReact<AppRouter>()

// Browser client to pass to <trpc.Provider client={...}>
export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [httpBatchLink({ url: '/trpc' })]
})
