const QuranIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)

const PrayerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const DuaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const ZakatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

const stats = [
  { icon: <QuranIcon />, label: 'Quran Verses', value: '6,236', color: '#00E5A0', bg: 'rgba(0,229,160,0.12)', glow: '0 0 14px rgba(0,229,160,0.25)' },
  { icon: <PrayerIcon />, label: 'Prayer Times', value: '5 Daily', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', glow: '0 0 14px rgba(96,165,250,0.25)' },
  { icon: <DuaIcon />, label: 'Saved Duas', value: '0', color: '#F472B6', bg: 'rgba(244,114,182,0.12)', glow: '0 0 14px rgba(244,114,182,0.25)' },
  { icon: <ZakatIcon />, label: 'Zakat Due', value: '₹ 0.00', color: '#FFD700', bg: 'rgba(255,215,0,0.12)', glow: '0 0 14px rgba(255,215,0,0.25)' },
]

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-content">
          <p className="welcome-bismillah">بسم الله الرحمن الرحيم</p>
          <h2>Assalamu Alaikum 👋</h2>
          <p className="welcome-sub">Welcome to your Islamic Companion. Your spiritual journey starts here.</p>
        </div>
        <div className="dashboard-welcome-deco">☪</div>
      </div>

      <div className="dashboard-cards">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-icon" style={{ background: s.bg, color: s.color, boxShadow: s.glow }}>
              {s.icon}
            </div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-quote-card">
        <div className="quote-icon">❝</div>
        <p className="quote-text">
          Indeed, with hardship will be ease.
        </p>
        <p className="quote-ref">— Surah Ash-Sharh (94:6)</p>
      </div>
    </div>
  )
}
