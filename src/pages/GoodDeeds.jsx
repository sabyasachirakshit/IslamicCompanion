import { useState } from 'react'

const PRAYERS = [
  { id: 'fajr',    name: 'Fajr',    arabic: 'الفجر',  time: 'Pre-Dawn',  reward: 15 },
  { id: 'dhuhr',   name: 'Dhuhr',   arabic: 'الظهر',  time: 'Midday',    reward: 10 },
  { id: 'asr',     name: 'Asr',     arabic: 'العصر',  time: 'Afternoon', reward: 10 },
  { id: 'maghrib', name: 'Maghrib', arabic: 'المغرب', time: 'Sunset',    reward: 10 },
  { id: 'isha',    name: 'Isha',    arabic: 'العشاء', time: 'Night',     reward: 10 },
]

const PRAYER_COLORS = {
  fajr:    { color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', glow: '0 0 12px rgba(167,139,250,0.25)' },
  dhuhr:   { color: '#FFD700', bg: 'rgba(255,215,0,0.12)',   glow: '0 0 12px rgba(255,215,0,0.25)'   },
  asr:     { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  glow: '0 0 12px rgba(96,165,250,0.25)'  },
  maghrib: { color: '#F97316', bg: 'rgba(249,115,22,0.12)',  glow: '0 0 12px rgba(249,115,22,0.25)'  },
  isha:    { color: '#00E5A0', bg: 'rgba(0,229,160,0.12)',   glow: '0 0 12px rgba(0,229,160,0.25)'   },
}

const todayKey = () => `completed_${new Date().toISOString().split('T')[0]}`

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)

function DeedRow({ deed, done, onMark, onRemove, colorStyle }) {
  const style = colorStyle || { color: '#F472B6', bg: 'rgba(244,114,182,0.12)', glow: '0 0 12px rgba(244,114,182,0.25)' }
  return (
    <div className={`deed-row${done ? ' deed-done' : ''}`}>
      <div className="deed-icon-wrap" style={{ background: style.bg, color: style.color, boxShadow: done ? 'none' : style.glow }}>
        <span className="deed-arabic-mini">{deed.arabic || '✦'}</span>
      </div>
      <div className="deed-info">
        <span className="deed-name">{deed.name}</span>
        {deed.time && <span className="deed-time">{deed.time}</span>}
      </div>
      <div className="deed-actions">
        <span className="deed-reward-chip">+₹{deed.reward}</span>
        {onRemove && !done && (
          <button className="deed-remove-btn" onClick={onRemove} title="Remove">
            <TrashIcon />
          </button>
        )}
        <button
          className={`deed-mark-btn${done ? ' deed-mark-done' : ''}`}
          onClick={() => !done && onMark(deed)}
          disabled={done}
          title={done ? 'Completed' : 'Mark as done'}
        >
          {done ? <CheckIcon /> : 'Done'}
        </button>
      </div>
    </div>
  )
}

export default function GoodDeeds() {
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem(todayKey()) || '[]') } catch { return [] }
  })

  const [customDeeds, setCustomDeeds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customDeeds') || '[]') } catch { return [] }
  })

  const [showForm, setShowForm] = useState(false)
  const [deedName, setDeedName] = useState('')
  const [deedReward, setDeedReward] = useState('5')

  const markDone = (deed) => {
    if (completed.includes(deed.id)) return
    const balance = parseFloat(localStorage.getItem('walletBalance') || '0')
    const newBalance = +(balance + deed.reward).toFixed(2)
    localStorage.setItem('walletBalance', String(newBalance))
    window.dispatchEvent(new CustomEvent('walletUpdated'))
    const next = [...completed, deed.id]
    setCompleted(next)
    localStorage.setItem(todayKey(), JSON.stringify(next))
  }

  const saveCustomDeed = (e) => {
    e.preventDefault()
    if (!deedName.trim()) return
    const deed = {
      id: `c_${Date.now()}`,
      name: deedName.trim(),
      reward: Math.max(1, parseFloat(deedReward) || 5),
    }
    const next = [...customDeeds, deed]
    setCustomDeeds(next)
    localStorage.setItem('customDeeds', JSON.stringify(next))
    setDeedName('')
    setDeedReward('5')
    setShowForm(false)
  }

  const removeDeed = (id) => {
    const next = customDeeds.filter(d => d.id !== id)
    setCustomDeeds(next)
    localStorage.setItem('customDeeds', JSON.stringify(next))
  }

  const allDeeds = [...PRAYERS, ...customDeeds]
  const doneCount = allDeeds.filter(d => completed.includes(d.id)).length
  const earnedToday = allDeeds
    .filter(d => completed.includes(d.id))
    .reduce((sum, d) => sum + d.reward, 0)

  const prayersDone = PRAYERS.filter(p => completed.includes(p.id)).length

  return (
    <div className="good-deeds">
      <div className="gd-summary-bar">
        <div className="gd-summary-item">
          <span className="gd-summary-value">{doneCount}<span className="gd-summary-total">/{allDeeds.length}</span></span>
          <span className="gd-summary-label">Completed Today</span>
        </div>
        <div className="gd-summary-divider" />
        <div className="gd-summary-item">
          <span className="gd-summary-value green">{prayersDone}<span className="gd-summary-total">/5</span></span>
          <span className="gd-summary-label">Prayers Done</span>
        </div>
        <div className="gd-summary-divider" />
        <div className="gd-summary-item">
          <span className="gd-summary-value gold">₹{earnedToday.toFixed(2)}</span>
          <span className="gd-summary-label">Earned Today</span>
        </div>
      </div>

      <div className="gd-section">
        <h3 className="gd-section-title">
          <span className="gd-section-dot green" />
          Daily Prayers
        </h3>
        <div className="gd-list">
          {PRAYERS.map(p => (
            <DeedRow
              key={p.id}
              deed={p}
              done={completed.includes(p.id)}
              onMark={markDone}
              colorStyle={PRAYER_COLORS[p.id]}
            />
          ))}
        </div>
      </div>

      <div className="gd-section">
        <div className="gd-section-header">
          <h3 className="gd-section-title">
            <span className="gd-section-dot gold" />
            Extra Good Deeds
          </h3>
          <button className="gd-add-btn" onClick={() => setShowForm(s => !s)}>
            <PlusIcon />
            Add Deed
          </button>
        </div>

        {showForm && (
          <form className="gd-add-form" onSubmit={saveCustomDeed}>
            <input
              className="gd-input"
              type="text"
              placeholder="Deed name (e.g. Read Quran)"
              value={deedName}
              onChange={e => setDeedName(e.target.value)}
              autoFocus
              maxLength={60}
            />
            <div className="gd-input-row">
              <div className="gd-input-group">
                <span className="gd-input-prefix">₹</span>
                <input
                  className="gd-input gd-input-reward"
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="Reward"
                  value={deedReward}
                  onChange={e => setDeedReward(e.target.value)}
                />
              </div>
              <button className="gd-save-btn" type="submit" disabled={!deedName.trim()}>Save</button>
              <button className="gd-cancel-btn" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {customDeeds.length === 0 && !showForm && (
          <p className="gd-empty">No custom deeds yet. Click <strong>Add Deed</strong> to track more good deeds.</p>
        )}

        <div className="gd-list">
          {customDeeds.map(d => (
            <DeedRow
              key={d.id}
              deed={d}
              done={completed.includes(d.id)}
              onMark={markDone}
              onRemove={() => removeDeed(d.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
