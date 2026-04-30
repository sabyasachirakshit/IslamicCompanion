import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import './App.css'

const pages = {
  dashboard: { title: 'Dashboard', component: <Dashboard /> },
}

function App() {
  const [activePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const current = pages[activePage]

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Topbar pageTitle={current.title} onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="app-content">
          {current.component}
        </main>
      </div>
    </div>
  )
}

export default App
