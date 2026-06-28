import React from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import { trpc } from '../lib/trpc'

export default function Header(){
  const userQ = trpc.users.current.useQuery()
  const [query, setQuery] = React.useState('')
  return (
    <header className="py-4 px-6 border-b border-gray-800 sticky top-0 bg-black z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-playfair text-gold">Khallouki Studio</Link>
          <nav className="hidden md:flex items-center gap-4 text-silver">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/designs" className="hover:underline">Portfolio</Link>
            <Link to="/services" className="hover:underline">Services</Link>
            <Link to="/resources" className="hover:underline">Resources</Link>
            <Link to="/about" className="hover:underline">About</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block w-72"><SearchBar value={query} onChange={setQuery} onSearch={()=>{ /* navigate to search */ }} /></div>
          {userQ.data ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="px-3 py-1 border border-gray-700 rounded text-silver">Dashboard</Link>
              <Link to="/upload" className="px-3 py-1 bg-gold text-black rounded">Upload</Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-silver">Login</Link>
              <Link to="/signup" className="px-3 py-1 border border-gray-700 rounded text-silver">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
