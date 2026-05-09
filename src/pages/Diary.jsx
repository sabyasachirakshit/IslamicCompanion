import { useState, useEffect, useRef } from 'react'

const PIN_KEY = 'diaryPin'

function PinScreen({ mode, onUnlock }) {
  const [digits, setDigits]   = useState(['', '', '', ''])
  const [confirm, setConfirm] = useState(['', '', '', ''])
  const [error, setError]     = useState('')
  const pinEls     = useRef([])
  const confirmEls = useRef([])

  useEffect(() => { pinEls.current[0]?.focus() }, [])

  const handleInput = (els, arr, setArr, i, val) => {
    if (!/^\d$/.test(val) && val !== '') return
    const next = [...arr]; next[i] = val; setArr(next)
    if (val && i < 3) {
      els.current[i + 1]?.focus()
    } else if (val && i === 3 && mode === 'enter' && els === pinEls) {
      const pinStr = next.join('')
      if (pinStr === localStorage.getItem(PIN_KEY)) {
        onUnlock()
      } else {
        setError('Incorrect PIN. Try again.')
        setDigits(['', '', '', ''])
        setTimeout(() => pinEls.current[0]?.focus(), 0)
      }
    }
  }

  const handleKeyDown = (els, arr, setArr, i, e) => {
    if (e.key === 'Backspace' && !arr[i] && i > 0) {
      const next = [...arr]; next[i - 1] = ''; setArr(next)
      els.current[i - 1]?.focus()
    }
  }

  const handleSubmit = () => {
    const pinStr = digits.join('')
    if (pinStr.length < 4) { setError('Please fill in all 4 digits.'); return }
    if (mode === 'set') {
      const cfStr = confirm.join('')
      if (cfStr.length < 4) { setError('Please confirm all 4 digits.'); return }
      if (pinStr !== cfStr) {
        setError('PINs do not match. Try again.')
        setDigits(['', '', '', '']); setConfirm(['', '', '', ''])
        pinEls.current[0]?.focus(); return
      }
      localStorage.setItem(PIN_KEY, pinStr)
      setTimeout(() => window.location.reload(), 0)
    } else {
      if (pinStr === localStorage.getItem(PIN_KEY)) {
        onUnlock()
      } else {
        setError('Incorrect PIN. Try again.')
        setDigits(['', '', '', ''])
        pinEls.current[0]?.focus()
      }
    }
  }

  const renderBoxes = (arr, setArr, els) =>
    arr.map((d, i) => (
      <input
        key={i}
        ref={el => { els.current[i] = el }}
        className="pin-box"
        type="password"
        inputMode="numeric"
        maxLength={1}
        value={d}
        onChange={e => handleInput(els, arr, setArr, i, e.target.value)}
        onKeyDown={e => handleKeyDown(els, arr, setArr, i, e)}
        onFocus={e => e.target.select()}
      />
    ))

  return (
    <div className="pin-screen">
      <div className="pin-card">
        <div className="pin-lock-icon">{mode === 'set' ? '🔐' : '🔒'}</div>
        <h2 className="pin-title">{mode === 'set' ? 'Protect Your Diary' : 'Diary is Locked'}</h2>
        <p className="pin-subtitle">
          {mode === 'set'
            ? 'Set a 4-digit PIN to keep your diary private.'
            : 'Enter your 4-digit PIN to continue.'}
        </p>

        <div className="pin-field-label">{mode === 'set' ? 'Choose PIN' : 'Enter PIN'}</div>
        <div className="pin-boxes">{renderBoxes(digits, setDigits, pinEls)}</div>

        {mode === 'set' && (
          <>
            <div className="pin-field-label">Confirm PIN</div>
            <div className="pin-boxes">{renderBoxes(confirm, setConfirm, confirmEls)}</div>
          </>
        )}

        {error && <p className="pin-error">{error}</p>}

        <button className="pin-submit-btn" onClick={handleSubmit}>
          {mode === 'set' ? 'Set PIN & Lock Diary' : 'Unlock'}
        </button>
      </div>
    </div>
  )
}

const compressImage = (file) =>
  new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 900
      let w = img.width, h = img.height
      if (w > MAX || h > MAX) { const r = Math.min(MAX/w, MAX/h); w = Math.round(w*r); h = Math.round(h*r) }
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      c.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(c.toDataURL('image/jpeg', 0.72))
      URL.revokeObjectURL(url)
    }
    img.src = url
  })

