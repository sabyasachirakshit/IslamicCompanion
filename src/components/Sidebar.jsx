const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const GoodDeedsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const CrescentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: <DashboardIcon /> },
  { id: 'gooddeeds',  label: 'Good Deeds',  icon: <GoodDeedsIcon /> },
]

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse, activePage, onNavigate }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}${collapsed ? ' collapsed' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo-icon">
            <CrescentIcon />
          </span>
          <div className="sidebar-logo-text">
            <span className="logo-title">Islamic</span>
            <span className="logo-sub">Companion</span>
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        <div className="nav-section-label">Main Menu</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              href="#"
              className={`sidebar-nav-item${activePage === item.id ? ' active' : ''}`}
              onClick={e => { e.preventDefault(); onNavigate(item.id); onClose() }}
              title={collapsed ? item.label : undefined}
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
