import { useState, useCallback } from 'react'

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
const storageKey = () => `exerciseData_${todayKey()}`

const EXERCISES = [
  { id: 'pushup',   name: 'Push-ups',      emoji: '💪', kcal: 0.32,  unit: 'reps', step: 1,  goal: 30,  color: '#F87171', rgba: '248,113,113' },
  { id: 'squat',    name: 'Squats',        emoji: '🦵', kcal: 0.32,  unit: 'reps', step: 1,  goal: 30,  color: '#FBBF24', rgba: '251,191,36'  },
  { id: 'plank',    name: 'Plank',         emoji: '🏋️', kcal: 0.067, unit: 'sec',  step: 10, goal: 120, color: '#60A5FA', rgba: '96,165,250'  },
  { id: 'pullup',   name: 'Pull-ups',      emoji: '🤸', kcal: 0.5,   unit: 'reps', step: 1,  goal: 10,  color: '#A78BFA', rgba: '167,139,250' },
  { id: 'jumpjack', name: 'Jumping Jacks', emoji: '⚡', kcal: 0.2,   unit: 'reps', step: 5,  goal: 50,  color: '#34D399', rgba: '52,211,153'  },
  { id: 'burpee',   name: 'Burpees',       emoji: '🔥', kcal: 0.5,   unit: 'reps', step: 1,  goal: 20,  color: '#F97316', rgba: '249,115,22'  },
  { id: 'situp',    name: 'Sit-ups',       emoji: '🎯', kcal: 0.25,  unit: 'reps', step: 1,  goal: 30,  color: '#EC4899', rgba: '236,72,153'  },
  { id: 'lunge',    name: 'Lunges',        emoji: '🏃', kcal: 0.25,  unit: 'reps', step: 1,  goal: 20,  color: '#06B6D4', rgba: '6,182,212'   },
]

const DAILY_GOAL_KCAL = 200

const MOTIVATION_TIERS = [
  { min: 0,   msg: "Let's get moving! Every rep counts 🌱" },
  { min: 15,  msg: "Warming up nicely! Keep the momentum 💪" },
  { min: 40,  msg: "You're on fire! Push through 🔥" },
  { min: 80,  msg: "Outstanding! Allah loves consistent effort ⚡" },
  { min: 150, msg: "Phenomenal! Your body is an amanah — honour it 🌟" },
]

const getMotivation = (kcal) =>
  [...MOTIVATION_TIERS].reverse().find(t => kcal >= t.min) || MOTIVATION_TIERS[0]

