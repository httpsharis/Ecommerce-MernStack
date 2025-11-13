import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// App
import App from './App.jsx'

// Render app (routes moved into App.jsx)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
