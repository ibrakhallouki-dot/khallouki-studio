import React from 'react'
import { trpc } from '../lib/trpc'
import Loading from './Loading'
import EmptyState from './EmptyState'
import Pagination from './Pagination'
import { Link } from 'react-router-dom'

export default function Feed(){
  const [page, setPage] = React.useState(1)
  const perPage = 9
  const { data, isLoading } = trpc.designs.list.useQuery({ page, perPage })

  if (isLoading) return <Loading />
  if (!data || data.items.length === 0) return <EmptyState title="No designs yet" subtitle="Be the first to upload a design" action={<Link to="/upload" className="px-4 py-2 bg-gold rounded text-black">Upload</Link>} />

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.items.map((d:any)=> (
          <Link key={d.id} to={`/designs/${d.slug}`} className="block bg-gray-900 p-4 rounded">
            <div className="h-44 bg-gray-800 rounded mb-3 overflow-hidden flex items-center justify-center">
              {d.preview_path ? <img src={d.preview_path} alt={d.title} className="object-cover w-full h-full"/> : <div className="text-silver">No preview</div>}
            </div>
            <h3 className="text-lg font-semibold">{d.title}</h3>
            <p className="text-silver text-sm mt-1">{d.description?.slice(0, 80)}</p>
          </Link>
        ))}
      </div>
      <Pagination page={page} total={data.total} perPage={perPage} onPage={setPage} />
    </div>
  )
}
