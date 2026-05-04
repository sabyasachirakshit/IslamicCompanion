import { useState, useEffect, useRef, useCallback } from 'react'

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


const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const SHARE_PLATFORMS = [
  {
    id: 'whatsapp', label: 'WhatsApp',
    color: '#25D366', bg: 'rgba(37,211,102,0.10)',
    url: (u, t) => `https://wa.me/?text=${encodeURIComponent(t + ' ' + u)}`,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      </svg>
    ),
  },
  {
    id: 'facebook', label: 'Facebook',
    color: '#1877F2', bg: 'rgba(24,119,242,0.10)',
    url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'twitter', label: 'X (Twitter)',
    color: '#e7e9ea', bg: 'rgba(231,233,234,0.08)',
    url: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'telegram', label: 'Telegram',
    color: '#26A5E4', bg: 'rgba(38,165,228,0.10)',
    url: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
]

const _dk = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }

export default function Topbar({ pageTitle, onMenuToggle }) {
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('walletBalance')
    return saved !== null ? parseFloat(saved) : 0
  })
  const [todayEarned, setTodayEarned] = useState(() => parseFloat(localStorage.getItem(`dailyEarned_${_dk()}`) || '0'))
  const [todayLost,   setTodayLost]   = useState(() => parseFloat(localStorage.getItem(`dailyLost_${_dk()}`)   || '0'))
  const [confirming,      setConfirming]      = useState(false)
  const [copied,          setCopied]          = useState(false)
  const [walletOpen,      setWalletOpen]      = useState(false)
  const [walletResetStep, setWalletResetStep] = useState(0)
  const profilePic = localStorage.getItem('profilePicture') || null
  const [profileOpen,  setProfileOpen]  = useState(false)
  const [editingName,  setEditingName]  = useState(false)
  const [nameInput,    setNameInput]    = useState(() => localStorage.getItem('userName') || '')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const confirmTimer = useRef(null)
  const profileRef   = useRef(null)
  const settingsRef  = useRef(null)
  const fileInputRef = useRef(null)
  const nameInputRef = useRef(null)

  const handleProfileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 240
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
        canvas.width  = Math.round(img.width  * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        const b64 = canvas.toDataURL('image/jpeg', 0.75)
        localStorage.setItem('profilePicture', b64)
        window.location.reload()
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleRemoveProfile = () => {
    localStorage.removeItem('profilePicture')
    window.location.reload()
  }

  const handleSaveName = () => {
    const trimmed = nameInput.trim()
    if (trimmed) {
      localStorage.setItem('userName', trimmed)
      window.location.reload()
    }
  }

  useEffect(() => {
    if (!profileOpen) return
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [profileOpen])

  const WALLET_CONFIRM_TEXTS = [
    { label: 'Reset Wallet',                       cls: '' },
    { label: 'Are you sure?',                      cls: 'wm-warn-1' },
    { label: 'Are you doubly sure?',               cls: 'wm-warn-2' },
    { label: 'Changes cannot be reverted. Confirm!', cls: 'wm-warn-3' },
  ]

  const handleWalletReset = () => {
    const next = walletResetStep + 1
    if (next < WALLET_CONFIRM_TEXTS.length) {
      setWalletResetStep(next)
    } else {
      localStorage.setItem('walletBalance', '0')
      window.dispatchEvent(new CustomEvent('walletUpdated'))
      setWalletResetStep(0)
      setWalletOpen(false)
    }
  }

  const closeWalletModal = () => { setWalletOpen(false); setWalletResetStep(0) }

  const appUrl  = window.location.origin
  const shareText = 'Track your prayers, good deeds & more with Islamic Companion — share as Sadaqah Jariyah!'

  const handleNativeShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: 'Islamic Companion', text: shareText, url: appUrl })
        .catch(() => {})
    }
  }, [appUrl, shareText])

  const handleCopy = useCallback(() => {
    const text = appUrl
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {
        // Fallback if clipboard API fails
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [appUrl])

  useEffect(() => {
    if (!settingsOpen) return
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [settingsOpen])

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
      setTodayEarned(parseFloat(localStorage.getItem(`dailyEarned_${_dk()}`) || '0'))
      setTodayLost(parseFloat(localStorage.getItem(`dailyLost_${_dk()}`)     || '0'))
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
    <>
      <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle sidebar">
          <MenuIcon />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="topbar-right">
        <button className="wallet-badge wallet-badge-btn" onClick={() => setWalletOpen(true)} title="View wallet">
          <div className="wallet-icon-wrap">
            <WalletIcon />
          </div>
          <div className="wallet-info">
            <span className="wallet-label">Wallet Balance</span>
            <span className={`wallet-amount${walletBalance < 0 ? ' wallet-negative' : ''}`}>₹ {formatted}</span>
          </div>
        </button>

        {/* Profile picture */}
        <div className="profile-wrap" ref={profileRef}>
          <button className="profile-avatar" onClick={() => { setProfileOpen(s => !s); setEditingName(false) }} title="Profile">
            {profilePic
              ? <img src={profilePic} alt="Profile" />
              : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            }
          </button>
          {profileOpen && (
            <div className="profile-dropdown">
              {profilePic && (
                <div className="profile-preview">
                  <img src={profilePic} alt="Current profile" />
                </div>
              )}
              {!editingName && (
                <p className="profile-dd-name"><i>{nameInput || 'No name set'}</i></p>
              )}
              {/* Edit name */}
              {editingName ? (
                <div className="profile-name-edit">
                  <input
                    ref={nameInputRef}
                    className="profile-name-input"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    placeholder="Your name"
                    autoFocus
                  />
                  <button className="profile-dd-btn profile-dd-save" onClick={handleSaveName}>Save</button>
                  <button className="profile-dd-btn profile-dd-cancel" onClick={() => setEditingName(false)}>Cancel</button>
                </div>
              ) : (
                <button className="profile-dd-btn" onClick={() => { setEditingName(true); setTimeout(() => nameInputRef.current?.focus(), 50) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Name
                </button>
              )}
              <button className="profile-dd-btn" onClick={() => fileInputRef.current.click()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {profilePic ? 'Change Photo' : 'Upload Photo'}
              </button>
              {profilePic && (
                <button className="profile-dd-btn profile-dd-remove" onClick={handleRemoveProfile}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  Remove Photo
                </button>
              )}
              <p className="profile-dd-note">Saved on your device only</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfileUpload} />
        </div>

        {/* Settings — extreme right */}
        <div className="settings-wrap" ref={settingsRef}>
          <button className="settings-btn" onClick={() => setSettingsOpen(s => !s)} title="Settings">
            <SettingsIcon />
          </button>
          {settingsOpen && (
            <div className="settings-dropdown">
              <p className="settings-dd-title">Settings</p>

              {/* Share section */}
              <div className="settings-dd-section">
                <p className="settings-dd-label">Share App</p>
                <p className="settings-dd-sub">صدقة جارية · Share as Sadaqah Jariyah</p>
                <div className="share-url-row">
                  <span className="share-url-text">{appUrl}</span>
                  <button className="share-copy-btn" onClick={handleCopy}>
                    {copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy</>}
                  </button>
                </div>
                <div className="share-platforms">
                  {SHARE_PLATFORMS.map(p => (
                    <a key={p.id} href={p.url(appUrl, shareText)} target="_blank" rel="noopener noreferrer"
                      className="share-platform-btn"
                      style={{ '--sp-color': p.color, '--sp-bg': p.bg }}
                      onClick={() => setSettingsOpen(false)}>
                      <span style={{ color: p.color }}>{p.icon}</span>
                      <span>{p.label}</span>
                    </a>
                  ))}
                  {typeof navigator.share === 'function' && (
                    <button className="share-platform-btn share-native-btn" onClick={() => { handleNativeShare(); setSettingsOpen(false) }}>
                      <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></span>
                      <span>More Apps</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Reset section */}
              <div className="settings-dd-section settings-dd-danger">
                <p className="settings-dd-label">Danger Zone</p>
                <button
                  className={`reset-btn${confirming ? ' reset-btn-confirm' : ''}`}
                  onClick={handleResetClick}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ResetIcon />
                  <span>{confirming ? 'Confirm Reset?' : 'Reset All Data'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </header>

    {/* Wallet Modal — outside header so fixed positioning covers full screen */}
    {walletOpen && (
      <div className="wm-overlay" onClick={closeWalletModal}>
          <div className="wm-modal" onClick={e => e.stopPropagation()}>
            <div className="wm-header">
              <div className="wm-icon"><WalletIcon /></div>
              <div>
                <p className="wm-title">Wallet Balance</p>
                <p className={`wm-amount${walletBalance < 0 ? ' wm-negative' : ''}`}>&#8377; {formatted}</p>
              </div>
              <button className="wm-close" onClick={closeWalletModal} aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <p className="wm-note">Your balance is earned by prayers, good deeds and avoiding bad deeds. Deducted on missed prayers, bad deeds committed, and reward redemptions.</p>

            <div className="wm-today-stats">
              <div className="wm-today-item wm-today-earned">
                <span className="wm-today-label">Earned Today</span>
                <span className="wm-today-value">+&#8377;{todayEarned.toFixed(2)}</span>
              </div>
              <div className="wm-today-item wm-today-lost">
                <span className="wm-today-label">Lost Today</span>
                <span className="wm-today-value">-&#8377;{todayLost.toFixed(2)}</span>
              </div>
            </div>

            <div className="wm-reset-area">
              {walletResetStep > 0 && (
                <p className="wm-reset-warning">
                  {walletResetStep === 1 && '⚠️ This will set your wallet to ₹0.'}
                  {walletResetStep === 2 && '⚠️⚠️ Your entire balance will be wiped.'}
                  {walletResetStep === 3 && '❌ This action is permanent and cannot be undone!'}
                </p>
              )}
              <button
                className={`wm-reset-btn ${WALLET_CONFIRM_TEXTS[walletResetStep].cls}`}
                onClick={handleWalletReset}
              >
                {WALLET_CONFIRM_TEXTS[walletResetStep].label}
              </button>
              {walletResetStep > 0 && (
                <button className="wm-cancel-btn" onClick={() => setWalletResetStep(0)}>Cancel</button>
              )}
            </div>
        </div>
      </div>
    )}
    </>
  )
}
