import { useState, useEffect, useRef } from 'react'

export default function Diary() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('diaryNotes')
    return saved ? JSON.parse(saved) : []
  })
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [viewingNote, setViewingNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [titleInput, setTitleInput] = useState('')
  const [contentInput, setContentInput] = useState('')
  const titleRef = useRef(null)

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

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

  const handleCreateNote = () => {
    const trimmedTitle = titleInput.trim()
    const trimmedContent = contentInput.trim()
    
    if (trimmedTitle || trimmedContent) {
      const newNote = {
        id: generateId(),
        title: trimmedTitle || 'Untitled Note',
        content: trimmedContent,
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
    setIsCreating(false)
    setEditingNote(null)
  }

  const openNote = (note) => setViewingNote(note)
  const closeNote = () => setViewingNote(null)

  const filteredNotes = notes.filter(note => {
    const q = searchQuery.toLowerCase()
    return note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)
  })

  const startEditing = (note) => {
    setEditingNote(note)
    setTitleInput(note.title)
    setContentInput(note.content)
    setIsCreating(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  const getContentPreview = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
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
            
            <textarea
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="Write your note content..."
              className="diary-content-textarea"
              rows={8}
            />
            
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
      {viewingNote && (
        <div className="diary-modal-overlay" onClick={closeNote}>
          <div className="diary-modal" onClick={e => e.stopPropagation()}>
            <div className="diary-modal-header">
              <h2 className="diary-modal-title">{viewingNote.title}</h2>
              <div className="diary-modal-meta">
                <span className="diary-note-date">{formatDate(viewingNote.updatedAt)}</span>
                <button className="diary-close-btn" onClick={closeNote} title="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="diary-modal-body">
              {viewingNote.content
                ? viewingNote.content.split('\n').map((para, i) => <p key={i}>{para}</p>)
                : <p className="diary-note-empty">No content</p>
              }
            </div>
            <div className="diary-modal-footer">
              <button className="diary-btn diary-cancel-btn" onClick={closeNote}>Close</button>
              <button className="diary-btn diary-save-btn" onClick={() => { closeNote(); startEditing(viewingNote) }}>Edit</button>
            </div>
          </div>
        </div>
      )}

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
