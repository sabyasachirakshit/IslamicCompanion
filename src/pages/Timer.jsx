import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'cleanTimerStart'

function pad(n, len = 2) {
  return String(Math.floor(Math.abs(n))).padStart(len, '0')
}

function getElapsed(startMs) {
  const rawMs = Math.max(0, Date.now() - startMs)
  const totalFractionalDays = rawMs / 86400000
  let diff = rawMs
  const ms      = diff % 1000;             diff = Math.floor(diff / 1000)
  const seconds = diff % 60;               diff = Math.floor(diff / 60)
  const minutes = diff % 60;               diff = Math.floor(diff / 60)
  const hours   = diff % 24;               diff = Math.floor(diff / 24)
  const totalDays = diff
  const years   = Math.floor(diff / 365);  diff -= years * 365
  const months  = Math.floor(diff / 30);   diff -= months * 30
  const days    = diff
  return { years, months, days, hours, minutes, seconds, ms, totalDays, totalFractionalDays }
}

function getMilestone(e) {
  if (!e) return null
  if (e.totalDays >= 365) return { text: `${e.years} year${e.years > 1 ? 's' : ''} of discipline`, icon: '🏆' }
  if (e.totalDays >= 30)  return { text: `${e.months} month${e.months > 1 ? 's' : ''} clean`, icon: '🌟' }
  if (e.totalDays >= 7)   return { text: `${Math.floor(e.totalDays / 7)} week${Math.floor(e.totalDays / 7) > 1 ? 's' : ''} clean`, icon: '🔥' }
  if (e.totalDays >= 1)   return { text: `${e.totalDays} day${e.totalDays > 1 ? 's' : ''} clean`, icon: '💪' }
  return { text: 'Just started. Stay strong!', icon: '🌱' }
}