export default function Diary() {
  const [pinUnlocked, setPinUnlocked] = useState(false)
  const pinMode = localStorage.getItem(PIN_KEY) ? 'enter' : 'set'

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('diaryNotes')
    return saved ? JSON.parse(saved) : []
  })
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [viewingNote, setViewingNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalSearch, setModalSearch] = useState('')
  const [titleInput, setTitleInput] = useState('')
  const [contentInput, setContentInput] = useState('')
  const [imagesInput, setImagesInput] = useState({})
  const titleRef    = useRef(null)
  const imageInputRef  = useRef(null)
  const textareaRef    = useRef(null)

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('diaryNotes', JSON.stringify(notes))
  }, [notes])

  // Auto-focus title when creating/editing
  useEffect(() => {
    if ((isCreating || editingNote) && titleRef.current) {
      titleRef.current.focus()
    }
  }, [isCreating, editingNote])

  const DAILY_SCHEDULE_TEMPLATE = Array.from({ length: 24 }, (_, i) =>
    `${String(i).padStart(2, '0')}:00  `
  ).join('\n')

  const applyTemplate = () => setContentInput(DAILY_SCHEDULE_TEMPLATE)

  const stripTokens = (text) => text.replace(/!\[img:[a-z0-9_]+\]/g, '').replace(/\n{3,}/g, '\n\n').trim()

  const migrateImages = (imgs) => (!imgs || Array.isArray(imgs)) ? {} : imgs

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
      const dataUrl = await compressImage(file)
      const imgId = `img_${Date.now()}_${Math.random().toString(36).slice(2,6)}`
      setImagesInput(prev => ({ ...prev, [imgId]: dataUrl }))
      const ta = textareaRef.current
      if (ta) {
        const start = ta.selectionStart ?? ta.value.length
        const token = `\n![img:${imgId}]\n`
        setContentInput(prev => prev.slice(0, start) + token + prev.slice(start))
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + token.length; ta.focus() }, 0)
      }
    }
    e.target.value = ''
  }

  const removeImage = (id) => {
    setImagesInput(prev => { const n = { ...prev }; delete n[id]; return n })
    setContentInput(prev => prev.replace(new RegExp(`\\n?!\\[img:${id}\\]\\n?`, 'g'), '\n'))
  }

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

  const handleCreateNote = () => {
    const trimmedTitle = titleInput.trim()
    const trimmedContent = contentInput.trim()
    
    if (trimmedTitle || trimmedContent) {
      const newNote = {
        id: generateId(),
        title: trimmedTitle || 'Untitled Note',
        content: trimmedContent,
        images: imagesInput,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNotes(prev => [newNote, ...prev])
      resetForm()
    }
  }

  const handleUpdateNote = () => {
    if (!editingNote) return
    
    const trimmedTitle = titleInput.trim()
    const trimmedContent = contentInput.trim()
    
    if (trimmedTitle || trimmedContent) {
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { 
              ...note, 
              title: trimmedTitle || 'Untitled Note',
              content: trimmedContent,
              images: imagesInput,
              updatedAt: new Date().toISOString()
            }
          : note
      ))
      resetForm()
    }
  }

  const handleDeleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId))
  }

  const resetForm = () => {
    setTitleInput('')
    setContentInput('')
    setImagesInput({})
    setIsCreating(false)
    setEditingNote(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const highlightText = (text, query) => {
    if (!query.trim() || !text) return text
    const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="diary-highlight">{part}</mark>
        : part
    )
  }

  const openNote = (note) => { setViewingNote(note); setModalSearch('') }
  const closeNote = () => { setViewingNote(null); setModalSearch('') }

  const filteredNotes = notes.filter(note => {
    const q = searchQuery.toLowerCase()
    const dateStr = formatDate(note.updatedAt).toLowerCase()
    return note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q) || dateStr.includes(q)
  })

  const startEditing = (note) => {
    setEditingNote(note)
    setTitleInput(note.title)
    setContentInput(note.content)
    setImagesInput(migrateImages(note.images))
    setIsCreating(false)
  }

  const getContentPreview = (content, maxLength = 120) => {
    const clean = stripTokens(content)
    if (clean.length <= maxLength) return clean
    return clean.substring(0, maxLength) + '...'
  }

  const renderInlineContent = (content, images, searchQ) => {
    const TOKEN_RE = /!\[img:([a-z0-9_]+)\]/g
    const parts = []
    let last = 0, m
    while ((m = TOKEN_RE.exec(content)) !== null) {
      if (m.index > last) parts.push({ type: 'text', value: content.slice(last, m.index) })
      parts.push({ type: 'image', id: m[1] })
      last = m.index + m[0].length
    }
    if (last < content.length) parts.push({ type: 'text', value: content.slice(last) })
    return parts.map((part, i) => {
      if (part.type === 'image') {
        const src = images?.[part.id]
        return src ? <img key={i} src={src} alt="note" className="diary-inline-image" /> : null
      }
      return part.value.split('\n').filter(l => l.trim() !== '' || i === 0).map((line, j) =>
        <p key={`${i}-${j}`}>{highlightText(line, searchQ)}</p>
      )
    })
  }

  if (!pinUnlocked) {
    return <PinScreen mode={pinMode} onUnlock={() => setPinUnlocked(true)} />
  }

  return (
    <div className="diary-page">
      <div className="diary-header">
        <h1>Diary</h1>
        <div className="diary-search-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="diary-search-input"
          />
          {searchQuery && (
            <button className="diary-search-clear" onClick={() => setSearchQuery('')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
        <button 
          className="diary-create-btn"
          onClick={() => {
            setIsCreating(true)
            setEditingNote(null)
            setTitleInput('')
            setContentInput('')
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Note
        </button>
      </div>

      {/* Create/Edit Note Form */}
      {(isCreating || editingNote) && (
        <div className="diary-note-editor">
          <div className="diary-editor-header">
            <h2>{isCreating ? 'Create Note' : 'Edit Note'}</h2>
            <button className="diary-close-btn" onClick={resetForm}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div className="diary-editor-fields">
            <input
              ref={titleRef}
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Note title..."
              className="diary-title-input"
            />
            
            <div className="diary-template-bar">
              <span className="diary-template-label">Template:</span>
              <button type="button" className="diary-template-btn" onClick={applyTemplate}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Daily Schedule
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="Write your note content..."
              className="diary-content-textarea"
              rows={8}
            />
            
            <input ref={imageInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
            <button type="button" className="diary-image-upload-btn" onClick={() => imageInputRef.current?.click()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Insert Photo at cursor
            </button>
            {Object.keys(imagesInput).length > 0 && (
              <div className="diary-image-preview-grid">
                {Object.entries(imagesInput).map(([id, src]) => (
                  <div key={id} className="diary-image-preview-item">
                    <img src={src} alt={id} className="diary-preview-thumb" />
                    <button className="diary-image-remove-btn" onClick={() => removeImage(id)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="diary-editor-actions">
              <button 
                className="diary-btn diary-save-btn" 
                onClick={isCreating ? handleCreateNote : handleUpdateNote}
              >
                {isCreating ? 'Create' : 'Save'}
              </button>
              <button className="diary-btn diary-cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Read-Only Note Modal */}
      {viewingNote && (() => {
        const matchCount = modalSearch.trim()
          ? (viewingNote.content.match(new RegExp(escapeRegex(modalSearch), 'gi')) || []).length
          : 0
        return (
        <div className="diary-modal-overlay" onClick={closeNote}>
          <div className="diary-modal" onClick={e => e.stopPropagation()}>
            <div className="diary-modal-header">
              <h2 className="diary-modal-title">{highlightText(viewingNote.title, modalSearch)}</h2>
              <div className="diary-modal-meta">
                <span className="diary-note-date">{formatDate(viewingNote.updatedAt)}</span>
                <button className="diary-close-btn" onClick={closeNote} title="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="diary-modal-search-bar">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="diary-modal-search-input"
                type="text"
                placeholder="Search in note…"
                value={modalSearch}
                onChange={e => setModalSearch(e.target.value)}
              />
              {modalSearch && (
                <span className="diary-modal-match-count">
                  {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                </span>
              )}
              {modalSearch && (
                <button className="diary-search-clear" onClick={() => setModalSearch('')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="diary-modal-body">
              {viewingNote.content
                ? renderInlineContent(viewingNote.content, migrateImages(viewingNote.images), modalSearch)
                : <p className="diary-note-empty">No content</p>
              }
            </div>
            <div className="diary-modal-footer">
              <button className="diary-btn diary-cancel-btn" onClick={closeNote}>Close</button>
              <button className="diary-btn diary-save-btn" onClick={() => { closeNote(); startEditing(viewingNote) }}>Edit</button>
            </div>
          </div>
        </div>
        )
      })()}

      {/* Notes Grid */}
      <div className="diary-notes-grid">
        {notes.length === 0 ? (
          <div className="diary-empty-state">
            <div className="diary-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3>No notes yet</h3>
            <p>Create your first note to get started</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="diary-empty-state">
            <div className="diary-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3>No results found</h3>
            <p>No notes match &ldquo;{searchQuery}&rdquo;</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="diary-note-card">
              <div className="diary-note-header">
                <h3 className="diary-note-title">{note.title}</h3>
                <div className="diary-note-actions">
                  <button
                    className="diary-note-action-btn"
                    onClick={() => openNote(note)}
                    title="Read note"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button 
                    className="diary-note-action-btn"
                    onClick={() => startEditing(note)}
                    title="Edit note"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    className="diary-note-action-btn diary-delete-btn"
                    onClick={() => handleDeleteNote(note.id)}
                    title="Delete note"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/>
                      <path d="M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="diary-note-content">
                {note.content ? (
                  <p>{getContentPreview(note.content)}</p>
                ) : (
                  <p className="diary-note-empty">No content</p>
                )}
              </div>
              
              <div className="diary-note-footer">
                <span className="diary-note-date">{formatDate(note.updatedAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
