import { useState, useMemo, useRef } from 'react'
import SampleGoodDeeds from "../assets/sample-good-deeds.json"

/* ── Constants ── */
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }
const PRIORITY_META  = {
  high:   { label: 'High',   color: '#F87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.30)' },
  medium: { label: 'Medium', color: '#FBBF24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)'  },
  low:    { label: 'Low',    color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',   border: 'rgba(96,165,250,0.30)'  },
}

const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const deedStatusKey = () => `deedStatus_${todayKey()}`

const creditWallet = (amount) => {
  if (amount <= 0) return
  const b = parseFloat(localStorage.getItem('walletBalance') || '0')
  localStorage.setItem('walletBalance', String(+(b + amount).toFixed(2)))
  const k = `dailyEarned_${todayKey()}`
  localStorage.setItem(k, String(+(parseFloat(localStorage.getItem(k) || '0') + amount).toFixed(2)))
  window.dispatchEvent(new CustomEvent('walletUpdated'))
}
const debitWallet = (amount) => {
  if (amount <= 0) return
  const b = parseFloat(localStorage.getItem('walletBalance') || '0')
  localStorage.setItem('walletBalance', String(+(b - amount).toFixed(2)))
  const k = `dailyLost_${todayKey()}`
  localStorage.setItem(k, String(+(parseFloat(localStorage.getItem(k) || '0') + amount).toFixed(2)))
  window.dispatchEvent(new CustomEvent('walletUpdated'))
}

/* ── Icons ── */
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const SortIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
  </svg>
)
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const InitializeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
  </svg>
)
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const ChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
)
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const EraseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

/* ── Deed Detail Modal ── */
function DeedModal({ deed, status, isOnetime, onClose, onMark, onNext, hasNext }) {
  const pm = PRIORITY_META[deed.priority]
  const isMarked = !!status
  const created = new Date(deed.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="deed-modal-backdrop" onClick={onClose}>
      <div className="deed-modal" onClick={e => e.stopPropagation()}>
        <div className="deed-modal-header">
          <span className="deed-priority-pill" style={{ color: pm.color, background: pm.bg, borderColor: pm.border }}>
            {pm.label}
          </span>
          <button className="deed-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>
        <h2 className="deed-modal-name">{deed.name}</h2>
        <div className="deed-modal-meta">
          <span className="deed-modal-chip">{isOnetime ? 'One-time' : 'Daily'}</span>
          <span className="deed-modal-chip deed-modal-chip-reward">+₹{deed.reward} reward</span>
          <span className="deed-modal-chip deed-modal-chip-penalty">-₹{deed.penalty} penalty</span>
        </div>
        {!isMarked && onMark && (
          <div className="deed-modal-actions">
            <button className="deed-btn deed-btn-done deed-modal-act-btn" onClick={() => onMark('done')}>
              <CheckIcon /> <span>{isOnetime ? 'Complete' : 'Done'}</span> <em>+₹{deed.reward}</em>
            </button>
            <button className="deed-btn deed-btn-missed deed-modal-act-btn" onClick={() => onMark('missed')}>
              ✕ <span>Missed</span> <em>-₹{deed.penalty}</em>
            </button>
          </div>
        )}
        <div className="deed-modal-footer">
          <span className="deed-modal-created">Created {created}</span>
          {isMarked && (
            <span className={`deed-status-badge deed-status-${status}`} style={{ fontSize: 12 }}>
              {status === 'done'   && <><CheckIcon /> {isOnetime ? 'Completed' : 'Done'} · +₹{deed.reward}</>}
              {status === 'missed' && <>✕ Missed · -₹{deed.penalty}</>}
            </span>
          )}
        </div>
        {hasNext && (
          <button className="deed-modal-next-btn" onClick={onNext}>Next Task →</button>
        )}
      </div>
    </div>
  )
}

