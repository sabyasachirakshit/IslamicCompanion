import { useState } from 'react'

export default function NameModal({ onSave }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    localStorage.setItem('userName', trimmed)
    onSave(trimmed)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-icon">☪</div>
        <h2 className="modal-title">Assalamu Alaikum</h2>
        <p className="modal-sub">What should we call you?</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            className="modal-input"
            type="text"
            placeholder="Enter your name…"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            maxLength={40}
          />
          <button
            className="modal-btn"
            type="submit"
            disabled={!name.trim()}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
