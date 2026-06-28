import React from 'react'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import { trpc } from '../lib/trpc'
import { useParams, Link } from 'react-router-dom'

export default function DesignDetail(){
  const { slug } = useParams()
  const { data, isLoading } = trpc.designs.getBySlug.useQuery({ slug: slug || '' }, { enabled: !!slug })
  const likeMut = trpc.designs.like.useMutation()

  if (isLoading) return <Loading />
  if (!data) return <EmptyState title="Design not found" subtitle="This design may have been removed." />

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="h-96 bg-gray-800 rounded overflow-hidden">
            {data.preview_path ? <img src={data.preview_path} alt={data.title} className="object-cover w-full h-full"/> : <div className="text-silver p-6">No preview</div>}
          </div>
          <h1 className="text-3xl font-playfair text-gold mt-6">{data.title}</h1>
          <p className="text-silver mt-3">{data.description}</p>
        </div>
        <aside className="p-4 bg-gray-900 rounded">
          <div className="mb-4">By <Link to={`/profile/${data.author_id}`} className="text-gold">Creator</Link></div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-800 rounded" onClick={() => likeMut.mutate({ id: data.id })}>Like ({data.likes_count || 0})</button>
            <a href={data.storage_path} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gold text-black rounded">Download</a>
          </div>
        </aside>
      </div>
    </div>
  )
}
