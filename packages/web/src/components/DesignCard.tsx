import React from 'react'
import { Link } from 'react-router-dom'

export default function DesignCard({ design }: { design: any }){
  return (
    <article className="bg-gray-900 p-4 rounded">
      <Link to={`/designs/${design?.slug}`}>
        <div className="h-40 bg-gray-800 rounded mb-3 bg-cover bg-center" style={{ backgroundImage: `url(${design?.image_url || ''})` }} />
        <h3 className="text-lg font-semibold">{design?.title ?? 'Untitled'}</h3>
        <p className="text-sm text-silver mt-2">{design?.description ?? ''}</p>
      </Link>
    </article>
  )
}
