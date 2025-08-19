import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'   // ← keep the .tsx at the end
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
