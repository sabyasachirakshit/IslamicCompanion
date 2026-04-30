import { useState } from 'react'
import { PRAYER_GROUPS, ALL_PRAYERS, TYPE_META, todayStatusKey, todayCompletedKey } from '../data/prayers'

const creditWallet = (amount) => {
  if (amount <= 0) return
  const balance = parseFloat(localStorage.getItem('walletBalance') || '0')
  localStorage.setItem('walletBalance', String(+(balance + amount).toFixed(2)))
  window.dispatchEvent(new CustomEvent('walletUpdated'))
}

const debitWallet = (amount) => {
  if (amount <= 0) return
  const balance = parseFloat(localStorage.getItem('walletBalance') || '0')
  localStorage.setItem('walletBalance', String(+Math.max(0, balance - amount).toFixed(2)))
  window.dispatchEvent(new CustomEvent('walletUpdated'))
}

/* ── Icons ── */
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const ChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
)
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

/* ── Prayer Row ── */
function PrayerRow({ prayer, status, onMark }) {
  const meta = TYPE_META[prayer.type]
  const isMarked = !!status

  return (
    <div className={`prayer-row${isMarked ? ` prayer-${status}` : ''}`}>
      <div className="prayer-row-left">
        <span className="prayer-type-pill" style={{ color: meta.color, borderColor: `${meta.color}40`, background: `${meta.color}12` }}>
          {meta.label}
        </span>
        <div className="prayer-row-info">
          <span className="prayer-row-name">{prayer.name}</span>
          <span className="prayer-row-rakaat">{prayer.rakaat} rak'at</span>
        </div>
      </div>

      <div className="prayer-row-right">
        {!isMarked ? (
          <div className="prayer-action-btns">
            <button className="prayer-btn prayer-btn-ontime" onClick={() => onMark(prayer, 'onTime')}>
              <CheckIcon /> <span>On Time</span> <em>+₹{prayer.reward.onTime}</em>
            </button>
            <button className="prayer-btn prayer-btn-late" onClick={() => onMark(prayer, 'late')}>
              ⏰ <span>Late</span> <em>+₹{prayer.reward.late}</em>
            </button>
            <button className="prayer-btn prayer-btn-missed" onClick={() => onMark(prayer, 'missed')}>
              ✕ <span>Missed</span>{prayer.reward.missed ? <em>-₹{prayer.reward.missed}</em> : null}
            </button>
          </div>
        ) : (
          <div className={`prayer-status-badge prayer-status-${status}`}>
            {status === 'onTime' && <><CheckIcon /> On Time · +₹{prayer.reward.onTime}</>}
            {status === 'late'   && <>⏰ Prayed Late · +₹{prayer.reward.late}</>}
            {status === 'missed' && <>✕ Missed{prayer.reward.missed ? ` · -₹${prayer.reward.missed}` : ''}</>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Prayer Group ── */
function PrayerGroup({ group, prayerStatus, onMark }) {
  const [expanded, setExpanded] = useState(true)
  const marked = group.prayers.filter(p => prayerStatus[p.id]).length
  const allMarked = marked === group.prayers.length

  return (
    <div className={`prayer-group${allMarked ? ' prayer-group-complete' : ''}`}>
      <button className="prayer-group-header" onClick={() => setExpanded(e => !e)}>
        <div className="prayer-group-icon" style={{ background: group.bg, color: group.color, boxShadow: group.glow }}>
          <span>{group.arabic}</span>
        </div>
        <div className="prayer-group-info">
          <span className="prayer-group-name">{group.name}</span>
          <span className="prayer-group-time">{group.time}</span>
        </div>
        <div className="prayer-group-meta">
          <span className="prayer-group-progress" style={{ color: allMarked ? '#00E5A0' : undefined }}>
            {marked}/{group.prayers.length}
          </span>
          <span className="prayer-group-chevron">{expanded ? <ChevronUp /> : <ChevronDown />}</span>
        </div>
      </button>
      {expanded && (
        <div className="prayer-group-rows">
          {group.prayers.map(p => (
            <PrayerRow key={p.id} prayer={p} status={prayerStatus[p.id]} onMark={onMark} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Custom Deed Row ── */
function DeedRow({ deed, done, onMark, onRemove }) {
  return (
    <div className={`deed-row${done ? ' deed-done' : ''}`}>
      <div className="deed-icon-wrap" style={{ background: 'rgba(244,114,182,0.12)', color: '#F472B6' }}>
        <span className="deed-arabic-mini">✦</span>
      </div>
      <div className="deed-info">
        <span className="deed-name">{deed.name}</span>
      </div>
      <div className="deed-actions">
        <span className="deed-reward-chip">+₹{deed.reward}</span>
        {onRemove && !done && (
          <button className="deed-remove-btn" onClick={onRemove}><TrashIcon /></button>
        )}
        <button
          className={`deed-mark-btn${done ? ' deed-mark-done' : ''}`}
          onClick={() => !done && onMark(deed)}
          disabled={done}
        >
          {done ? <><CheckIcon /> Done</> : 'Mark Done'}
        </button>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function GoodDeeds() {
  const [prayerStatus, setPrayerStatus] = useState(() => {
    try { return JSON.parse(localStorage.getItem(todayStatusKey()) || '{}') } catch { return {} }
  })

  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem(todayCompletedKey()) || '[]') } catch { return [] }
  })

  const [customDeeds, setCustomDeeds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customDeeds') || '[]') } catch { return [] }
  })

  const [showForm, setShowForm] = useState(false)
  const [deedName, setDeedName] = useState('')
  const [deedReward, setDeedReward] = useState('5')

  const markPrayer = (prayer, status) => {
    if (prayerStatus[prayer.id]) return
    if (status === 'missed') {
      debitWallet(prayer.reward.missed ?? 0)
    } else {
      creditWallet(prayer.reward[status] ?? 0)
    }
    const next = { ...prayerStatus, [prayer.id]: status }
    setPrayerStatus(next)
    localStorage.setItem(todayStatusKey(), JSON.stringify(next))
  }

  const markDeed = (deed) => {
    if (completed.includes(deed.id)) return
    creditWallet(deed.reward)
    const next = [...completed, deed.id]
    setCompleted(next)
    localStorage.setItem(todayCompletedKey(), JSON.stringify(next))
  }

  const saveCustomDeed = (e) => {
    e.preventDefault()
    if (!deedName.trim()) return
    const deed = { id: `c_${Date.now()}`, name: deedName.trim(), reward: Math.max(1, parseFloat(deedReward) || 5) }
    const next = [...customDeeds, deed]
    setCustomDeeds(next)
    localStorage.setItem('customDeeds', JSON.stringify(next))
    setDeedName(''); setDeedReward('5'); setShowForm(false)
  }

  const removeDeed = (id) => {
    const next = customDeeds.filter(d => d.id !== id)
    setCustomDeeds(next)
    localStorage.setItem('customDeeds', JSON.stringify(next))
  }

  /* summary */
  const totalPrayers = ALL_PRAYERS.length
  const markedPrayers = ALL_PRAYERS.filter(p => prayerStatus[p.id]).length
  const fardhDone = ALL_PRAYERS.filter(p => p.type === 'fardh' && prayerStatus[p.id] && prayerStatus[p.id] !== 'missed').length
  const earnedPrayers = ALL_PRAYERS.reduce((s, p) => {
    const st = prayerStatus[p.id]
    return s + (st && st !== 'missed' ? p.reward[st] : 0)
  }, 0)
  const earnedDeeds = customDeeds.filter(d => completed.includes(d.id)).reduce((s, d) => s + d.reward, 0)
  const earnedToday = earnedPrayers + earnedDeeds

  return (
    <div className="good-deeds">
      <div className="gd-summary-bar">
        <div className="gd-summary-item">
          <span className="gd-summary-value">{markedPrayers}<span className="gd-summary-total">/{totalPrayers}</span></span>
          <span className="gd-summary-label">Prayers Marked</span>
        </div>
        <div className="gd-summary-divider" />
        <div className="gd-summary-item">
          <span className="gd-summary-value green">{fardhDone}<span className="gd-summary-total">/5</span></span>
          <span className="gd-summary-label">Fardh Done</span>
        </div>
        <div className="gd-summary-divider" />
        <div className="gd-summary-item">
          <span className="gd-summary-value gold">₹{earnedToday.toFixed(2)}</span>
          <span className="gd-summary-label">Earned Today</span>
        </div>
      </div>

      <div className="gd-section">
        <h3 className="gd-section-title"><span className="gd-section-dot green" />Daily Prayers</h3>
        <div className="prayer-groups-list">
          {PRAYER_GROUPS.map(g => (
            <PrayerGroup key={g.id} group={g} prayerStatus={prayerStatus} onMark={markPrayer} />
          ))}
        </div>
      </div>

      <div className="gd-section">
        <div className="gd-section-header">
          <h3 className="gd-section-title"><span className="gd-section-dot gold" />Extra Good Deeds</h3>
          <button className="gd-add-btn" onClick={() => setShowForm(s => !s)}>
            <PlusIcon /> Add Deed
          </button>
        </div>

        {showForm && (
          <form className="gd-add-form" onSubmit={saveCustomDeed}>
            <input className="gd-input" type="text" placeholder="Deed name (e.g. Read Quran)"
              value={deedName} onChange={e => setDeedName(e.target.value)} autoFocus maxLength={60} />
            <div className="gd-input-row">
              <div className="gd-input-group">
                <span className="gd-input-prefix">₹</span>
                <input className="gd-input gd-input-reward" type="number" min="1" max="1000"
                  placeholder="Reward" value={deedReward} onChange={e => setDeedReward(e.target.value)} />
              </div>
              <button className="gd-save-btn" type="submit" disabled={!deedName.trim()}>Save</button>
              <button className="gd-cancel-btn" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {customDeeds.length === 0 && !showForm && (
          <p className="gd-empty">No custom deeds yet. Click <strong>Add Deed</strong> to get started.</p>
        )}

        <div className="gd-list">
          {customDeeds.map(d => (
            <DeedRow key={d.id} deed={d} done={completed.includes(d.id)}
              onMark={markDeed} onRemove={() => removeDeed(d.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
