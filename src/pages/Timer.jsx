import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'cleanTimerStart'

function pad(n, len = 2) {
  return String(Math.floor(Math.abs(n))).padStart(len, '0')
}

function getElapsed(startMs) {
  let diff = Math.max(0, Date.now() - startMs)
  const ms      = diff % 1000;             diff = Math.floor(diff / 1000)
  const seconds = diff % 60;               diff = Math.floor(diff / 60)
  const minutes = diff % 60;               diff = Math.floor(diff / 60)
  const hours   = diff % 24;               diff = Math.floor(diff / 24)
  const totalDays = diff
  const years   = Math.floor(diff / 365);  diff -= years * 365
  const months  = Math.floor(diff / 30);   diff -= months * 30
  const days    = diff
  return { years, months, days, hours, minutes, seconds, ms, totalDays }
}

function getMilestone(e) {
  if (!e) return null
  if (e.totalDays >= 365) return { text: `${e.years} year${e.years > 1 ? 's' : ''} of discipline`, icon: '🏆' }
  if (e.totalDays >= 30)  return { text: `${e.months} month${e.months > 1 ? 's' : ''} clean`, icon: '🌟' }
  if (e.totalDays >= 7)   return { text: `${Math.floor(e.totalDays / 7)} week${Math.floor(e.totalDays / 7) > 1 ? 's' : ''} clean`, icon: '🔥' }
  if (e.totalDays >= 1)   return { text: `${e.totalDays} day${e.totalDays > 1 ? 's' : ''} clean`, icon: '💪' }
  return { text: 'Just started. Stay strong!', icon: '🌱' }
}

const TICK = 60
const R = 148, CX = 160, CY = 160
const ticks = Array.from({ length: TICK }, (_, i) => {
  const a = (i * 6 - 90) * (Math.PI / 180)
  const major = i % 5 === 0
  const r1 = major ? R - 11 : R - 5
  return { x1: CX + r1 * Math.cos(a), y1: CY + r1 * Math.sin(a), x2: CX + R * Math.cos(a), y2: CY + R * Math.sin(a), major }
})

