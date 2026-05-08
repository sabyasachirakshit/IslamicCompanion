import { useState } from 'react'

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

const DiaryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5z"/>
    <polyline points="12 2 12 7 17 7"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
  </svg>
)

const AboutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const RewardsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
)

const BadDeedsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const ExerciseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/>
    <line x1="10" y1="1" x2="10" y2="4"/>
    <line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
)

const UrgesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M5 8H4a4 4 0 0 0 0 8h1"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <path d="M12 6v12"/>
  </svg>
)

const DhikrIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
)

const AdditionalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const DeedsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
)

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: <DashboardIcon /> },
  { id: 'gooddeeds',  label: 'Prayers',    icon: <GoodDeedsIcon /> },
  { id: 'deeds',      label: 'Good Deeds', icon: <DeedsIcon /> },
  { id: 'dhikr',      label: 'Dhikr',      icon: <DhikrIcon /> },
  { id: 'baddeeds',   label: 'Bad Deeds',  icon: <BadDeedsIcon /> },
  { id: 'diary',      label: 'Diary',      icon: <DiaryIcon /> },
  { id: 'rewards',    label: 'Rewards',    icon: <RewardsIcon /> },
  { id: 'about',      label: 'About',      icon: <AboutIcon /> },
]

const ADDITIONAL_ITEMS = [
  { id: 'exercise', label: 'Exercise', icon: <ExerciseIcon /> },
  { id: 'urges',    label: 'Urges',    icon: <UrgesIcon /> },
]

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse, activePage, onNavigate }) {
  const [additionalOpen, setAdditionalOpen] = useState(false)

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

        <div className="sidebar-nav-wrapper">
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

        <div className="nav-section-label">Additional</div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item sidebar-dropdown-toggle${additionalOpen ? ' dropdown-open' : ''}${ADDITIONAL_ITEMS.some(i => activePage === i.id) ? ' active' : ''}`}
            onClick={() => !collapsed && setAdditionalOpen(s => !s)}
            title={collapsed ? 'Additional' : undefined}
          >
            <span className="nav-icon"><AdditionalIcon /></span>
            <span className="nav-label">Additional</span>
            {!collapsed && (
              <span className={`sidebar-chevron${additionalOpen ? ' chevron-up' : ''}`}><ChevronDownIcon /></span>
            )}
          </button>
          {additionalOpen && !collapsed && (
            <div className="sidebar-submenu">
              {ADDITIONAL_ITEMS.map(item => (
                <a
                  key={item.id}
                  href="#"
                  className={`sidebar-nav-item sidebar-subitem${activePage === item.id ? ' active' : ''}`}
                  onClick={e => { e.preventDefault(); onNavigate(item.id); onClose() }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </a>
              ))}
            </div>
          )}
        </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">بسم الله الرحمن الرحيم</div>
          <div className="sidebar-footer-sub">In the name of Allah, The Most Compassionate, the Most Merciful</div>
        </div>
      </aside>
    </>
  )
}
