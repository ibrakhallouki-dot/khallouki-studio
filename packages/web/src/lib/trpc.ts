import superjson from 'superjson'
import { createTRPCReact } from '@trpc/react-query'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@khallouki/shared'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [httpBatchLink({ url: '/trpc' })]
})
