import React from 'react'

export default function SearchBar({ value, onChange, onSearch }: { value: string, onChange: (v: string)=>void, onSearch: ()=>void }){
  return (
    <div className="flex items-center bg-gray-900 rounded px-3 py-2">
      <input value={value} onChange={(e)=>onChange(e.target.value)} className="bg-transparent outline-none flex-1 text-silver" placeholder="Search designs, resources..." />
      <button onClick={onSearch} className="ml-2 px-3 py-1 bg-gold text-black rounded">Search</button>
    </div>
  )
}
