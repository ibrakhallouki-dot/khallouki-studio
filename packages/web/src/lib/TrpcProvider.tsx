import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc, trpcClient } from './trpc'

const queryClient = new QueryClient()

export function TrpcProvider({ children }: { children: React.ReactNode }){
  return (
    <trpc.Provider client={trpcClient as any} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
