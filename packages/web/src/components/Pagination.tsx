import React from 'react'

export default function Pagination({ page, total, perPage, onPage }: { page: number, total: number, perPage: number, onPage: (p: number) => void }){
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button className="px-3 py-1 bg-gray-800 rounded" onClick={() => onPage(Math.max(1, page - 1))} disabled={page<=1}>Prev</button>
      <span className="px-3 py-1">Page {page} / {totalPages}</span>
      <button className="px-3 py-1 bg-gray-800 rounded" onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page>=totalPages}>Next</button>
    </div>
  )
}
