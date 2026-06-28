import superjson from 'superjson'
import type { AppRouter } from '../../../server/src/trpc/router'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()