const BADGES = [
  { days: 0,    name: 'Sucker',                emoji: '🔗',  tier: 0 },
  { days: 1,    name: 'Prisoner',              emoji: '⛓️',  tier: 0 },
  { days: 3,    name: 'Awakening',             emoji: '🌅',  tier: 1 },
  { days: 5,    name: 'Realiser',              emoji: '💡',  tier: 1 },
  { days: 7,    name: 'Survivor',              emoji: '🌱',  tier: 1 },
  { days: 10,   name: 'Strong Kid',            emoji: '💪',  tier: 2 },
  { days: 14,   name: 'Self-Controlled',       emoji: '🎯',  tier: 2 },
  { days: 21,   name: 'Discipline Seed',       emoji: '🌿',  tier: 2 },
  { days: 30,   name: 'Iron Mind',             emoji: '🔩',  tier: 3 },
  { days: 45,   name: 'Temptation Slayer',     emoji: '⚔️',  tier: 3 },
  { days: 50,   name: 'Steel Soul',            emoji: '🛡️',  tier: 3 },
  { days: 60,   name: 'Focused Wolf',          emoji: '🐺',  tier: 3 },
  { days: 75,   name: 'Mind Guardian',         emoji: '🧠',  tier: 3 },
  { days: 90,   name: 'Rewired',               emoji: '⚡',  tier: 4 },
  { days: 100,  name: 'Centurion',             emoji: '🏛️',  tier: 4 },
  { days: 120,  name: 'Habit Breaker',         emoji: '💥',  tier: 4 },
  { days: 150,  name: 'Alpha Spirit',          emoji: '🔥',  tier: 4 },
  { days: 180,  name: 'Desire Master',         emoji: '🌊',  tier: 4 },
  { days: 200,  name: 'Shadow Conqueror',      emoji: '🌑',  tier: 5 },
  { days: 250,  name: 'Diamond Will',          emoji: '💎',  tier: 5 },
  { days: 300,  name: 'Ascended Mind',         emoji: '🌌',  tier: 5 },
  { days: 365,  name: 'One-Year Legend',       emoji: '🏆',  tier: 6 },
  { days: 400,  name: 'Inner Warrior',         emoji: '🗡️',  tier: 6 },
  { days: 450,  name: 'Unchained',             emoji: '🔓',  tier: 6 },
  { days: 500,  name: 'Half Millennium Monk',  emoji: '🧘',  tier: 7 },
  { days: 550,  name: 'Craving Destroyer',     emoji: '💀',  tier: 7 },
  { days: 600,  name: 'Titan Discipline',      emoji: '🗿',  tier: 7 },
  { days: 650,  name: 'King of Restraint',     emoji: '👑',  tier: 7 },
  { days: 700,  name: 'Relapse Hunter',        emoji: '🎯',  tier: 7 },
  { days: 750,  name: 'Soul Fortress',         emoji: '🏰',  tier: 8 },
  { days: 800,  name: 'Mental Emperor',        emoji: '🌟',  tier: 8 },
  { days: 850,  name: 'Void Walker',           emoji: '🌀',  tier: 8 },
  { days: 900,  name: 'Untouchable',           emoji: '✨',  tier: 8 },
  { days: 950,  name: 'Beyond Flesh',          emoji: '🔱',  tier: 8 },
  { days: 1000, name: 'Transcendent Legend',   emoji: '🌠',  tier: 9 },
  { days: 1100, name: 'Eternal Focus',          emoji: '🔭',  tier: 10 },
  { days: 1200, name: 'Celibate Commander',     emoji: '🎖️',  tier: 10 },
  { days: 1300, name: 'Storm Mind',             emoji: '⛈️',  tier: 10 },
  { days: 1400, name: 'Supreme Discipline',     emoji: '⚜️',  tier: 10 },
  { days: 1500, name: 'Master of Impulses',     emoji: '🧲',  tier: 10 },
  { days: 1600, name: 'Silent Titan',           emoji: '🗻',  tier: 11 },
  { days: 1700, name: 'Flesh Breaker',          emoji: '⚗️',  tier: 11 },
  { days: 1800, name: 'Cosmic Will',            emoji: '🪐',  tier: 11 },
  { days: 1900, name: 'Limitless Monk',         emoji: '🪬',  tier: 11 },
  { days: 2000, name: 'Godmind Initiate',       emoji: '🌐',  tier: 11 },
  { days: 2200, name: 'Chaos Tamer',            emoji: '🌪️',  tier: 12 },
  { days: 2400, name: 'Desire Executioner',     emoji: '🧬',  tier: 12 },
  { days: 2600, name: 'Brain Reforged',         emoji: '⚙️',  tier: 12 },
  { days: 2800, name: 'Invincible Resolve',     emoji: '📿',  tier: 12 },
  { days: 3000, name: 'Divine Restraint',       emoji: '🦾',  tier: 12 },
  { days: 3200, name: 'Temptation Immune',      emoji: '🕌',  tier: 13 },
  { days: 3400, name: 'Supreme Ascetic',        emoji: '🌍',  tier: 13 },
  { days: 3600, name: 'Reality Controller',     emoji: '💫',  tier: 13 },
  { days: 3800, name: 'Legendary Aura',         emoji: '🐉',  tier: 13 },
  { days: 4000, name: 'Mythic Discipline',      emoji: '🌈',  tier: 13 },
  { days: 4200, name: 'Celestial Guardian',     emoji: '👁️',  tier: 14 },
  { days: 4400, name: 'Immortal Focus',         emoji: '🏯',  tier: 14 },
  { days: 4600, name: 'Eternal Emperor',        emoji: '🌕',  tier: 14 },
  { days: 4800, name: 'Desireless One',         emoji: '🌌',  tier: 14 },
  { days: 5000, name: 'The Transcended',        emoji: '🏆',  tier: 14 },
  { days: 5500, name: 'Beyond Temptation',      emoji: '🌙',  tier: 15 },
  { days: 6000, name: 'Eternal Monk',           emoji: '🕯️',  tier: 15 },
  { days: 6500, name: 'Soul Emperor',           emoji: '🦅',  tier: 15 },
  { days: 7000, name: 'Infinite Will',          emoji: '🗺️',  tier: 16 },
  { days: 7500, name: 'The Unshaken',           emoji: '🧊',  tier: 16 },
  { days: 8000, name: 'Celestial Ascendant',    emoji: '🔮',  tier: 16 },
  { days: 8500, name: 'Mind Over Flesh',        emoji: '🧿',  tier: 17 },
  { days: 9000, name: 'Cosmic Discipline',      emoji: '☯️',  tier: 17 },
  { days: 9500, name: 'Timeless Warrior',       emoji: '🗝️',  tier: 17 },
  { days: 10000, name: 'The Absolute',          emoji: '🕊️',  tier: 17 },
]

