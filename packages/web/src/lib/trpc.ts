import superjson from 'superjson'
import { createTRPCReact } from '@trpc/react-query'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@khallouki/shared'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: '/trpc',
      headers: () => {
        try {
          if (typeof window === 'undefined') return {}
          const token = window.localStorage.getItem('kh_session')
          if (token) return { Authorization: `Bearer ${token}` }
        } catch (e) {
          // ignore
        }
        return {}
      }
    })
  ]
})
