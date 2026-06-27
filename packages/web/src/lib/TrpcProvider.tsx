import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from './lib/trpc'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

const queryClient = new QueryClient()

export function TrpcProvider({ children }: { children: React.ReactNode }){
  return (
    <trpc.Provider client={trpc as any} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
