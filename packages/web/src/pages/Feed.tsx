import React, { useEffect, useState } from 'react'
import { trpc } from '../lib/trpc'
import DesignCard from '../components/DesignCard'

export default function Feed(){
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<any[]>([])

  useEffect(()=>{
    let cancelled = false
    async function load(){
      try{
        const res = await trpc.designs.list.query({ page, perPage: 12 })
        if(!cancelled) setItems(res.items ?? [])
      }catch(err){
        console.error('load designs error', err)
      }
    }
    load()
    return ()=>{ cancelled = true }
  }, [page])

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-playfair text-gold mb-6">Design Feed</h2>
      <div className="grid grid-cols-3 gap-6">
        {items.map(d => <DesignCard key={d.id} design={d} />)}
      </div>
      <div className="mt-6 flex justify-between">
        <button onClick={()=> setPage(p => Math.max(1, p-1))} className="px-4 py-2 bg-gray-800 rounded">Previous</button>
        <button onClick={()=> setPage(p => p+1)} className="px-4 py-2 bg-gray-800 rounded">Next</button>
      </div>
    </main>
  )
}
