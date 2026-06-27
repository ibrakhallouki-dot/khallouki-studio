import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { TrpcProvider } from './lib/TrpcProvider'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TrpcProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TrpcProvider>
  </React.StrictMode>
)
