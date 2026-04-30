const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const CrescentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, active: true },
  ]

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo-icon">
            <CrescentIcon />
          </span>
          <div className="sidebar-logo-text">
            <span className="logo-title">Islamic</span>
            <span className="logo-sub">Companion</span>
          </div>
        </div>

        <div className="nav-section-label">Main Menu</div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <a
              key={item.label}
              href="#"
              className={`sidebar-nav-item${item.active ? ' active' : ''}`}
              onClick={e => e.preventDefault()}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">بسم الله الرحمن الرحيم</div>
          <div className="sidebar-footer-sub">In the name of Allah</div>
        </div>
      </aside>
    </>
  )
}