/* ── Deed Row ── */
function DeedRow({ deed, status, onMark, onDelete, isOnetime, onOpen, onEdit }) {
  const pm = PRIORITY_META[deed.priority]
  const isMarked = !!status

  return (
    <div className={`deed-item${isMarked ? ` deed-item-${status}` : ''}`}>
      <div className="deed-item-left" style={{ minWidth: 0, flex: 1 }}>
        <span className="deed-priority-pill" style={{ color: pm.color, background: pm.bg, borderColor: pm.border }}>
          {pm.label}
        </span>
        <div className="deed-item-info" style={{ minWidth: 0 }}>
          <span className="deed-item-name deed-item-name-clickable" onClick={onOpen}>{deed.name}</span>
          <span className="deed-item-meta">
            {isOnetime ? 'One-time' : 'Daily'} · +₹{deed.reward} / -₹{deed.penalty}
          </span>
        </div>
      </div>

      <div className="deed-item-right">
        {!isMarked ? (
          <div className="deed-item-btns">
            <button className="deed-btn deed-btn-done" onClick={() => onMark(deed, 'done')}>
              <CheckIcon /> <span>{isOnetime ? 'Complete' : 'Done'}</span> <em>+₹{deed.reward}</em>
            </button>
            <button className="deed-btn deed-btn-missed" onClick={() => onMark(deed, 'missed')}>
              ✕ <span>Missed</span> <em>-₹{deed.penalty}</em>
            </button>
            <button className="deed-btn deed-btn-edit" onClick={() => onEdit(deed)} title="Edit">
              <EditIcon />
            </button>
            <button className="deed-btn deed-btn-delete" onClick={() => onDelete(deed.id)} title="Delete">
              <TrashIcon />
            </button>
          </div>
        ) : (
          <div className={`deed-status-badge deed-status-${status}`}>
            {status === 'done'   && <><CheckIcon /> {isOnetime ? 'Completed' : 'Done'} · +₹{deed.reward}</>}
            {status === 'missed' && <>✕ Missed · -₹{deed.penalty}</>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Edit Form ── */
function EditDeedForm({ deed, onSave, onCancel }) {
  const [name,     setName]     = useState(deed.name)
  const [type,     setType]     = useState(deed.type)
  const [reward,   setReward]   = useState(String(deed.reward))
  const [penalty,  setPenalty]  = useState(String(deed.penalty))
  const [priority, setPriority] = useState(deed.priority)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ ...deed, name: name.trim(), type, reward: Math.max(0, parseFloat(reward) || 0), penalty: Math.max(0, parseFloat(penalty) || 0), priority })
  }

  return (
    <div className="deed-modal-backdrop" onClick={onCancel}>
      <div className="deed-edit-modal" onClick={e => e.stopPropagation()}>
        <div className="deed-edit-header">
          <h3 className="deed-edit-title">Edit Deed</h3>
          <button className="deed-modal-close" type="button" onClick={onCancel}><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <input className="deed-form-input" type="text" placeholder="Deed name"
            value={name} onChange={e => setName(e.target.value)} autoFocus />
          <div className="deed-form-row">
            <div className="deed-form-group">
              <label className="deed-form-label">Type</label>
              <div className="deed-type-toggle">
                <button type="button" className={`deed-type-btn${type === 'daily'   ? ' active' : ''}`} onClick={() => setType('daily')}>Daily</button>
                <button type="button" className={`deed-type-btn${type === 'onetime' ? ' active' : ''}`} onClick={() => setType('onetime')}>One-time</button>
              </div>
            </div>
            <div className="deed-form-group">
              <label className="deed-form-label">Priority</label>
              <div className="deed-priority-toggle">
                {['high','medium','low'].map(p => (
                  <button key={p} type="button"
                    className={`deed-prio-btn${priority === p ? ' active' : ''}`}
                    style={priority === p ? { background: PRIORITY_META[p].bg, borderColor: PRIORITY_META[p].color, color: PRIORITY_META[p].color } : {}}
                    onClick={() => setPriority(p)}>
                    {PRIORITY_META[p].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="deed-form-row">
            <div className="deed-form-group">
              <label className="deed-form-label">Reward (₹)</label>
              <input className="deed-form-input deed-form-number" type="number" min="0" max="10000"
                value={reward} onChange={e => setReward(e.target.value)} />
            </div>
            <div className="deed-form-group">
              <label className="deed-form-label">Penalty (₹)</label>
              <input className="deed-form-input deed-form-number" type="number" min="0" max="10000"
                value={penalty} onChange={e => setPenalty(e.target.value)} />
            </div>
          </div>
          <div className="deed-form-actions">
            <button className="deed-form-save" type="submit" disabled={!name.trim()}>Update Deed</button>
            <button className="deed-form-cancel" type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Add Form ── */
function AddDeedForm({ onSave, onCancel }) {
  const [name,     setName]     = useState('')
  const [type,     setType]     = useState('daily')
  const [reward,   setReward]   = useState('10')
  const [penalty,  setPenalty]  = useState('5')
  const [priority, setPriority] = useState('medium')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      id:        `d_${Date.now()}`,
      name:      name.trim(),
      type,
      reward:    Math.max(0, parseFloat(reward)  || 0),
      penalty:   Math.max(0, parseFloat(penalty) || 0),
      priority,
      createdAt: Date.now(),
    })
  }

  return (
    <form className="deed-add-form" onSubmit={handleSubmit}>
      <input className="deed-form-input" type="text" placeholder="Deed name (e.g. Read Quran)"
        value={name} onChange={e => setName(e.target.value)} autoFocus />

      <div className="deed-form-row">
        <div className="deed-form-group">
          <label className="deed-form-label">Type</label>
          <div className="deed-type-toggle">
            <button type="button" className={`deed-type-btn${type === 'daily'   ? ' active' : ''}`} onClick={() => setType('daily')}>Daily</button>
            <button type="button" className={`deed-type-btn${type === 'onetime' ? ' active' : ''}`} onClick={() => setType('onetime')}>One-time</button>
          </div>
        </div>

        <div className="deed-form-group">
          <label className="deed-form-label">Priority</label>
          <div className="deed-priority-toggle">
            {['high','medium','low'].map(p => (
              <button key={p} type="button"
                className={`deed-prio-btn${priority === p ? ' active' : ''}`}
                style={priority === p ? { background: PRIORITY_META[p].bg, borderColor: PRIORITY_META[p].color, color: PRIORITY_META[p].color } : {}}
                onClick={() => setPriority(p)}>
                {PRIORITY_META[p].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="deed-form-row">
        <div className="deed-form-group">
          <label className="deed-form-label">Reward (₹)</label>
          <input className="deed-form-input deed-form-number" type="number" min="0" max="10000"
            value={reward} onChange={e => setReward(e.target.value)} placeholder="0" />
        </div>
        <div className="deed-form-group">
          <label className="deed-form-label">Penalty (₹)</label>
          <input className="deed-form-input deed-form-number" type="number" min="0" max="10000"
            value={penalty} onChange={e => setPenalty(e.target.value)} placeholder="0" />
        </div>
      </div>

      <div className="deed-form-actions">
        <button className="deed-form-save" type="submit" disabled={!name.trim()}>Save Deed</button>
        <button className="deed-form-cancel" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

/* ── Main Page ── */
export default function GoodDeeds() {
  const [deeds, setDeeds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userDeeds') || '[]') } catch { return [] }
  })
  const [dailyStatus, setDailyStatus] = useState(() => {
    try { return JSON.parse(localStorage.getItem(deedStatusKey()) || '{}') } catch { return {} }
  })
  const [onetimeDone, setOnetimeDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem('onetimeDone') || '[]') } catch { return [] }
  })

  const [search,        setSearch]        = useState('')
  const [sortOrder,     setSortOrder]     = useState('high-low')
  const [showForm,      setShowForm]      = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [showUnfinished, setShowUnfinished] = useState(true)
  const [selectedDeed,  setSelectedDeed]  = useState(null)
  const [editingDeed,   setEditingDeed]   = useState(null)
  const modalNavRef = useRef([])

  const saveDeeds = (next) => { setDeeds(next); localStorage.setItem('userDeeds', JSON.stringify(next)) }

  const eraseAll = () => {
    if (!window.confirm('Erase ALL deeds? This cannot be undone.')) return
    saveDeeds([])
    setOnetimeDone([])
    localStorage.removeItem('onetimeDone')
  }

  const downloadUnfinished = () => {
    const data = JSON.stringify(deeds, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `all-deeds-${new Date().toISOString().slice(0,10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const uploadDeeds = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result)
        if (!Array.isArray(imported)) throw new Error('Not an array')
        const valid = imported.every(d => d.name && d.type && typeof d.reward === 'number' && typeof d.penalty === 'number' && d.priority)
        if (!valid) throw new Error('Invalid deed format')
        saveDeeds([...deeds, ...imported])
        e.target.value = ''
      } catch {
        alert('Failed to import deeds. Ensure the file is a valid JSON array of deeds.')
        e.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  const initializeSampleDeeds = async () => {
    if (!window.confirm('Load recommended sample deeds? This will add them to your existing deeds.')) return
    try {
      const sample = SampleGoodDeeds
      if (!Array.isArray(sample)) throw new Error('Invalid sample format')
      saveDeeds([...deeds, ...sample])
    } catch {
      alert('Failed to load sample deeds. Please ensure the file exists at /assets/sample-good-deeds.json')
    }
  }

  const addDeed = (deed) => { saveDeeds([...deeds, deed]); setShowForm(false) }

  const editDeed = (updated) => {
    saveDeeds(deeds.map(d => d.id === updated.id ? updated : d))
    setEditingDeed(null)
  }

  const deleteDeed = (id) => { saveDeeds(deeds.filter(d => d.id !== id)) }

  const markDaily = (deed, status) => {
    if (dailyStatus[deed.id]) return
    status === 'done' ? creditWallet(deed.reward) : debitWallet(deed.penalty)
    const next = { ...dailyStatus, [deed.id]: status }
    setDailyStatus(next)
    localStorage.setItem(deedStatusKey(), JSON.stringify(next))
  }

  const markOnetime = (deed, status) => {
    if (onetimeDone.includes(deed.id)) return
    status === 'done' ? creditWallet(deed.reward) : debitWallet(deed.penalty)
    if (status === 'done') {
      const next = [...onetimeDone, deed.id]
      setOnetimeDone(next)
      localStorage.setItem('onetimeDone', JSON.stringify(next))
    } else {
      const statusNext = { ...dailyStatus, [deed.id]: status }
      setDailyStatus(statusNext)
      localStorage.setItem(deedStatusKey(), JSON.stringify(statusNext))
    }
  }

  const sortedDeeds = useMemo(() => {
    let filtered = deeds.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    if (showUnfinished) {
      filtered = filtered.filter(d => {
        if (d.type === 'daily') return !dailyStatus[d.id]
        if (d.type === 'onetime') return !onetimeDone.includes(d.id)
        return true
      })
    }
    return [...filtered].sort((a, b) => {
      const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      return sortOrder === 'high-low' ? diff : -diff
    })
  }, [deeds, search, sortOrder, showUnfinished, dailyStatus, onetimeDone])

  const dailyDeeds    = sortedDeeds.filter(d => d.type === 'daily')
  const onetimePending = sortedDeeds.filter(d => d.type === 'onetime' && !onetimeDone.includes(d.id))
  const onetimeCompleted = deeds.filter(d => d.type === 'onetime' && onetimeDone.includes(d.id))

  const allDailyDeeds      = deeds.filter(d => d.type === 'daily')
  const allOnetimePending   = deeds.filter(d => d.type === 'onetime' && !onetimeDone.includes(d.id))

  const totalActive = allDailyDeeds.length + allOnetimePending.length
  const doneTodayCount = allDailyDeeds.filter(d => dailyStatus[d.id] === 'done').length
                       + allOnetimePending.filter(d => dailyStatus[d.id] === 'done').length
  const missedTodayCount = allDailyDeeds.filter(d => dailyStatus[d.id] === 'missed').length
                         + allOnetimePending.filter(d => dailyStatus[d.id] === 'missed').length

  const openDeedModal = (deed, isOnetime, status) => {
    const nav = [
      ...dailyDeeds.map(d => ({ deed: d, isOnetime: false })),
      ...onetimePending.map(d => ({ deed: d, isOnetime: true })),
    ]
    modalNavRef.current = nav
    const idx = nav.findIndex(x => x.deed.id === deed.id)
    setSelectedDeed({ deed, isOnetime, status, navIndex: idx, navTotal: nav.length })
  }

  const handleModalMark = (markStatus) => {
    const { deed, isOnetime } = selectedDeed
    isOnetime ? markOnetime(deed, markStatus) : markDaily(deed, markStatus)
    setSelectedDeed(prev => ({ ...prev, status: markStatus }))
  }

  const handleModalNext = () => {
    const next = modalNavRef.current[selectedDeed.navIndex + 1]
    if (next) {
      setSelectedDeed({
        deed: next.deed,
        isOnetime: next.isOnetime,
        status: dailyStatus[next.deed.id],
        navIndex: selectedDeed.navIndex + 1,
        navTotal: selectedDeed.navTotal,
      })
    } else {
      setSelectedDeed(null)
    }
  }

  return (
    <div className="deeds-page">

      {/* Toolbar */}
      <div className="deeds-toolbar">
        <div className="deeds-search-wrap">
          <span className="deeds-search-icon"><SearchIcon /></span>
          <input className="deeds-search" type="text" placeholder="Search deeds…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="deeds-sort-btn" onClick={() => setSortOrder(s => s === 'high-low' ? 'low-high' : 'high-low')}
          title={sortOrder === 'high-low' ? 'Sorted: High → Low' : 'Sorted: Low → High'}>
          <SortIcon />
          <span>{sortOrder === 'high-low' ? 'High → Low' : 'Low → High'}</span>
        </button>
        <button className={`deeds-filter-btn${showUnfinished ? ' active' : ''}`} onClick={() => setShowUnfinished(s => !s)}
          title={showUnfinished ? 'Showing: Unfinished only' : 'Filter: Unfinished only'}>
          <FilterIcon />
        </button>
        <button className="deeds-add-btn" onClick={() => setShowForm(s => !s)}>
          <PlusIcon /> Add Deed
        </button>
        <button className="deeds-erase-btn" onClick={eraseAll} title="Erase all deeds">
          <EraseIcon />
        </button>
        <button className="deeds-download-btn" onClick={downloadUnfinished} title="Download unfinished deeds (JSON)">
          <DownloadIcon />
        </button>
        <label className="deeds-upload-btn" title="Upload deeds from JSON">
          <UploadIcon />
          <input type="file" accept=".json" onChange={uploadDeeds} style={{ display: 'none' }} />
        </label>
        <button className="deeds-init-btn" onClick={initializeSampleDeeds} title="Initialize recommended deeds">
          <InitializeIcon />
        </button>
      </div>

      {/* Summary */}
      <div className="deeds-summary">
        <span className="deeds-summary-chip">
          <span className="dsf-val">{doneTodayCount}</span>/<span className="dsf-total">{totalActive}</span> done today
        </span>
        <span className="deeds-summary-chip">
          <span className="dsf-val" style={{ color: '#F87171' }}>{missedTodayCount}</span> missed today
        </span>
        <span className="deeds-summary-chip">
          <span className="dsf-val">{onetimeCompleted.length}</span> completed
        </span>
      </div>

      {/* Add form */}
      {showForm && <AddDeedForm onSave={addDeed} onCancel={() => setShowForm(false)} />}

      {/* Daily repeatable deeds */}
      {dailyDeeds.length > 0 && (
        <div className="deed-section">
          <h3 className="deed-section-title"><span className="deed-dot green" />Daily Deeds</h3>
          <div className="deed-list">
            {dailyDeeds.map(d => (
              <DeedRow key={d.id} deed={d} status={dailyStatus[d.id]} onMark={markDaily} onDelete={deleteDeed} isOnetime={false} onOpen={() => openDeedModal(d, false, dailyStatus[d.id])} onEdit={setEditingDeed} />
            ))}
          </div>
        </div>
      )}

      {/* One-time pending deeds */}
      {onetimePending.length > 0 && (
        <div className="deed-section">
          <h3 className="deed-section-title"><span className="deed-dot gold" />One-time Deeds</h3>
          <div className="deed-list">
            {onetimePending.map(d => (
              <DeedRow key={d.id} deed={d} status={dailyStatus[d.id]} onMark={markOnetime} onDelete={deleteDeed} isOnetime={true} onOpen={() => openDeedModal(d, true, dailyStatus[d.id])} onEdit={setEditingDeed} />
            ))}
          </div>
        </div>
      )}

      {dailyDeeds.length === 0 && onetimePending.length === 0 && !showForm && (
        <div className="deed-empty">
          <p>No deeds yet. Click <strong>Add Deed</strong> to get started.</p>Use Priority button to sort tasks based on priority order.
        </div>
      )}

      {/* Completed one-time deeds – collapsible */}
      {onetimeCompleted.length > 0 && (
        <div className="deed-section deed-section-completed">
          <button className="deed-section-toggle" onClick={() => setShowCompleted(s => !s)}>
            <span className="deed-section-title" style={{ margin: 0 }}>
              <span className="deed-dot muted" />Completed One-time ({onetimeCompleted.length})
            </span>
            <span>{showCompleted ? <ChevronUp /> : <ChevronDown />}</span>
          </button>
          {showCompleted && (
            <div className="deed-list deed-list-completed">
              {onetimeCompleted.map(d => (
                <DeedRow key={d.id} deed={d} status="done" onMark={() => {}} onDelete={deleteDeed} isOnetime={true} onOpen={() => setSelectedDeed({ deed: d, isOnetime: true, status: 'done', navIndex: -1 })} onEdit={setEditingDeed} />
              ))}
            </div>
          )}
        </div>
      )}

      {editingDeed && <EditDeedForm deed={editingDeed} onSave={editDeed} onCancel={() => setEditingDeed(null)} />}

      {selectedDeed && (
        <DeedModal
          deed={selectedDeed.deed}
          status={selectedDeed.status}
          isOnetime={selectedDeed.isOnetime}
          onClose={() => setSelectedDeed(null)}
          onMark={selectedDeed.navIndex >= 0 ? handleModalMark : undefined}
          onNext={handleModalNext}
          hasNext={selectedDeed.navIndex >= 0 && selectedDeed.navIndex < selectedDeed.navTotal - 1}
        />
      )}

    </div>
  )
}
