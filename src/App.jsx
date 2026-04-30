import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import NameModal from './components/NameModal'
import Dashboard from './pages/Dashboard'
import GoodDeeds from './pages/GoodDeeds'
import Deeds from './pages/Deeds'
import BadDeeds from './pages/BadDeeds'
import Rewards from './pages/Rewards'
import About from './pages/About'
import './App.css'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  gooddeeds: 'Prayers',
  deeds: 'Good Deeds',
  baddeeds: 'Bad Deeds',
  rewards: 'Rewards',
  about: 'About',
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '')

  return (
    <>
      {!userName && <NameModal onSave={setUserName} />}
      <div className="app-layout">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
          activePage={activePage}
          onNavigate={setActivePage}
        />
        <div className={`app-main${sidebarCollapsed ? ' main-collapsed' : ''}`}>
          <Topbar
            pageTitle={PAGE_TITLES[activePage]}
            onMenuToggle={() => setSidebarOpen(o => !o)}
          />
          <main className="app-content">
            {activePage === 'dashboard' && <Dashboard userName={userName} onNavigate={setActivePage} />}
            {activePage === 'gooddeeds' && <GoodDeeds />}
            {activePage === 'deeds' && <Deeds />}
            {activePage === 'baddeeds' && <BadDeeds />}
            {activePage === 'rewards' && <Rewards />}
            {activePage === 'about' && <About />}
          </main>
        </div>
      </div>
    </>
  )
}

export default App
