import { useState, useEffect, useMemo } from 'react'

/* ── Default rewards catalogue ── */
const DEFAULT_REWARDS = [
  { id: 'dr_meal',    name: 'Favourite Meal',   cost: 10000  },
  { id: 'dr_snack',   name: 'Special Snack',     cost: 5000  },
]

const getWallet = () => parseFloat(localStorage.getItem('walletBalance') || '0')
const debitWallet = (amount) => {
  const b = getWallet()
  localStorage.setItem('walletBalance', String(+(b - amount).toFixed(2)))
  window.dispatchEvent(new CustomEvent('walletUpdated'))
}

const formatDate = (ts) => {
  const d = new Date(ts)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
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
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
)
const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
    <path d="M16 3H8L4 7h16z"/><circle cx="17" cy="14" r="1" fill="currentColor"/>
  </svg>
)
const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    <polyline points="12 7 12 12 15 15"/>
  </svg>
)

/* ── Reward Card ── */
function RewardCard({ reward, onRedeem, onDelete, canDelete }) {
  const [confirm, setConfirm] = useState(false)
  const balance = getWallet()
  const affordable = balance >= reward.cost

  const handleRedeem = () => {
    if (!confirm) { setConfirm(true); return }
    onRedeem(reward)
    setConfirm(false)
  }

  return (
    <div className={`rw-card${!affordable ? ' rw-card-low' : ''}`}>
      <div className="rw-card-top">
        <span className="rw-card-name">{reward.name}</span>
        {canDelete && (
          <button className="rw-delete-btn" onClick={() => onDelete(reward.id)} title="Remove">
            <TrashIcon />
          </button>
        )}
      </div>
      <div className="rw-card-cost">
        <span className="rw-cost-label">Cost</span>
        <span className="rw-cost-value">₹{reward.cost}</span>
      </div>
      {!affordable && <p className="rw-low-msg">Insufficient balance</p>}
      <button
        className={`rw-redeem-btn${confirm ? ' rw-redeem-confirm' : ''}${!affordable ? ' rw-redeem-disabled' : ''}`}
        onClick={handleRedeem}
        onBlur={() => setConfirm(false)}
      >
        {confirm ? '✓ Confirm Redeem?' : <><GiftIcon /> Redeem</>}
      </button>
    </div>
  )
}

