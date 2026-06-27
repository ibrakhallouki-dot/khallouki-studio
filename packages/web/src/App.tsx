import React from 'react'
import { TrpcProvider } from './lib/TrpcProvider'
import Home from './pages/Home'

export default function App(){
  return (
    <TrpcProvider>
      <Home />
    </TrpcProvider>
  )
}
