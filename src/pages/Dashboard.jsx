import { useState, useEffect } from 'react'
import { ALL_PRAYERS, todayStatusKey } from '../data/prayers'

function getTimeGreeting() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return { text: 'Good Morning',   emoji: '🌅' }
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', emoji: '☀️' }
  if (h >= 17 && h < 21) return { text: 'Good Evening',   emoji: '🌆' }
  return                        { text: 'Good Night',     emoji: '🌙' }
}

const AYAHS = [
  { text: 'Indeed, with hardship will be ease.', ref: 'Surah Ash-Sharh (94:6)' },
  { text: 'And He found you lost and guided you.', ref: 'Surah Ad-Duha (93:7)' },
  { text: 'So remember Me; I will remember you.', ref: 'Surah Al-Baqarah (2:152)' },
  { text: 'Allah does not burden a soul beyond that it can bear.', ref: 'Surah Al-Baqarah (2:286)' },
  { text: 'And your Lord says, Call upon Me; I will respond to you.', ref: 'Surah Ghafir (40:60)' },
  { text: 'Verily, Allah is with the patient.', ref: 'Surah Al-Baqarah (2:153)' },
  { text: 'And it is He who is the Forgiving, the Loving.', ref: 'Surah Al-Buruj (85:14)' },
  { text: 'He knows what is in every heart.', ref: 'Surah Al-Mulk (67:13)' },
  { text: 'Do not despair of the mercy of Allah.', ref: 'Surah Az-Zumar (39:53)' },
  { text: 'And whoever relies upon Allah — then He is sufficient for him.', ref: 'Surah At-Talaq (65:3)' },
  { text: 'Indeed, Allah is with those who fear Him and those who are doers of good.', ref: 'Surah An-Nahl (16:128)' },
  { text: 'And We have certainly made the Quran easy for remembrance, so is there any who will remember?', ref: 'Surah Al-Qamar (54:17)' },
  { text: 'Unquestionably, by the remembrance of Allah hearts are assured.', ref: 'Surah Ar-Ra\'d (13:28)' },
  { text: 'And speak to people good words.', ref: 'Surah Al-Baqarah (2:83)' },
  { text: 'Indeed, Allah will not change the condition of a people until they change what is in themselves.', ref: 'Surah Ar-Ra\'d (13:11)' },
  { text: 'And He is with you wherever you are.', ref: 'Surah Al-Hadid (57:4)' },
  { text: 'Allah is the ally of those who believe.', ref: 'Surah Al-Baqarah (2:257)' },
  { text: 'So be patient. Indeed, the promise of Allah is truth.', ref: 'Surah Ghafir (40:55)' },
  { text: 'My mercy encompasses all things.', ref: 'Surah Al-A\'raf (7:156)' },
  { text: 'Whoever does righteousness — it is for his own soul.', ref: 'Surah Fussilat (41:46)' },
]

function getDailyAyah() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return AYAHS[seed % AYAHS.length]
}

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const QUICK_ACTIONS = [
  {
    id: 'gooddeeds',
    label: 'Prayers',
    desc: 'Track your 5 daily prayers — Fardh, Sunnah, Nafl & Tahajjud. Mark on time, late, or missed.',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.10)',
    border: 'rgba(167,139,250,0.25)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  },
  {
    id: 'deeds',
    label: 'Good Deeds',
    desc: 'Add and complete daily or one-time good deeds. Earn wallet rewards for every deed done.',
    color: '#00E5A0',
    bg: 'rgba(0,229,160,0.08)',
    border: 'rgba(0,229,160,0.22)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: 'baddeeds',
    label: 'Bad Deeds',
    desc: 'Log bad habits and sins. Mark as avoided to earn rewards or committed to face a penalty.',
    color: '#F87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.22)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'rewards',
    label: 'Rewards',
    desc: 'Spend your earned balance on personal rewards. Browse presets or create your own treats.',
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.22)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
]

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

function getDeedsMetrics() {
  const d = new Date()
  const tk = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  let goodDeeds = [], badDeeds = [], gStatus = {}, bStatus = {}, onetimeDone = [], bdOnetimeDone = []
  try { goodDeeds     = JSON.parse(localStorage.getItem('userDeeds')                   || '[]') } catch { /**/ }
  try { badDeeds      = JSON.parse(localStorage.getItem('badDeeds')                    || '[]') } catch { /**/ }
  try { gStatus       = JSON.parse(localStorage.getItem(`deedStatus_${tk}`)            || '{}') } catch { /**/ }
  try { bStatus       = JSON.parse(localStorage.getItem(`badDeedStatus_${tk}`)         || '{}') } catch { /**/ }
  try { onetimeDone   = JSON.parse(localStorage.getItem('onetimeDone')                 || '[]') } catch { /**/ }
  try { bdOnetimeDone = JSON.parse(localStorage.getItem('bdOnetimeDone')               || '[]') } catch { /**/ }

  const gDaily = goodDeeds.filter(d => d.type === 'daily')
  const bDaily = badDeeds.filter(d => d.type === 'daily')
  return {
    good: {
      done:    gDaily.filter(d => gStatus[d.id] === 'done').length,
      missed:  gDaily.filter(d => gStatus[d.id] === 'missed').length,
      total:   gDaily.length,
      otDone:  onetimeDone.length,
    },
    bad: {
      avoided:   bDaily.filter(d => bStatus[d.id] === 'avoided').length,
      committed: bDaily.filter(d => bStatus[d.id] === 'committed').length,
      total:     bDaily.length,
      otAvoided: bdOnetimeDone.length,
    },
  }
}

