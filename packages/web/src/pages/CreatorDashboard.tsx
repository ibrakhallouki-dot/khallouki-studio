import React from 'react'
import { trpc } from '../lib/trpc'
import { Link } from 'react-router-dom'

export default function CreatorDashboard(){
  const designsQ = trpc.designs.list.useQuery({ page:1, perPage:50 })

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Creator Dashboard</h2>
      <div className="mb-4 flex gap-3">
        <Link to="/upload" className="px-3 py-2 bg-gold text-black rounded">New Design</Link>
        <Link to="/resources/upload" className="px-3 py-2 bg-gray-800 rounded">Upload Resource</Link>
      </div>
      <section>
        <h3 className="text-lg mb-3">Your designs</h3>
        {designsQ.isLoading ? <div>Loading...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {designsQ.data?.items.map((d:any)=>(
              <Link key={d.id} to={`/designs/${d.slug}`} className="block bg-gray-900 p-3 rounded">
                <div className="h-32 bg-gray-800 rounded mb-2 overflow-hidden">{d.preview_path ? <img src={d.preview_path} className="w-full h-full object-cover" alt={d.title}/> : <div className="p-6 text-silver">No preview</div>}</div>
                <div className="text-silver">{d.title}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
