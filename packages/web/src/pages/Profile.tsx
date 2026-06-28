import React from 'react'
import { trpc } from '../lib/trpc'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function Profile(){
  const userQ = trpc.users.current.useQuery()
  const navigate = useNavigate()
  if (userQ.isLoading) return <Loading />
  if (!userQ.data) return <EmptyState title="Not signed in" subtitle="Please log in to view your profile" action={<button onClick={()=>navigate('/login')} className="px-4 py-2 bg-gold rounded text-black">Login</button>} />

  const u = userQ.data
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="bg-gray-900 p-4 rounded">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-800 rounded-full overflow-hidden">
            {u.avatar_url ? <img src={u.avatar_url} alt="avatar" className="w-full h-full object-cover"/> : <div className="text-silver p-4">No avatar</div>}
          </div>
          <div>
            <div className="text-lg font-semibold">{u.display_name || u.email}</div>
            <div className="text-silver">{u.role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
