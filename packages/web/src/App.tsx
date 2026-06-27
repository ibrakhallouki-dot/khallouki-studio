import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Feed from './pages/Feed'
import DesignDetail from './pages/DesignDetail'
import ResourcesPage from './pages/Resources'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/Admin'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App(){
  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Header />
      <main className="pt-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/designs" element={<Feed/>} />
          <Route path="/designs/:slug" element={<DesignDetail/>} />
          <Route path="/resources" element={<ResourcesPage/>} />
          <Route path="/dashboard/*" element={<Dashboard/>} />
          <Route path="/admin/*" element={<AdminDashboard/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