export default function Timer() {
  const [startTime, setStartTime] = useState(() => {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? parseInt(s, 10) : null
  })
  const [elapsed, setElapsed]   = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [dateInput, setDateInput] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!startTime) return
    const tick = () => {
      setElapsed(getElapsed(startTime))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [startTime])

  const openModal = () => {
    const now = new Date()
    const local = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setDateInput(local)
    setShowModal(true)
  }

  const handleSet = () => {
    if (!dateInput) return
    const ts = new Date(dateInput).getTime()
    if (isNaN(ts)) return
    localStorage.setItem(STORAGE_KEY, String(ts))
    setStartTime(ts)
    setShowModal(false)
  }

  const handleReset = () => {
    cancelAnimationFrame(rafRef.current)
    localStorage.removeItem(STORAGE_KEY)
    setStartTime(null)
    setElapsed(null)
    setConfirmReset(false)
  }

  const milestone = getMilestone(elapsed)

  const UNITS = elapsed ? [
    { label: 'Years',   val: pad(elapsed.years),   color: '#A78BFA', rgba: '167,139,250' },
    { label: 'Months',  val: pad(elapsed.months),  color: '#60A5FA', rgba: '96,165,250' },
    { label: 'Days',    val: pad(elapsed.days),    color: '#34D399', rgba: '52,211,153' },
    { label: 'Hours',   val: pad(elapsed.hours),   color: '#FBBF24', rgba: '251,191,36' },
    { label: 'Minutes', val: pad(elapsed.minutes), color: '#F87171', rgba: '248,113,113' },
    { label: 'Seconds', val: pad(elapsed.seconds), color: '#06B6D4', rgba: '6,182,212' },
  ] : []

  return (
    <div className="timer-page">

      <div className="timer-header">
        <h1 className="timer-title">Clean Timer</h1>
        <p className="timer-subtitle">Track how long you've stayed clean &amp; disciplined.</p>
      </div>

      {/* Ring display */}
      <div className="timer-ring-wrap">
        <div className="timer-glow-a" />
        <div className="timer-glow-b" />

        <svg className="timer-svg" width="320" height="320" viewBox="0 0 320 320">
          <defs>
            <linearGradient id="timerArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="timerArcGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>

          {/* Outer border circle */}
          <circle cx="160" cy="160" r="155" fill="none" stroke="rgba(124,58,237,0.12)" strokeWidth="1" />

          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.major ? 'rgba(167,139,250,0.55)' : 'rgba(167,139,250,0.18)'}
              strokeWidth={t.major ? 2 : 1} strokeLinecap="round" />
          ))}

          {/* Spinning arcs */}
          <circle cx="160" cy="160" r="155" fill="none" stroke="url(#timerArcGrad)"
            strokeWidth="3" strokeLinecap="round" strokeDasharray="280 696"
            className="timer-arc-1" />
          <circle cx="160" cy="160" r="130" fill="none" stroke="url(#timerArcGrad2)"
            strokeWidth="1.5" strokeLinecap="round" strokeDasharray="120 696"
            className="timer-arc-2" />

          {/* Inner decorative ring */}
          <circle cx="160" cy="160" r="118" fill="none" stroke="rgba(6,182,212,0.10)" strokeWidth="1" />
        </svg>

        {/* Inner content */}
        <div className="timer-inner">
          {!startTime ? (
            <div className="timer-idle">
              <span className="timer-idle-icon">⏱</span>
              <span className="timer-idle-text">Not started</span>
              <span className="timer-idle-hint">Tap "Set Start Time" below</span>
            </div>
          ) : elapsed ? (
            <>
              <div className="timer-ymd">
                {elapsed.years > 0   && <span>{pad(elapsed.years)}<small>y</small></span>}
                {(elapsed.years > 0 || elapsed.months > 0) && <span>{pad(elapsed.months)}<small>mo</small></span>}
                <span className="timer-days-num">{pad(elapsed.days)}<small>d</small></span>
              </div>
              <div className="timer-hms">
                <span>{pad(elapsed.hours)}</span>
                <span className="timer-col">:</span>
                <span>{pad(elapsed.minutes)}</span>
                <span className="timer-col">:</span>
                <span>{pad(elapsed.seconds)}</span>
                <span className="timer-ms-num">.{pad(elapsed.ms, 3)}</span>
              </div>
            </>
          ) : <span className="timer-loading">…</span>}
        </div>
      </div>

      {/* Milestone badge */}
      {milestone && startTime && (
        <div className="timer-milestone">
          <span>{milestone.icon}</span>
          <span>{milestone.text}</span>
        </div>
      )}

      {/* Unit cards */}
      {elapsed && startTime && (
        <div className="timer-units">
          {UNITS.map(({ label, val, color, rgba }) => (
            <div key={label} className="timer-unit"
              style={{ '--uc': color, '--ucr': rgba }}>
              <span className="timer-unit-val">{val}</span>
              <span className="timer-unit-lbl">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Started label */}
      {startTime && (
        <p className="timer-started-at">
          ⏳ Since {new Date(startTime).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
        </p>
      )}

      {/* Action buttons */}
      <div className="timer-btns">
        <button className="timer-set-btn" onClick={openModal}>
          {startTime ? '✏️ Change Start Time' : '▶ Set Start Time'}
        </button>
        {startTime && !confirmReset && (
          <button className="timer-reset-btn" onClick={() => setConfirmReset(true)}>Reset</button>
        )}
        {confirmReset && (
          <>
            <button className="timer-reset-confirm-btn" onClick={handleReset}>Yes, reset</button>
            <button className="timer-reset-btn" onClick={() => setConfirmReset(false)}>Cancel</button>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="timer-overlay" onClick={() => setShowModal(false)}>
          <div className="timer-modal" onClick={e => e.stopPropagation()}>
            <div className="timer-modal-icon">🕌</div>
            <h2 className="timer-modal-title">Set Start Time</h2>
            <p className="timer-modal-sub">When did your clean journey begin?</p>
            <input
              type="datetime-local"
              className="timer-date-input"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
            />
            <div className="timer-modal-btns">
              <button className="timer-set-btn" onClick={handleSet}>▶ Start Timer</button>
              <button className="timer-reset-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