/* ── Add Form ── */
function AddRewardForm({ onSave, onCancel }) {
  const [name, setName] = useState('')
  const [cost, setCost] = useState('50')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ id: `rw_${Date.now()}`, name: name.trim(), cost: Math.max(1, parseFloat(cost) || 1), createdAt: Date.now() })
  }

  return (
    <form className="deed-add-form rw-add-form" onSubmit={handleSubmit}>
      <input className="deed-form-input" type="text" placeholder="Reward name (e.g. Pizza Night)"
        value={name} onChange={e => setName(e.target.value)} autoFocus maxLength={80} />
      <div className="deed-form-row">
        <div className="deed-form-group">
          <label className="deed-form-label">Cost (₹)</label>
          <input className="deed-form-input deed-form-number" type="number" min="1" max="100000"
            value={cost} onChange={e => setCost(e.target.value)} placeholder="50" />
        </div>
      </div>
      <div className="deed-form-actions">
        <button className="deed-form-save rw-form-save" type="submit" disabled={!name.trim()}>Add Reward</button>
        <button className="deed-form-cancel" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

/* ── Main Page ── */
export default function Rewards() {
  const [customRewards, setCustomRewards] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rewardItems') || '[]') } catch { return [] }
  })
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rewardHistory') || '[]') } catch { return [] }
  })
  const [balance, setBalance] = useState(getWallet)
  const [search,      setSearch]      = useState('')
  const [showForm,    setShowForm]    = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const sync = () => setBalance(getWallet())
    window.addEventListener('walletUpdated', sync)
    return () => window.removeEventListener('walletUpdated', sync)
  }, [])

  const saveCustom  = (next) => { setCustomRewards(next); localStorage.setItem('rewardItems', JSON.stringify(next)) }
  const saveHistory = (next) => { setHistory(next);       localStorage.setItem('rewardHistory', JSON.stringify(next)) }

  const addReward    = (r) => { saveCustom([...customRewards, r]); setShowForm(false) }
  const deleteReward = (id) => saveCustom(customRewards.filter(r => r.id !== id))

  const redeemReward = (reward) => {
    debitWallet(reward.cost)
    setBalance(getWallet())
    const entry = { id: `rh_${Date.now()}`, rewardId: reward.id, name: reward.name, cost: reward.cost, timestamp: Date.now() }
    saveHistory([entry, ...history])
  }

  const allRewards = useMemo(() => {
    const all = [...DEFAULT_REWARDS, ...customRewards]
    if (!search.trim()) return all
    return all.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
  }, [customRewards, search])

  const defaultFiltered = allRewards.filter(r => DEFAULT_REWARDS.some(d => d.id === r.id))
  const customFiltered  = allRewards.filter(r => !DEFAULT_REWARDS.some(d => d.id === r.id))

  return (
    <div className="deeds-page">

      {/* Wallet balance banner */}
      <div className="rw-balance-banner">
        <span className="rw-balance-icon"><WalletIcon /></span>
        <span className="rw-balance-label">Wallet Balance</span>
        <span className={`rw-balance-amount${balance < 0 ? ' rw-balance-neg' : ''}`}>
          ₹{balance.toFixed(2)}
        </span>
      </div>

      {/* Toolbar */}
      <div className="deeds-toolbar">
        <div className="deeds-search-wrap">
          <span className="deeds-search-icon"><SearchIcon /></span>
          <input className="deeds-search" type="text" placeholder="Search rewards…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="deeds-add-btn rw-add-btn" onClick={() => setShowForm(s => !s)}>
          <PlusIcon /> Add Reward
        </button>
      </div>

      {/* Add form */}
      {showForm && <AddRewardForm onSave={addReward} onCancel={() => setShowForm(false)} />}

      {/* Default rewards */}
      {defaultFiltered.length > 0 && (
        <div className="deed-section">
          <h3 className="deed-section-title"><span className="rw-dot preset" />Preset Rewards</h3>
          <div className="rw-grid">
            {defaultFiltered.map(r => (
              <RewardCard key={r.id} reward={r} onRedeem={redeemReward} onDelete={() => {}} canDelete={false} />
            ))}
          </div>
        </div>
      )}

      {/* Custom rewards */}
      {customFiltered.length > 0 && (
        <div className="deed-section">
          <h3 className="deed-section-title"><span className="rw-dot custom" />My Rewards</h3>
          <div className="rw-grid">
            {customFiltered.map(r => (
              <RewardCard key={r.id} reward={r} onRedeem={redeemReward} onDelete={deleteReward} canDelete={true} />
            ))}
          </div>
        </div>
      )}

      {allRewards.length === 0 && (
        <div className="deed-empty">No rewards match your search.</div>
      )}

      {/* Redemption history */}
      {history.length > 0 && (
        <div className="deed-section">
          <button className="deed-section-toggle" onClick={() => setShowHistory(s => !s)}>
            <span className="deed-section-title" style={{ margin: 0 }}>
              <HistoryIcon /><span style={{ marginLeft: 8 }}>Redemption History ({history.length})</span>
            </span>
            <span>{showHistory ? <ChevronUp /> : <ChevronDown />}</span>
          </button>
          {showHistory && (
            <div className="rw-history-list">
              {history.map(h => (
                <div key={h.id} className="rw-history-row">
                  <span className="rw-history-name">{h.name}</span>
                  <span className="rw-history-date">{formatDate(h.timestamp)}</span>
                  <span className="rw-history-cost">-₹{h.cost}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
