import { useState, useCallback } from 'react'

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
const dailyCountsKey  = () => `dhikrCounts_${todayKey()}`
const ONETIME_KEY     = 'dhikrOnetimeCounts'
const DHIKR_LIST_KEY  = 'dhikrList'

const DEFAULT_DHIKR = [
  { id: 'subhanallah',   name: 'SubhanAllah',       arabic: 'سُبْحَانَ اللَّهِ',        meaning: 'Glory be to Allah',              target: 33,  type: 'daily',   color: '#A78BFA', rgba: '167,139,250' },
  { id: 'alhamdulillah', name: 'Alhamdulillah',     arabic: 'الْحَمْدُ لِلَّهِ',        meaning: 'All praise be to Allah',         target: 33,  type: 'daily',   color: '#34D399', rgba: '52,211,153'  },
  { id: 'allahuakbar',   name: 'Allahu Akbar',      arabic: 'اللَّهُ أَكْبَرُ',          meaning: 'Allah is the Greatest',          target: 34,  type: 'daily',   color: '#FBBF24', rgba: '251,191,36'  },
  { id: 'astaghfirullah',name: 'Astaghfirullah',    arabic: 'أَسْتَغْفِرُ اللَّهَ',      meaning: 'I seek forgiveness from Allah',  target: 100, type: 'daily',   color: '#F87171', rgba: '248,113,113' },
  { id: 'lailaha',       name: 'Lā ilāha illallāh', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', meaning: 'There is no god but Allah',      target: 100, type: 'daily',   color: '#60A5FA', rgba: '96,165,250'  },
  { id: 'salawat',       name: 'Salawat',            arabic: 'صَلَّى اللَّهُ عَلَيْهِ',    meaning: 'Blessings upon the Prophet ﷺ',  target: 100, type: 'onetime', color: '#F97316', rgba: '249,115,22'  },
]

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2,7)}`

const COLORS = [
  { color: '#A78BFA', rgba: '167,139,250' },
  { color: '#34D399', rgba: '52,211,153'  },
  { color: '#FBBF24', rgba: '251,191,36'  },
  { color: '#F87171', rgba: '248,113,113' },
  { color: '#60A5FA', rgba: '96,165,250'  },
  { color: '#F97316', rgba: '249,115,22'  },
  { color: '#EC4899', rgba: '236,72,153'  },
  { color: '#06B6D4', rgba: '6,182,212'   },
]

const loadList = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(DHIKR_LIST_KEY))
    return Array.isArray(stored) && stored.length ? stored : DEFAULT_DHIKR
  } catch { return DEFAULT_DHIKR }
}

const loadCounts = (list) => {
  const daily   = (() => { try { return JSON.parse(localStorage.getItem(dailyCountsKey()) || '{}') } catch { return {} } })()
  const onetime = (() => { try { return JSON.parse(localStorage.getItem(ONETIME_KEY) || '{}') }     catch { return {} } })()
  const merged = {}
  list.forEach(d => { merged[d.id] = d.type === 'daily' ? (daily[d.id] || 0) : (onetime[d.id] || 0) })
  return merged
}

const EMPTY_FORM = { name: '', arabic: '', meaning: '', target: 33, type: 'daily', colorIdx: 0 }

export default function Dhikr() {
  const [list,     setList]     = useState(loadList)
  const [counts,   setCounts]   = useState(() => loadCounts(loadList()))
  const [flash,    setFlash]    = useState(null)
  const [showForm,    setShowForm]    = useState(false)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [translating, setTranslating] = useState(false)
  const [transError,  setTransError]  = useState(null)

  const translateToArabic = async () => {
    if (!form.name.trim()) return
    setTranslating(true)
    setTransError(null)
    try {
      const res  = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(form.name.trim())}&langpair=en|ar`)
      const data = await res.json()
      const text = data?.responseData?.translatedText
      if (text && data.responseStatus === 200) {
        setForm(f => ({ ...f, arabic: text }))
      } else {
        setTransError('Translation failed — try typing manually')
      }
    } catch {
      setTransError('Network error — try again')
    }
    setTranslating(false)
  }

  const saveList = (next) => {
    setList(next)
    localStorage.setItem(DHIKR_LIST_KEY, JSON.stringify(next))
  }

  const tap = useCallback((dhikr) => {
    const current = counts[dhikr.id] || 0
    if (current >= dhikr.target) return
    const next = current + 1
    setCounts(prev => ({ ...prev, [dhikr.id]: next }))

    if (dhikr.type === 'daily') {
      const stored = (() => { try { return JSON.parse(localStorage.getItem(dailyCountsKey()) || '{}') } catch { return {} } })()
      localStorage.setItem(dailyCountsKey(), JSON.stringify({ ...stored, [dhikr.id]: next }))
    } else {
      const stored = (() => { try { return JSON.parse(localStorage.getItem(ONETIME_KEY) || '{}') } catch { return {} } })()
      localStorage.setItem(ONETIME_KEY, JSON.stringify({ ...stored, [dhikr.id]: next }))
    }

    if (next >= dhikr.target) {
      setFlash(dhikr.id)
      setTimeout(() => setFlash(null), 2000)
    }
  }, [counts])

  const reset = useCallback((dhikr) => {
    setCounts(prev => ({ ...prev, [dhikr.id]: 0 }))
    if (dhikr.type === 'daily') {
      const stored = (() => { try { return JSON.parse(localStorage.getItem(dailyCountsKey()) || '{}') } catch { return {} } })()
      localStorage.setItem(dailyCountsKey(), JSON.stringify({ ...stored, [dhikr.id]: 0 }))
    } else {
      const stored = (() => { try { return JSON.parse(localStorage.getItem(ONETIME_KEY) || '{}') } catch { return {} } })()
      localStorage.setItem(ONETIME_KEY, JSON.stringify({ ...stored, [dhikr.id]: 0 }))
    }
  }, [])

  const remove = (id) => {
    const next = list.filter(d => d.id !== id)
    saveList(next)
    setCounts(prev => { const c = { ...prev }; delete c[id]; return c })
  }

  const addDhikr = () => {
    if (!form.name.trim() || !form.target) return
    const c = COLORS[form.colorIdx]
    const entry = { id: uid(), name: form.name.trim(), arabic: form.arabic.trim(), meaning: form.meaning.trim(), target: Number(form.target), type: form.type, ...c }
    const next = [...list, entry]
    saveList(next)
    setCounts(prev => ({ ...prev, [entry.id]: 0 }))
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const totalToday = list.filter(d => d.type === 'daily').reduce((s, d) => s + (counts[d.id] || 0), 0)
  const dailyList  = list.filter(d => d.type === 'daily')
  const onetimeList= list.filter(d => d.type === 'onetime')

  const DhikrCard = ({ dhikr }) => {
    const count = counts[dhikr.id] || 0
    const pct   = Math.min(100, (count / dhikr.target) * 100)
    const done  = count >= dhikr.target
    return (
      <div className={`dhikr-card${done ? ' dhikr-card-done' : ''}${flash === dhikr.id ? ' dhikr-card-flash' : ''}`}
        style={{ '--dc': dhikr.color, borderColor: done ? `${dhikr.color}66` : `${dhikr.color}22` }}>

        {flash === dhikr.id && (
          <div className="dhikr-flash-msg">MashaAllah! ✨</div>
        )}

        <div className="dhikr-card-top">
          <div className="dhikr-card-info">
            {dhikr.arabic && <p className="dhikr-arabic">{dhikr.arabic}</p>}
            <p className="dhikr-name">{dhikr.name}</p>
            {dhikr.meaning && <p className="dhikr-meaning">{dhikr.meaning}</p>}
          </div>
          <div className="dhikr-card-right">
            <div className="dhikr-count-wrap" style={{ color: dhikr.color }}>
              <span className="dhikr-count-num">{count}</span>
              <span className="dhikr-count-sep">/</span>
              <span className="dhikr-count-target">{dhikr.target}</span>
            </div>
            <span className={`dhikr-type-badge ${dhikr.type === 'daily' ? 'dtb-daily' : 'dtb-onetime'}`}>
              {dhikr.type === 'daily' ? '🔄 Daily' : '⭐ One-time'}
            </span>
          </div>
        </div>

        <div className="dhikr-bar-wrap">
          <div className="dhikr-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${dhikr.color}99, ${dhikr.color})`, boxShadow: `0 0 10px ${dhikr.color}55` }} />
        </div>

        <div className="dhikr-card-footer">
          {done
            ? <div className="dhikr-done-row">
                <span className="dhikr-done-badge">✓ Completed</span>
                <button className="dhikr-reset-btn" onClick={() => reset(dhikr)}>Reset</button>
              </div>
            : <button className="dhikr-tap-btn" onClick={() => tap(dhikr)}
                style={{ background: `rgba(${dhikr.rgba},0.12)`, borderColor: `rgba(${dhikr.rgba},0.40)`, color: dhikr.color }}>
                + Dhikr
              </button>
          }
          <button className="dhikr-del-btn" onClick={() => remove(dhikr.id)} title="Remove">✕</button>
        </div>
      </div>
    )
  }

  return (
    <div className="dhikr-page">

      {/* Hero */}
      <div className="dhikr-hero">
        <div className="dhikr-hero-glow" />
        <p className="dhikr-hero-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <div className="dhikr-hero-count">{totalToday}</div>
        <p className="dhikr-hero-label">dhikr completed today</p>
        <p className="dhikr-hero-ayah">"Verily, in the remembrance of Allah do hearts find rest." — Quran 13:28</p>
      </div>

      {/* Daily Dhikr */}
      {dailyList.length > 0 && (
        <div className="dhikr-section">
          <h3 className="dhikr-section-title">🔄 Daily Dhikr</h3>
          <p className="dhikr-section-sub">Resets every day at midnight</p>
          <div className="dhikr-list">
            {dailyList.map(d => <DhikrCard key={d.id} dhikr={d} />)}
          </div>
        </div>
      )}

      {/* One-time Dhikr */}
      {onetimeList.length > 0 && (
        <div className="dhikr-section">
          <h3 className="dhikr-section-title">⭐ One-time Dhikr</h3>
          <p className="dhikr-section-sub">Progress is saved permanently</p>
          <div className="dhikr-list">
            {onetimeList.map(d => <DhikrCard key={d.id} dhikr={d} />)}
          </div>
        </div>
      )}

      {/* Add Button */}
      <button className="dhikr-add-fab" onClick={() => setShowForm(true)}>+ Add Dhikr</button>

      {/* Add Form Modal */}
      {showForm && (
        <div className="dhikr-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="dhikr-modal" onClick={e => e.stopPropagation()}>
            <h3 className="dhikr-modal-title">✨ Add Dhikr</h3>

            <label className="dhikr-label">Name *</label>
            <input className="dhikr-input" placeholder="e.g. SubhanAllah" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

            <label className="dhikr-label">Arabic (optional)</label>
            <div className="dhikr-arabic-row">
              <input className="dhikr-input dhikr-input-arabic" placeholder="سُبْحَانَ اللَّهِ" value={form.arabic}
                onChange={e => setForm(f => ({ ...f, arabic: e.target.value }))} dir="rtl" />
              <button className="dhikr-trans-btn" onClick={translateToArabic} disabled={translating || !form.name.trim()} title="Auto-translate name to Arabic">
                {translating ? '⏳' : '🌐'}
              </button>
            </div>
            {transError && <p className="dhikr-trans-error">{transError}</p>}

            <label className="dhikr-label">Meaning (optional)</label>
            <input className="dhikr-input" placeholder="Glory be to Allah" value={form.meaning}
              onChange={e => setForm(f => ({ ...f, meaning: e.target.value }))} />

            <label className="dhikr-label">Target Count *</label>
            <input className="dhikr-input" type="number" min="1" placeholder="33" value={form.target}
              onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />

            <label className="dhikr-label">Type</label>
            <div className="dhikr-type-toggle">
              <button className={`dtt-btn${form.type === 'daily' ? ' dtt-active' : ''}`} onClick={() => setForm(f => ({ ...f, type: 'daily' }))}>🔄 Daily</button>
              <button className={`dtt-btn${form.type === 'onetime' ? ' dtt-active' : ''}`} onClick={() => setForm(f => ({ ...f, type: 'onetime' }))}>⭐ One-time</button>
            </div>

            <label className="dhikr-label">Colour</label>
            <div className="dhikr-color-row">
              {COLORS.map((c, i) => (
                <button key={i} className={`dhikr-color-dot${form.colorIdx === i ? ' dcd-active' : ''}`}
                  style={{ background: c.color }} onClick={() => setForm(f => ({ ...f, colorIdx: i }))} />
              ))}
            </div>

            <div className="dhikr-modal-actions">
              <button className="dhikr-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="dhikr-save-btn" onClick={addDhikr} disabled={!form.name.trim() || !form.target}>Add Dhikr</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
