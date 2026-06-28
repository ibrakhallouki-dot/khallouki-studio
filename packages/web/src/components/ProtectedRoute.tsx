import React from 'react'
import { Navigate } from 'react-router-dom'
import { trpc } from '../lib/trpc'

export default function ProtectedRoute({ children }: { children: React.ReactNode }){
  // Use trpc.users.current
  const q = trpc.users.current.useQuery()
  if (q.isLoading) return <div className="p-8">Loading...</div>
  if (!q.data) return <Navigate to="/login" replace />
  return <>{children}</>
}
