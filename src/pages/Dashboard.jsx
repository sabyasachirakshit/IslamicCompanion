import { ALL_PRAYERS, todayStatusKey } from '../data/prayers'

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

function getPrayerMetrics() {
  let status = {}
  try { status = JSON.parse(localStorage.getItem(todayStatusKey()) || '{}') } catch { /**/ }
  const done   = (...types) => ALL_PRAYERS.filter(p => types.includes(p.type) && status[p.id] && status[p.id] !== 'missed').length
  const missed = (...types) => ALL_PRAYERS.filter(p => types.includes(p.type) && status[p.id] === 'missed').length
  const total  = (...types) => ALL_PRAYERS.filter(p => types.includes(p.type)).length
  return {
    fardh:  { done: done('fardh'),         missed: missed('fardh'),         total: total('fardh') },
    sunnah: { done: done('sunnah'),        missed: missed('sunnah'),        total: total('sunnah') },
    nafl:   { done: done('nafl','wajib'),  missed: missed('nafl','wajib'),  total: total('nafl','wajib') },
  }
}

const stats = [
  { icon: <QuranIcon />, label: 'Quran Verses', value: '6,236', color: '#00E5A0', bg: 'rgba(0,229,160,0.12)', glow: '0 0 14px rgba(0,229,160,0.25)' },
  { icon: <PrayerIcon />, label: 'Prayer Times', value: '5 Daily', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', glow: '0 0 14px rgba(96,165,250,0.25)' },
  { icon: <DuaIcon />, label: 'Saved Duas', value: '0', color: '#F472B6', bg: 'rgba(244,114,182,0.12)', glow: '0 0 14px rgba(244,114,182,0.25)' },
  { icon: <ZakatIcon />, label: 'Zakat Due', value: '₹ 0.00', color: '#FFD700', bg: 'rgba(255,215,0,0.12)', glow: '0 0 14px rgba(255,215,0,0.25)' },
]

function PmCell({ label, value, total, color, variant }) {
  const isDone = variant === 'done'
  return (
    <div className={`pm-cell pm-cell-${variant}`}>
      <span className="pm-cell-value" style={{ color }}>{value}</span>
      <span className="pm-cell-total">/{total}</span>
      <span className="pm-cell-label">{isDone ? `${label} Done` : `${label} Missed`}</span>
    </div>
  )
}

export default function Dashboard({ userName }) {
  const pm = getPrayerMetrics()
  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-content">
          <p className="welcome-bismillah">بسم الله الرحمن الرحيم</p>
          <h2>Assalamu Alaikum{userName ? `, ${userName}` : ''} 👋</h2>
          <p className="welcome-sub">Welcome to your Islamic Companion. Your spiritual journey starts here.</p>
        </div>
      </div>

      {/* <div className="dashboard-cards">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-icon" style={{ background: s.bg, color: s.color, boxShadow: s.glow }}>
              {s.icon}
            </div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value">{s.value}</div>
          </div>
        ))}
      </div> */}

      <div className="dashboard-prayer-metrics">
        <h3 className="pm-title">Today's Prayer Overview</h3>
        <div className="pm-grid">
          <PmCell label="Fardh"      value={pm.fardh.done}   total={pm.fardh.total}  color="#00E5A0" variant="done" />
          <PmCell label="Sunnah"     value={pm.sunnah.done}  total={pm.sunnah.total} color="#A78BFA" variant="done" />
          <PmCell label="Nafl+Witr" value={pm.nafl.done}    total={pm.nafl.total}   color="#F472B6" variant="done" />
          <PmCell label="Fardh"      value={pm.fardh.missed}  total={pm.fardh.total}  color="#F87171" variant="missed" />
          <PmCell label="Sunnah"     value={pm.sunnah.missed} total={pm.sunnah.total} color="#FCA5A5" variant="missed" />
          <PmCell label="Nafl+Witr" value={pm.nafl.missed}   total={pm.nafl.total}   color="#FCA5A5" variant="missed" />
        </div>
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
