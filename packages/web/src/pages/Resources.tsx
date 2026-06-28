import React from 'react'
import { trpc } from '../lib/trpc'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import { Link } from 'react-router-dom'

export default function ResourcesPage(){
  const [page, setPage] = React.useState(1)
  const perPage = 12
  const { data, isLoading } = trpc.resources.list.useQuery({ page, perPage })

  if (isLoading) return <Loading />
  if (!data || data.items.length === 0) return <EmptyState title="No resources yet" subtitle="Upload the first downloadable resource" action={<Link to="/resources/upload" className="px-4 py-2 bg-gold rounded text-black">Upload</Link>} />

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.items.map((r:any)=>(
          <div key={r.id} className="bg-gray-900 p-4 rounded">
            <div className="h-40 bg-gray-800 rounded mb-3 flex items-center justify-center">
              <span className="text-silver">Resource preview</span>
            </div>
            <h3 className="text-lg font-semibold">{r.title}</h3>
            <p className="text-silver text-sm mt-1">{r.description?.slice(0,80)}</p>
            <div className="mt-3 flex gap-2">
              <a href={r.storage_path} target="_blank" rel="noreferrer" className="px-3 py-1 bg-gold text-black rounded">Download</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
