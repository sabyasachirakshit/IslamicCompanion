import { useState, useEffect, useCallback } from 'react'
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

const RAIN_CODES = new Set([51,53,55,61,63,65,80,81,82,95,96,99])

const getWeatherInfo = (code) => {
  if (code === 0)                        return { label: 'Clear Sky',        emoji: '☀️' }
  if (code <= 2)                         return { label: 'Partly Cloudy',    emoji: '🌤️' }
  if (code === 3)                        return { label: 'Overcast',         emoji: '☁️' }
  if (code <= 48)                        return { label: 'Foggy',            emoji: '🌫️' }
  if (code <= 55)                        return { label: 'Drizzle',          emoji: '🌦️' }
  if (code <= 65)                        return { label: 'Rain',             emoji: '🌧️' }
  if (code <= 77)                        return { label: 'Snow',             emoji: '❄️' }
  if (code <= 82)                        return { label: 'Rain Showers',     emoji: '🌦️' }
  if (code <= 86)                        return { label: 'Snow Showers',     emoji: '🌨️' }
  return                                        { label: 'Thunderstorm',     emoji: '⛈️' }
}

const addMins = (timeStr, mins) => {
  const [h, m] = timeStr.split(':').map(Number)
  const total  = h * 60 + m + mins
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const EXTRA_PRAYERS = [
  { key: 'Ishraq',   label: 'Ishraq',    color: '#FB923C', rgba: '251,146,60',  emoji: '🌄', desc: '15 min after Sunrise' },
  { key: 'LateIsha', label: 'Late Isha', color: '#A78BFA', rgba: '167,139,250', emoji: '🌌', desc: '2½ hrs after Isha' },
  { key: 'Tahajjud', label: 'Tahajjud', color: '#818CF8', rgba: '129,140,248', emoji: '🌠', desc: 'Last third of the night', rangeEnd: 'Fajr' },
]

const PRAYERS_DISPLAY = [
  { key: 'Fajr',    label: 'Fajr',    color: '#A78BFA', rgba: '167,139,250', emoji: '🌙' },
  { key: 'Sunrise', label: 'Sunrise', color: '#FB923C', rgba: '251,146,60',  emoji: '🌅' },
  { key: 'Dhuhr',   label: 'Dhuhr',   color: '#FBBF24', rgba: '251,191,36',  emoji: '☀️' },
  { key: 'Asr',     label: 'Asr',     color: '#60A5FA', rgba: '96,165,250',  emoji: '🌤' },
  { key: 'Maghrib', label: 'Maghrib', color: '#F87171', rgba: '248,113,113', emoji: '🌆' },
  { key: 'Isha',    label: 'Isha',    color: '#00E5A0', rgba: '0,229,160',   emoji: '🌃' },
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
    id: 'diary',
    label: 'Diary',
    desc: 'Write private PIN-locked journal entries, plan your day, attach images, and search your notes.',
    color: '#FB923C',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.22)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
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
  {
    id: 'dhikr',
    label: 'Dhikr',
    desc: 'Track your daily and one-time remembrance of Allah. Set targets and watch your progress.',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.22)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    id: 'exercise',
    label: 'Exercise',
    desc: 'Stay active with daily workout goals. Choose between Remaining Fit or Building Muscles mode.',
    color: '#34D399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.22)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
  {
    id: 'urges',
    label: 'Urges',
    desc: 'Fight temptation and crush urges. Log your battles and build a streak of resistance.',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.22)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
]


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
  const dailyAyah = getDailyAyah()
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('profilePicture') || null)
  const [prayerTimes,  setPrayerTimes]  = useState(() => {
    try {
      const c = JSON.parse(localStorage.getItem('prayerTimingsCache') || 'null')
      if (c && c.date === new Date().toDateString()) return c.times
    } catch { /**/ }
    return null
  })
  const [timesLoading, setTimesLoading] = useState(false)
  const [timesError,   setTimesError]   = useState(null)
  const [now, setNow] = useState(new Date())

  const rainDuaKey = `rainDuaAction_${new Date().toDateString()}`
  const [weather,       setWeather]       = useState(null)
  const [rainDuaAction, setRainDuaAction] = useState(() => localStorage.getItem(`rainDuaAction_${new Date().toDateString()}`) || null)

  useEffect(() => {
    const sync = () => setProfilePic(localStorage.getItem('profilePicture') || null)
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fetchPrayerTimes = useCallback(() => {
    if (!navigator.geolocation) { setTimesError('Geolocation not supported'); setTimesLoading(false); return }
    setTimesLoading(true)
    setTimesError(null)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res  = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=3`)
          const data = await res.json()
          if (data.code === 200) {
            const t     = data.data.timings
            const clean = (v) => v.split(' ')[0]
            const sunrise = clean(t.Sunrise), isha = clean(t.Isha), fajr = clean(t.Fajr)
            const toM = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m }
            const nightDur = (toM(fajr) <= toM(isha) ? toM(fajr) + 1440 : toM(fajr)) - toM(isha)
            const times = { Fajr: fajr, Sunrise: sunrise, Dhuhr: clean(t.Dhuhr), Asr: clean(t.Asr), Maghrib: clean(t.Maghrib), Isha: isha, Ishraq: addMins(sunrise, 15), LateIsha: addMins(isha, 150), Tahajjud: addMins(isha, Math.floor(nightDur * 2 / 3)) }
            setPrayerTimes(times)
            localStorage.setItem('prayerTimingsCache', JSON.stringify({ date: new Date().toDateString(), times }))
          } else { setTimesError('Could not load prayer times') }
        } catch { setTimesError('Network error — check your connection') }
        setTimesLoading(false)
      },
      () => { setTimesError('Location access denied'); setTimesLoading(false) },
      { timeout: 10000 }
    )
  }, [])

  const refreshPrayerTimes = useCallback(() => {
    localStorage.removeItem('prayerTimingsCache')
    setPrayerTimes(null)
    fetchPrayerTimes()
  }, [fetchPrayerTimes])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weathercode,windspeed_10m&timezone=auto`)
          const data = await res.json()
          const code      = data.current?.weathercode ?? 0
          const precip    = data.current?.precipitation ?? 0
          const temp      = data.current?.temperature_2m ?? null
          const windspeed = data.current?.windspeed_10m ?? null
          setWeather({ isRaining: RAIN_CODES.has(code) || precip > 0, code, precip, temp, windspeed })
        } catch { /**/ }
      },
      () => { /**/ },
      { timeout: 8000 }
    )
  }, [])

  const handleRainDua = (action) => {
    setRainDuaAction(action)
    localStorage.setItem(rainDuaKey, action)
  }

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
          <div className="welcome-ayah">
            <p className="welcome-ayah-text">{dailyAyah.text}</p>
            <p className="welcome-ayah-ref">— {dailyAyah.ref}</p>
          </div>
        </div>
        {weather && (
          <div className="welcome-weather">
            <span className="ww-card-emoji">{getWeatherInfo(weather.code).emoji}</span>
            {weather.temp !== null && <span className="ww-card-temp">{Math.round(weather.temp)}°C</span>}
            <span className="ww-card-label">{getWeatherInfo(weather.code).label}</span>
            {weather.windspeed !== null && <span className="ww-card-wind">💨 {Math.round(weather.windspeed)} km/h</span>}
          </div>
        )}
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

      <div className="dashboard-quick-actions">
        {/* <h3 className="pm-title">Quick Actions</h3> */}
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

      

      {/* Rain Dua Card */}
      {weather?.isRaining && (
        <div className="rain-dua-card">
          <div className="rain-dua-drops">
            {[...Array(6)].map((_,i) => <span key={i} className="rain-drop" style={{ '--delay': `${i * 0.18}s`, '--left': `${10 + i * 15}%` }}>💧</span>)}
          </div>
          {!rainDuaAction ? (
            <>
              <div className="rain-dua-header">
                <span className="rain-dua-icon">🌧️</span>
                <div>
                  <h3 className="rain-dua-title">It's Raining!</h3>
                  <p className="rain-dua-sub">Rain is a blessed time — make dua now, it is accepted</p>
                </div>
              </div>
              <p className="rain-dua-hadith">"There are two that will not be rejected: dua at the time of the call to prayer, and dua during rainfall." — Abu Dawud 2540</p>
              <div className="rain-dua-actions">
                <button className="rain-btn rain-btn-made" onClick={() => handleRainDua('made')}>🤲 I Made Dua</button>
                <button className="rain-btn rain-btn-missed" onClick={() => handleRainDua('missed')}>😔 I Missed It</button>
                <button className="rain-btn rain-btn-norain" onClick={() => handleRainDua('not-rained')}>☀️ It Didn't Rain</button>
              </div>
            </>
          ) : rainDuaAction === 'made' ? (
            <div className="rain-dua-result">
              <span className="rain-result-icon">🤲</span>
              <p className="rain-result-title">MashaAllah!</p>
              <p className="rain-result-msg">May Allah accept your dua and grant you what is best. Ameen.</p>
            </div>
          ) : rainDuaAction === 'missed' ? (
            <div className="rain-dua-result">
              <span className="rain-result-icon">🌙</span>
              <p className="rain-result-title">No worries</p>
              <p className="rain-result-msg">Allah is always listening. You can make dua anytime — He is Al-Sami'.</p>
            </div>
          ) : (
            <div className="rain-dua-result">
              <span className="rain-result-icon">☀️</span>
              <p className="rain-result-title">JazakAllah Khair</p>
              <p className="rain-result-msg">May your day be blessed. Remember Allah in all conditions.</p>
            </div>
          )}
        </div>
      )}

      <div className="dashboard-prayer-times">
        <div className="pt-title-row">
          <h3 className="pm-title">Today's Prayer Timings</h3>
          <button className="pt-refresh-btn" onClick={refreshPrayerTimes} title="Refresh prayer times" disabled={timesLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
        </div>
        {timesLoading && (
          <div className="pt-status">
            <span className="pt-spinner" />
            <span>Fetching your prayer times…</span>
          </div>
        )}
        {!prayerTimes && !timesLoading && !timesError && (
          <div className="pt-status">
            <button className="pt-fetch-btn" onClick={fetchPrayerTimes}>
              📍 Get Prayer Times
            </button>
            <span>Tap to load today's times using your location.</span>
          </div>
        )}
        {timesError && !timesLoading && (
          <div className="pt-status pt-status-error">
            ⚠️ {timesError}.
            <button className="pt-fetch-btn pt-retry-btn" onClick={fetchPrayerTimes}>Retry</button>
          </div>
        )}
        {prayerTimes && (() => {
          const toSecs  = (t) => { const [h, m] = t.split(':').map(Number); return h * 3600 + m * 60 }
          const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
          const toMins  = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
          const nowMins = now.getHours() * 60 + now.getMinutes()
          const nextKey    = PRAYERS_DISPLAY.find(p => toMins(prayerTimes[p.key]) > nowMins)?.key
          const nextP      = PRAYERS_DISPLAY.find(p => p.key === nextKey)
          const currentKey = [...PRAYERS_DISPLAY].reverse().find(p => toMins(prayerTimes[p.key]) <= nowMins)?.key
          const diffSecs = nextP
            ? toSecs(prayerTimes[nextP.key]) - nowSecs
            : 86400 - nowSecs + toSecs(prayerTimes['Fajr'])
          const cdH = String(Math.floor(diffSecs / 3600)).padStart(2, '0')
          const cdM = String(Math.floor((diffSecs % 3600) / 60)).padStart(2, '0')
          const cdS = String(diffSecs % 60).padStart(2, '0')
          const cdNextP = nextP ?? PRAYERS_DISPLAY[0]
          const renderCell = (p, isNext, isCurrent) => (
            <div key={p.key}
              className={`pt-cell${isNext ? ' pt-cell-next' : ''}${isCurrent ? ' pt-cell-current' : ''}`}
              style={
                isNext    ? { borderColor: `rgba(${p.rgba},0.50)`, background: `rgba(${p.rgba},0.08)`, boxShadow: `0 0 14px rgba(${p.rgba},0.15)` } :
                isCurrent ? { borderColor: `rgba(${p.rgba},0.70)`, background: `rgba(${p.rgba},0.14)`, boxShadow: `0 0 20px rgba(${p.rgba},0.28)` } :
                {}
              }>
              <span className="pt-emoji">{p.emoji}</span>
              <span className="pt-label">{p.label}</span>
              <span className="pt-time" style={{ color: p.color, textShadow: `0 0 8px rgba(${p.rgba},0.60)` }}>{prayerTimes[p.key]}</span>
              {isNext    && <span className="pt-next-badge" style={{ background: `rgba(${p.rgba},0.15)`, color: p.color, borderColor: `rgba(${p.rgba},0.35)` }}>Next</span>}
              {isCurrent && <span className="pt-next-badge" style={{ background: `rgba(${p.rgba},0.20)`, color: p.color, borderColor: `rgba(${p.rgba},0.50)` }}>Now</span>}
            </div>
          )
          return (
            <>
              <div className="pt-countdown" style={{ borderColor: `rgba(${cdNextP.rgba},0.35)`, background: `rgba(${cdNextP.rgba},0.06)` }}>
                <div className="pt-countdown-info">
                  <span className="pt-countdown-emoji">{cdNextP.emoji}</span>
                  <span className="pt-countdown-name" style={{ color: cdNextP.color }}>{cdNextP.label}</span>
                  <span className="pt-countdown-label">{nextP ? 'is next' : 'tomorrow (Fajr)'}</span>
                </div>
                <div className="pt-countdown-timer" style={{ color: cdNextP.color, textShadow: `0 0 14px rgba(${cdNextP.rgba},0.55)` }}>
                  {cdH}:{cdM}:{cdS}
                </div>
              </div>
              <div className="pt-grid">
                {PRAYERS_DISPLAY.map(p => renderCell(p, p.key === nextKey, p.key === currentKey))}
              </div>
              <div className="pt-extra-label">Additional Prayers</div>
              <div className="pt-extra-grid">
                {EXTRA_PRAYERS.map(p => (
                  <div key={p.key} className="pt-cell pt-extra-cell">
                    <span className="pt-emoji">{p.emoji}</span>
                    <span className="pt-label">{p.label}</span>
                    <span className="pt-time" style={{ color: p.color, textShadow: `0 0 8px rgba(${p.rgba},0.60)` }}>
                      {prayerTimes[p.key]}{p.rangeEnd ? <span className="pt-range-sep"> – {prayerTimes[p.rangeEnd]}</span> : ''}
                    </span>
                    <span className="pt-extra-desc">{p.desc}</span>
                  </div>
                ))}
              </div>
            </>
          )
        })()}
      </div>

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

      

    </div>
  )
}
