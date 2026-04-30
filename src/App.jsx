import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import NameModal from './components/NameModal'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [activePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '')

  return (
    <>
      {!userName && <NameModal onSave={setUserName} />}
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="app-main">
          <Topbar pageTitle="Dashboard" onMenuToggle={() => setSidebarOpen(o => !o)} />
          <main className="app-content">
            {activePage === 'dashboard' && <Dashboard userName={userName} />}
          </main>
        </div>
      </div>
    </>
  )
}

export default App