const computeStreak = () => {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const k = `exerciseData_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    try {
      const data = JSON.parse(localStorage.getItem(k) || 'null')
      if (!data || !Object.values(data).some(v => v > 0)) break
      streak++
    } catch { break }
  }
  return streak
}

const RingProgress = ({ count, goal, color }) => {
  const r = 30
  const circ = 2 * Math.PI * r
  const progress = Math.min(1, count / goal)
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="ex-ring-svg">
      <circle cx="38" cy="38" r={r} className="ex-ring-bg" />
      <circle
        cx="38" cy="38" r={r}
        className="ex-ring-fill"
        style={{
          stroke: color,
          strokeDasharray: circ,
          strokeDashoffset: circ * (1 - progress),
          filter: `drop-shadow(0 0 5px ${color}99)`,
        }}
      />
    </svg>
  )
}

export default function Exercise() {
  const [counts, setCounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey()) || '{}') } catch { return {} }
  })
  const [bursts, setBursts] = useState([])
  const [flashId, setFlashId] = useState(null)
  const [streak] = useState(computeStreak)

  const totalKcal = EXERCISES.reduce((sum, ex) => sum + (counts[ex.id] || 0) * ex.kcal, 0)
  const motivation = getMotivation(totalKcal)
  const goalPct = Math.min(100, (totalKcal / DAILY_GOAL_KCAL) * 100)

  const addCount = useCallback((ex) => {
    setCounts(prev => {
      const next = { ...prev, [ex.id]: (prev[ex.id] || 0) + ex.step }
      localStorage.setItem(storageKey(), JSON.stringify(next))
      return next
    })
    const burstId = `${Date.now()}_${Math.random()}`
    setBursts(b => [...b, { id: burstId, kcal: +(ex.kcal * ex.step).toFixed(2), exId: ex.id }])
    setTimeout(() => setBursts(b => b.filter(x => x.id !== burstId)), 900)
    setFlashId(ex.id)
    setTimeout(() => setFlashId(null), 400)
  }, [])

  return (
    <div className="ex-page">

      {/* Hadith banners */}
      <div className="ex-hadith-row">
        <div className="ex-hadith-banner">
          <span className="ex-hadith-icon">❤️</span>
          <div>
            <p className="ex-hadith-text"><em>"Your body has a right over you."</em></p>
            <span className="ex-hadith-ref">Sahih al-Bukhari — Prophet Muhammad ﷺ</span>
          </div>
        </div>
        <div className="ex-hadith-banner">
          <span className="ex-hadith-icon">⚡</span>
          <div>
            <p className="ex-hadith-text"><em>"A strong believer is better and more lovable to Allah than a weak believer, and there is good in everyone."</em></p>
            <span className="ex-hadith-ref">Sahih Muslim 2664 — Prophet Muhammad ﷺ</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="ex-hero">
        <div className="ex-hero-glow" />
        <div className="ex-hero-flame">🔥</div>
        <div className="ex-hero-kcal">{totalKcal.toFixed(1)}</div>
        <div className="ex-hero-unit">kcal burned today</div>
        <p className="ex-motivation-msg">{motivation.msg}</p>
        <div className="ex-hero-bar-wrap">
          <div className="ex-hero-bar" style={{ width: `${goalPct}%` }} />
        </div>
        <div className="ex-hero-bar-labels">
          <span>{Math.round(goalPct)}% of daily goal</span>
          <span>{DAILY_GOAL_KCAL} kcal</span>
        </div>
        {streak > 0 && (
          <div className="ex-streak-badge">
            🔥 {streak}-day streak
          </div>
        )}
      </div>

      {/* Exercise grid */}
      <div className="ex-grid">
        {EXERCISES.map(ex => {
          const count = counts[ex.id] || 0
          const done  = count >= ex.goal
          return (
            <div
              key={ex.id}
              className={`ex-card${flashId === ex.id ? ' ex-card-flash' : ''}${done ? ' ex-card-done' : ''}`}
              style={{
                '--ex-color': ex.color,
                borderColor: done ? `${ex.color}66` : `${ex.color}25`,
                boxShadow: done ? `0 0 18px ${ex.color}22` : 'none',
              }}
            >
              {/* Burst floaters */}
              {bursts.filter(b => b.exId === ex.id).map(b => (
                <div key={b.id} className="ex-burst" style={{ color: ex.color }}>
                  +{b.kcal} kcal
                </div>
              ))}

              {done && <div className="ex-done-ribbon">✓ Goal!</div>}

              <div className="ex-card-header">
                <span className="ex-emoji">{ex.emoji}</span>
                <span className="ex-name">{ex.name}</span>
              </div>

              <div className="ex-ring-wrap">
                <RingProgress count={count} goal={ex.goal} color={ex.color} />
                <div className="ex-ring-center">
                  <span className="ex-count-num" style={{ color: ex.color }}>{count}</span>
                  <span className="ex-count-unit">{ex.unit}</span>
                </div>
              </div>

              <div className="ex-card-footer">
                <span className="ex-goal-label">Goal: {ex.goal} {ex.unit}</span>
                <button
                  className="ex-add-btn"
                  onClick={() => addCount(ex)}
                  style={{
                    background: `rgba(${ex.rgba}, 0.12)`,
                    borderColor: `rgba(${ex.rgba}, 0.40)`,
                    color: ex.color,
                  }}
                >
                  +{ex.step}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
