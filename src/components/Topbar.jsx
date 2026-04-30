import { useState, useEffect, useRef } from 'react'

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
)

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const ResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.55"/>
  </svg>
)

export default function Topbar({ pageTitle, onMenuToggle }) {
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('walletBalance')
    return saved !== null ? parseFloat(saved) : 0
  })
  const [confirming, setConfirming] = useState(false)
  const confirmTimer = useRef(null)

  const handleResetClick = () => {
    if (!confirming) {
      setConfirming(true)
      confirmTimer.current = setTimeout(() => setConfirming(false), 4000)
    } else {
      clearTimeout(confirmTimer.current)
      localStorage.clear()
      window.location.reload()
    }
  }

  useEffect(() => () => clearTimeout(confirmTimer.current), [])

  useEffect(() => {
    const handleStorage = () => {
      const updated = localStorage.getItem('walletBalance')
      setWalletBalance(updated !== null ? parseFloat(updated) : 0)
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('walletUpdated', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('walletUpdated', handleStorage)
    }
  }, [])

  const formatted = walletBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle sidebar">
          <MenuIcon />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="topbar-right">
        <button
          className={`reset-btn${confirming ? ' reset-btn-confirm' : ''}`}
          onClick={handleResetClick}
          title="Reset all data"
        >
          <ResetIcon />
          <span>{confirming ? 'Confirm Reset?' : 'Reset Data'}</span>
        </button>

        <div className="wallet-badge">
          <div className="wallet-icon-wrap">
            <WalletIcon />
          </div>
          <div className="wallet-info">
            <span className="wallet-label">Wallet Balance</span>
            <span className="wallet-amount">₹ {formatted}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
