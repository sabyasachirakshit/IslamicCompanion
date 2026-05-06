import { useState, useCallback } from 'react'

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
const countKey = () => `urgesCount_${todayKey()}`
const logKey   = () => `urgesLog_${todayKey()}`

const EMOJIS = ['🔥', '⚡', '💪', '✨', '🌟', '⚔️', '🛡️', '👊']

const QUOTES = [
  { text: "The strong man is not the one who can wrestle; the strong man is the one who controls himself when he is angry.", ref: "Sahih al-Bukhari 6114", icon: "💪" },
  { text: "Paradise is surrounded by hardships and Hell-fire is surrounded by desires.", ref: "Sahih Muslim 2823", icon: "🌟" },
  { text: "Whoever struggles against his nafs for the sake of Allah, Allah will guide him to His paths.", ref: "Quran 29:69", icon: "⚔️" },
  { text: "And be patient — for indeed, Allah does not allow to be lost the reward of those who do good.", ref: "Quran 11:115", icon: "🛡️" },
  { text: "Indeed, the patient will be given their reward without account.", ref: "Quran 39:10", icon: "✨" },
]

const computeStreak = () => {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i)
    const k = `urgesCount_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    if (parseInt(localStorage.getItem(k) || '0', 10) === 0) break
    streak++
  }
  return streak
}

export default function Urges() {
  const [count,     setCount]     = useState(() => parseInt(localStorage.getItem(countKey()) || '0', 10))
  const [log,       setLog]       = useState(() => { try { return JSON.parse(localStorage.getItem(logKey()) || '[]') } catch { return [] } })
  const [streak]                  = useState(computeStreak)
  const [particles, setParticles] = useState([])
  const [flashMsg,  setFlashMsg]  = useState(false)
  const [btnActive, setBtnActive] = useState(false)
  const [quoteIdx,  setQuoteIdx]  = useState(0)

  const crushUrge = useCallback(() => {
    const now = Date.now()

    const newCount = count + 1
    setCount(newCount)
    localStorage.setItem(countKey(), String(newCount))

    const newLog = [...log, now]
    setLog(newLog)
    localStorage.setItem(logKey(), JSON.stringify(newLog))

    const pts = Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * 360 + Math.random() * 15
      const dist  = 90 + Math.random() * 70
      const rad   = (angle * Math.PI) / 180
      return { id: `${now}_${i}`, emoji: EMOJIS[i % EMOJIS.length], tx: Math.cos(rad) * dist, ty: Math.sin(rad) * dist }
    })
    setParticles(pts)
    setTimeout(() => setParticles([]), 950)

    setFlashMsg(true)
    setTimeout(() => setFlashMsg(false), 1100)

    setBtnActive(true)
    setTimeout(() => setBtnActive(false), 450)

    setQuoteIdx(idx => (idx + 1) % QUOTES.length)
  }, [count, log])

  const quote = QUOTES[quoteIdx]

  return (
    <div className="urges-page">

      {/* Top stats */}
      <div className="urges-stats-row">
        <div className="urges-stat-card">
          <span className="usc-val">{count}</span>
          <span className="usc-label">Urges Crushed Today</span>
        </div>
        {streak > 0 && (
          <div className="urges-stat-card urges-streak-card">
            <span className="usc-val">🔥 {streak}</span>
            <span className="usc-label">Day Streak</span>
          </div>
        )}
      </div>

      {/* Arena */}
      <div className="urges-arena">
        <div className="urges-arena-glow" />
        <div className="urges-arena-glow urges-arena-glow2" />

        {flashMsg && <div className="urges-flash-msg">URGE CRUSHED! 💪</div>}

        {particles.map(p => (
          <div key={p.id} className="urges-particle" style={{ '--tx': `${p.tx}px`, '--ty': `${p.ty}px` }}>
            {p.emoji}
          </div>
        ))}

        <p className="urges-arena-label">⚔️ BATTLE YOUR NAFS</p>
        <h2 className="urges-arena-title">You felt the urge.<br />Now be the warrior.</h2>
        <p className="urges-arena-sub">Every time you resist, you rise. Every battle won<br />is written in your favour.</p>

        <button className={`urges-crush-btn${btnActive ? ' ucb-active' : ''}`} onClick={crushUrge}>
          <span className="ucb-fire-left">🔥</span>
          <span className="ucb-label">CRUSH THE URGE</span>
          <span className="ucb-fire-right">🔥</span>
        </button>

        <p className="urges-dua">أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</p>
        <p className="urges-dua-trans">I seek refuge in Allah from Shaytaan the accursed</p>
      </div>

      {/* Quote */}
      <div className="urges-quote-card">
        <span className="urges-quote-icon">{quote.icon}</span>
        <div className="urges-quote-body">
          <p className="urges-quote-text">"{quote.text}"</p>
          <p className="urges-quote-ref">— {quote.ref}</p>
        </div>
      </div>

      {/* Battle log */}
      {log.length > 0 && (
        <div className="urges-log">
          <h3 className="urges-log-title">⚡ Today's Battles — {log.length} won</h3>
          <div className="urges-log-list">
            {[...log].reverse().map((ts, i) => {
              const timeStr = new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
              return (
                <div key={ts} className="urges-log-item">
                  <span className="uli-num">#{log.length - i}</span>
                  <span className="uli-msg">Urge crushed at {timeStr}</span>
                  <span className="uli-icon">💪</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