function getPrayerMetrics() {
  let status = {}
  try { status = JSON.parse(localStorage.getItem(todayStatusKey()) || '{}') } catch { /**/ }
  const done   = (...types) => ALL_PRAYERS.filter(p => types.includes(p.type) && status[p.id] && status[p.id] !== 'missed').length
  const missed = (...types) => ALL_PRAYERS.filter(p => types.includes(p.type) && status[p.id] === 'missed').length
  const total  = (...types) => ALL_PRAYERS.filter(p => types.includes(p.type)).length
  return {
    fardh:  { done: done('fardh'),   missed: missed('fardh'),   total: total('fardh') },
    sunnah: { done: done('sunnah'),  missed: missed('sunnah'),  total: total('sunnah') },
    nafl:   { done: done('nafl'),    missed: missed('nafl'),    total: total('nafl') },
    witr:   { done: done('wajib'),   missed: missed('wajib'),   total: total('wajib') },
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

export default function Dashboard({ userName, onNavigate }) {
  const pm = getPrayerMetrics()
  const dm = getDeedsMetrics()
  const greeting = getTimeGreeting()
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('profilePicture') || null)

  useEffect(() => {
    const sync = () => setProfilePic(localStorage.getItem('profilePicture') || null)
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        {profilePic && (
          <img src={profilePic} alt="Profile" className="welcome-profile-pic" />
        )}
        <div className="dashboard-welcome-content">
          <p className="welcome-bismillah">بسم الله الرحمن الرحيم</p>
          <p className="welcome-greeting">{greeting.emoji} {greeting.text}!</p>
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
          <PmCell label="Fardh"  value={pm.fardh.done}   total={pm.fardh.total}  color="#00E5A0" variant="done" />
          <PmCell label="Sunnah" value={pm.sunnah.done}  total={pm.sunnah.total} color="#A78BFA" variant="done" />
          <PmCell label="Nafl"   value={pm.nafl.done}    total={pm.nafl.total}   color="#F472B6" variant="done" />
          <PmCell label="Witr"   value={pm.witr.done}    total={pm.witr.total}   color="#FBBF24" variant="done" />
          <PmCell label="Fardh"  value={pm.fardh.missed}  total={pm.fardh.total}  color="#F87171" variant="missed" />
          <PmCell label="Sunnah" value={pm.sunnah.missed} total={pm.sunnah.total} color="#FCA5A5" variant="missed" />
          <PmCell label="Nafl"   value={pm.nafl.missed}   total={pm.nafl.total}   color="#FCA5A5" variant="missed" />
          <PmCell label="Witr"   value={pm.witr.missed}   total={pm.witr.total}   color="#FCA5A5" variant="missed" />
        </div>
      </div>

      <div className="dashboard-deeds-overview">
        <h3 className="pm-title">Today's Deeds Overview</h3>
        <div className="dov-grid">
          <div className="dov-card dov-card-good">
            <div className="dov-card-header">
              <span className="dov-card-label">Good Deeds</span>
            </div>
            <div className="dov-stats">
              <div className="dov-stat">
                <span className="dov-stat-value" style={{ color: '#00E5A0' }}>{dm.good.done}</span>
                <span className="dov-stat-denom">/{dm.good.total}</span>
                <span className="dov-stat-label">Done Today</span>
              </div>
              <div className="dov-stat dov-stat-bad">
                <span className="dov-stat-value" style={{ color: '#F87171' }}>{dm.good.missed}</span>
                <span className="dov-stat-denom">/{dm.good.total}</span>
                <span className="dov-stat-label">Missed</span>
              </div>
              <div className="dov-stat">
                <span className="dov-stat-value" style={{ color: '#A78BFA' }}>{dm.good.otDone}</span>
                <span className="dov-stat-label">One-time ✓</span>
              </div>
            </div>
          </div>

          <div className="dov-card dov-card-bad">
            <div className="dov-card-header">
              <span className="dov-card-label">Bad Deeds</span>
            </div>
            <div className="dov-stats">
              <div className="dov-stat">
                <span className="dov-stat-value" style={{ color: '#00E5A0' }}>{dm.bad.avoided}</span>
                <span className="dov-stat-denom">/{dm.bad.total}</span>
                <span className="dov-stat-label">Avoided</span>
              </div>
              <div className="dov-stat dov-stat-bad">
                <span className="dov-stat-value" style={{ color: '#F87171' }}>{dm.bad.committed}</span>
                <span className="dov-stat-denom">/{dm.bad.total}</span>
                <span className="dov-stat-label">Committed</span>
              </div>
              <div className="dov-stat">
                <span className="dov-stat-value" style={{ color: '#A78BFA' }}>{dm.bad.otAvoided}</span>
                <span className="dov-stat-label">One-time ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-quick-actions">
        <h3 className="pm-title">Quick Actions</h3>
        <div className="qa-grid">
          {QUICK_ACTIONS.map(a => (
            <button key={a.id} className="qa-card" onClick={() => onNavigate(a.id)}
              style={{ '--qa-color': a.color, '--qa-bg': a.bg, '--qa-border': a.border }}>
              <div className="qa-icon" style={{ color: a.color, background: a.bg }}>{a.icon}</div>
              <div className="qa-body">
                <span className="qa-label">{a.label}</span>
                <span className="qa-desc">{a.desc}</span>
              </div>
              <span className="qa-arrow" style={{ color: a.color }}><ArrowRightIcon /></span>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-quote-card">
        <div className="quote-icon">❝</div>
        <p className="quote-text">{getDailyAyah().text}</p>
        <p className="quote-ref">— {getDailyAyah().ref}</p>
      </div>
    </div>
  )
}
