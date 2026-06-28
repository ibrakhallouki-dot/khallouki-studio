import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthProvider'

export default function Header(){
  const auth = (() => {
    try { return useAuth() } catch (e) { return null }
  })()

  return (
    <header className="py-6 px-6 border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-playfair text-gold">Khallouki Studio</Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-silver">Home</Link>
          <Link to="/designs" className="text-silver">Designs</Link>
          <Link to="/resources" className="text-silver">Resources</Link>
          <Link to="/about" className="text-silver">About</Link>
          <Link to="/contact" className="text-silver">Contact</Link>
          {auth && auth.user ? (
            <>
              <Link to="/dashboard" className="text-silver">Dashboard</Link>
              <button onClick={() => auth.signOut()} className="px-3 py-1 border border-gray-700 rounded text-silver">Sign out</button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 border border-gray-700 rounded text-silver">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