const TIER_STYLES = [
  { color: '#9CA3AF', rgba: '156,163,175', label: 'Struggle' },
  { color: '#34D399', rgba: '52,211,153',  label: 'Spark' },
  { color: '#34D399', rgba: '52,211,153',  label: 'Beginner' },
  { color: '#06B6D4', rgba: '6,182,212',   label: 'Rising' },
  { color: '#A78BFA', rgba: '167,139,250', label: 'Advanced' },
  { color: '#FFD700', rgba: '255,215,0',   label: 'Expert' },
  { color: '#FB923C', rgba: '251,146,60',  label: 'Master' },
  { color: '#F87171', rgba: '248,113,113', label: 'Elite' },
  { color: '#EC4899', rgba: '236,72,153',  label: 'Apex' },
  { color: '#FDE68A', rgba: '253,230,138', label: 'Transcendent' },
  { color: '#10B981', rgba: '16,185,129',   label: 'Eternal' },
  { color: '#0EA5E9', rgba: '14,165,233',   label: 'Cosmic' },
  { color: '#8B5CF6', rgba: '139,92,246',   label: 'Divine' },
  { color: '#F59E0B', rgba: '245,158,11',   label: 'Mythic' },
  { color: '#F0ABFC', rgba: '240,171,252',  label: 'Transcended' },
  { color: '#FF8C00', rgba: '255,140,0',    label: 'Infinite' },
  { color: '#E879F9', rgba: '232,121,249',  label: 'Eternal' },
  { color: '#F8FAFC', rgba: '248,250,252',  label: 'Absolute' },
]

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
  const [showBadges, setShowBadges]     = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(null)
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

  const milestone  = getMilestone(elapsed)
  const totalDays            = elapsed?.totalDays ?? 0
  const totalFractionalDays  = elapsed?.totalFractionalDays ?? 0
  const currentBadge = startTime
    ? ([...BADGES].reverse().find(b => totalDays >= b.days) ?? BADGES[0])
    : null
  const nextBadge   = startTime ? (BADGES.find(b => b.days > totalDays) ?? null) : null

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

      {/* Badges button */}
      {startTime && (
        <button className="timer-badges-btn" onClick={() => setShowBadges(true)}>
          <span>🏅</span>
          <span>View Badges</span>
          {currentBadge && (
            <span className="tbb-rank" style={{ color: TIER_STYLES[currentBadge.tier].color }}>
              {currentBadge.emoji} {currentBadge.name}
            </span>
          )}
        </button>
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

      {/* ── Badges grid modal ── */}
      {showBadges && (
        <div className="timer-overlay" onClick={() => setShowBadges(false)}>
          <div className="tbm-wrap" onClick={e => e.stopPropagation()}>
            <div className="tbm-head">
              <div>
                <h2 className="tbm-title">Badges</h2>
                <p className="tbm-total-days">
                  🗓️ <strong>{totalDays}</strong> day{totalDays !== 1 ? 's' : ''} clean
                </p>
                {currentBadge && (
                  <p className="tbm-sub" style={{ color: TIER_STYLES[currentBadge.tier].color }}>
                    {currentBadge.emoji} Current rank: <strong>{currentBadge.name}</strong>
                    {nextBadge && <span className="tbm-next"> · Next at {nextBadge.days}d</span>}
                  </p>
                )}
              </div>
              <button className="tbm-close" onClick={() => setShowBadges(false)}>✕</button>
            </div>
            <div className="tbm-list">
              {BADGES.map(badge => {
                const unlocked = startTime && totalDays >= badge.days
                const isCurrent = currentBadge?.days === badge.days
                const ts = TIER_STYLES[badge.tier]
                const pct = badge.days === 0 ? 100 : Math.min(100, Math.round((totalFractionalDays / badge.days) * 100))
                const rem = badge.days - totalDays
                return (
                  <div
                    key={badge.days}
                    className={`tbm-row${unlocked ? ' tbm-unlocked' : ' tbm-locked'}${isCurrent ? ' tbm-current' : ''}${unlocked && badge.days === 10000 ? ' tbm-absolute' : ''}`}
                    style={{ '--bc': ts.color, '--bcr': ts.rgba }}
                    onClick={() => unlocked && setSelectedBadge(badge)}
                  >
                    <span className="tbm-row-emoji">{unlocked ? badge.emoji : '🔒'}</span>
                    <div className="tbm-row-body">
                      <div className="tbm-row-top">
                        <span className="tbm-row-name">{unlocked ? badge.name : '???'}</span>
                        <span className="tbm-row-days">{badge.days === 0 ? 'Day 0' : `${badge.days}d`}</span>
                      </div>
                      <div className="tbm-bar-wrap">
                        <div className="tbm-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="tbm-row-bot">
                        <span className="tbm-row-pct">
                          {unlocked ? `✓ Unlocked` : `${pct}% complete`}
                        </span>
                        {!unlocked && startTime && rem > 0 && (
                          <span className="tbm-row-rem">{rem}d to go</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Badge detail modal ── */}
      {selectedBadge && (() => {
        const ts = TIER_STYLES[selectedBadge.tier]
        const isCurrent = currentBadge?.days === selectedBadge.days
        const daysAgo = totalDays - selectedBadge.days
        return (
          <div className="timer-overlay" onClick={() => setSelectedBadge(null)}>
            <div className="tbd-wrap" onClick={e => e.stopPropagation()}
              style={{ '--bc': ts.color, '--bcr': ts.rgba }}>
              {isCurrent && <div className="tbd-current-ribbon">Current Rank</div>}
              <span className="tbd-emoji">{selectedBadge.emoji}</span>
              <h2 className="tbd-name">{selectedBadge.name}</h2>
              <p className="tbd-tier">{ts.label} Tier</p>
              <div className="tbd-stat">
                <span>Unlocked at</span><strong>{selectedBadge.days} day{selectedBadge.days !== 1 ? 's' : ''}</strong>
              </div>
              {!isCurrent && (
                <div className="tbd-stat">
                  <span>Held for</span><strong>{daysAgo} day{daysAgo !== 1 ? 's' : ''}</strong>
                </div>
              )}
              <button className="timer-set-btn" style={{ marginTop: 8 }} onClick={() => setSelectedBadge(null)}>Close</button>
            </div>
          </div>
        )
      })()}

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
