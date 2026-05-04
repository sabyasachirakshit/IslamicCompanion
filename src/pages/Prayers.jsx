import { useState } from 'react'
import { PRAYER_GROUPS, ALL_PRAYERS, TYPE_META, todayStatusKey } from '../data/prayers'

const creditWallet = (amount) => {
  if (amount <= 0) return
  const balance = parseFloat(localStorage.getItem('walletBalance') || '0')
  localStorage.setItem('walletBalance', String(+(balance + amount).toFixed(2)))
  window.dispatchEvent(new CustomEvent('walletUpdated'))
}

const debitWallet = (amount) => {
  if (amount <= 0) return
  const balance = parseFloat(localStorage.getItem('walletBalance') || '0')
  localStorage.setItem('walletBalance', String(+(balance - amount).toFixed(2)))
  window.dispatchEvent(new CustomEvent('walletUpdated'))
}

/* ── Motivational Hadiths ── */
const MISSED_MOTIVATION = {
  tahajjud: {
    emoji: '🌙', title: "Don't Give Up on Tahajjud",
    subtitle: 'The night prayer is a gift — tomorrow is a new chance.',
    color: '#FFD700', rgba: '255,215,0',
    hadiths: [
      { text: "The best prayer after the obligatory prayers is the night prayer (Tahajjud).", source: 'Sahih Muslim 1163' },
      { text: "Our Lord descends every night to the lowest heaven when the last third of the night remains, saying: 'Who is calling Me so I can answer? Who is asking of Me so I can give? Who is seeking My forgiveness so I can forgive?'", source: 'Bukhari & Muslim' },
      { text: "Pray Tahajjud — it was the practice of the righteous before you. It brings you closer to Allah, expiates sins, prevents wrongdoing, and expels disease from the body.", source: 'Tirmidhi, Authenticated' },
      { text: "In Paradise there are rooms whose interior can be seen from the outside. Allah prepared them for those who feed others, speak gently, fast regularly, and pray at night while people sleep.", source: 'Ahmad, Authenticated by Al-Albani' },
    ],
  },
  fajr: {
    emoji: '🌅', title: "Don't Miss Fajr Tomorrow",
    subtitle: 'The dawn prayer is witnessed by the angels.',
    color: '#A78BFA', rgba: '167,139,250',
    sections: [
      {
        label: '✨ Its Virtue & Importance',
        hadiths: [
          { text: "The two rak'ahs before Fajr are better than this world and all it contains.", source: 'Sahih Muslim 725' },
          { text: "Whoever prays Fajr in congregation, then sits remembering Allah until the sun rises, then prays two rak'ahs — he will have a reward like that of a complete Hajj and Umrah.", source: 'Tirmidhi 586, Authenticated' },
          { text: "Whoever prays the two cool prayers (Fajr and Asr) will enter Paradise.", source: 'Bukhari 574' },
          { text: "Whoever prays the Fajr prayer is under the protection of Allah for that day.", source: 'Sahih Muslim 657' },
          { text: "Angels take turns among you by night and by day, and they all assemble at the Fajr and Asr prayers.", source: 'Bukhari 555' },
        ],
      },
      {
        label: '⚠️ Consequence of Missing It',
        hadiths: [
          { text: "When one of you sleeps, Shaytan ties three knots at the back of his neck, sealing each with: 'You have a long night, so sleep.' But if he wakes up and remembers Allah, one knot is undone. If he makes wudu, another is undone. And if he prays, all knots are undone — and he begins his morning in good spirits. Otherwise, he wakes up sluggish and in a bad state.", source: 'Bukhari 1142, Muslim 776' },
          { text: "Satan urinates in the ear of the one who sleeps through the morning prayer without waking up for it.", source: 'Bukhari 3270' },
          { text: "The most burdensome prayers for the hypocrites are Isha and Fajr. If they only knew what they contain, they would attend even if they had to crawl.", source: 'Bukhari & Muslim' },
          { text: "Whoever abandons the prayer has indeed lost everything. Whoever guards it has guarded his religion — and whoever loses his religion has lost everything.", source: 'Ahmad, Authenticated by Al-Albani' },
        ],
      },
    ],
  },
  dhuhr: {
    emoji: '☀️', title: "Keep Up with Dhuhr",
    subtitle: 'The midday prayer keeps your day blessed.',
    color: '#FBBF24', rgba: '251,191,36',
    hadiths: [
      { text: "Whoever prays twelve rak'ahs of Sunnah daily, Allah will build for him a house in Paradise: four before Dhuhr and two after.", source: 'Tirmidhi, Authenticated' },
      { text: "The gates of heaven are opened at midday. I love that a righteous deed be raised up for me at that time.", source: 'Tirmidhi 478' },
    ],
  },
  asr: {
    emoji: '🌤', title: "Don't Neglect Asr",
    subtitle: 'The Asr prayer is the middle prayer — guard it.',
    color: '#60A5FA', rgba: '96,165,250',
    hadiths: [
      { text: "Whoever misses the Asr prayer, it is as if he has lost his family and his wealth.", source: 'Bukhari 552' },
      { text: "Guard strictly the five obligatory prayers, especially the middle prayer (Asr).", source: 'Quran 2:238' },
    ],
  },
  maghrib: {
    emoji: '🌆', title: "Don't Delay Maghrib",
    subtitle: 'Sunset is a brief window — never miss it.',
    color: '#F97316', rgba: '249,115,22',
    hadiths: [
      { text: "My community will remain in goodness as long as they do not delay Maghrib until the stars appear.", source: 'Ahmad, Abu Dawud' },
      { text: "Two rak'ahs of Maghrib Sunnah — the Prophet ﷺ never left them, in travel or at home.", source: 'Bukhari 1182' },
    ],
  },
  isha: {
    emoji: '🌃', title: "Keep Up with Isha",
    subtitle: 'Isha at night is a light on the Day of Judgment.',
    color: '#00E5A0', rgba: '0,229,160',
    hadiths: [
      { text: "Whoever prays Isha in congregation, it is as if he prayed half the night. And whoever prays Fajr in congregation, it is as if he prayed the whole night.", source: 'Sahih Muslim 656' },
      { text: "The most burdensome prayers for the hypocrites are Isha and Fajr — yet they carry the greatest reward.", source: 'Bukhari & Muslim' },
    ],
  },
}

/* ── Icons ── */
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

/* ── Motivational Modal ── */
function MotivationalModal({ data, onClose }) {
  if (!data) return null
  const { emoji, title, subtitle, color, rgba, hadiths } = data
  return (
    <div className="motiv-overlay" onClick={onClose}>
      <div className="motiv-modal" onClick={e => e.stopPropagation()}
        style={{ borderColor: `rgba(${rgba},0.35)`, boxShadow: `0 0 40px rgba(${rgba},0.18)` }}>
        <div className="motiv-header" style={{ background: `rgba(${rgba},0.07)`, borderBottomColor: `rgba(${rgba},0.20)` }}>
          <span className="motiv-emoji">{emoji}</span>
          <div className="motiv-titles">
            <h3 className="motiv-title" style={{ color }}>{title}</h3>
            <p className="motiv-subtitle">{subtitle}</p>
          </div>
          <button className="motiv-close" onClick={onClose}>✕</button>
        </div>
        <div className="motiv-body">
          {data.sections ? data.sections.map((sec, si) => (
            <div key={si} className="motiv-section">
              <p className="motiv-section-label">{sec.label}</p>
              {sec.hadiths.map((h, i) => (
                <div key={i} className="motiv-hadith" style={{ borderLeftColor: `rgba(${rgba},0.50)` }}>
                  <p className="motiv-hadith-text">❝ {h.text} ❞</p>
                  <span className="motiv-hadith-source" style={{ color }}>— {h.source}</span>
                </div>
              ))}
            </div>
          )) : (
            <>
              <p className="motiv-intro">The Prophet ﷺ said:</p>
              {hadiths.map((h, i) => (
                <div key={i} className="motiv-hadith" style={{ borderLeftColor: `rgba(${rgba},0.50)` }}>
                  <p className="motiv-hadith-text">❝ {h.text} ❞</p>
                  <span className="motiv-hadith-source" style={{ color }}>— {h.source}</span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="motiv-footer">
          <button className="motiv-btn" style={{ background: `rgba(${rgba},0.14)`, color, borderColor: `rgba(${rgba},0.35)` }} onClick={onClose}>
            May Allah forgive me 🤲
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Dhikr Modal ── */
function DhikrModal({ pending, onAnswer }) {
  if (!pending) return null
  return (
    <div className="dhikr-overlay" onClick={() => onAnswer(false)}>
      <div className="dhikr-modal" onClick={e => e.stopPropagation()}>
        <div className="dhikr-header">
          <span className="dhikr-icon">📿</span>
          <div>
            <h3 className="dhikr-title">Post-Prayer Dhikr</h3>
            <p className="dhikr-sub">Did you recite the tasbih after <strong>{pending.prayer.name}</strong>?</p>
          </div>
        </div>
        <div className="dhikr-body">
          <div className="dhikr-row">
            <div className="dhikr-item">
              <span className="dhikr-count">33×</span>
              <span className="dhikr-arabic">سُبْحَانَ اللَّهِ</span>
              <span className="dhikr-latin">SubhanAllah</span>
            </div>
            <div className="dhikr-item">
              <span className="dhikr-count">33×</span>
              <span className="dhikr-arabic">الْحَمْدُ لِلَّهِ</span>
              <span className="dhikr-latin">Alhamdulillah</span>
            </div>
            <div className="dhikr-item">
              <span className="dhikr-count">33×</span>
              <span className="dhikr-arabic">اللَّهُ أَكْبَرُ</span>
              <span className="dhikr-latin">Allahu Akbar</span>
            </div>
          </div>
          <div className="dhikr-item dhikr-item-full">
            <span className="dhikr-count">1×</span>
            <span className="dhikr-arabic">لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ</span>
            <span className="dhikr-latin">Lā ilāha illallāh, waḥdahu lā sharīka lah, lahul mulku wa lahul ḥamd, wa huwa ʿalā kulli shayʾin qadīr</span>
          </div>
          <div className="dhikr-hadith">
            <p>❝If anyone extols Allah after every prayer thirty-three times, and praises Allah thirty-three times, and declares His Greatness thirty-three times, ninety-nine times in all, and says to complete a hundred:" There is no god but Allah, having no partner with Him, to Him belongs sovereignty and to Him is praise due, and He is Potent over everything," his sins will be forgiven even If these are as abundant as the foam of the sea. ❞</p>
            <span className="dhikr-source">— Sahih Muslim 597a </span>
          </div>
        </div>
        <div className="dhikr-actions">
          <button className="dhikr-btn dhikr-yes" onClick={() => onAnswer(true)}>
            ✓ Yes, I did it <em>+₹50</em>
          </button>
          <button className="dhikr-btn dhikr-no" onClick={() => onAnswer(false)}>
            ✕ No, I skipped <em>-₹50</em>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Prayer Row ── */
function PrayerRow({ prayer, status, groupId, onMark, onDhikrPrompt }) {
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
            <button className="prayer-btn prayer-btn-ontime"
              onClick={() => prayer.type === 'fardh' ? onDhikrPrompt(prayer, 'onTime', groupId) : onMark(prayer, 'onTime')}>
              <CheckIcon /> <span>On Time</span> <em>+₹{prayer.reward.onTime}</em>
            </button>
            {prayer.reward.late !== undefined && (
              <button className="prayer-btn prayer-btn-late"
                onClick={() => prayer.type === 'fardh' ? onDhikrPrompt(prayer, 'late', groupId) : onMark(prayer, 'late')}>
                ⏰ <span>Late</span> <em>+₹{prayer.reward.late}</em>
              </button>
            )}
            <button className="prayer-btn prayer-btn-missed" onClick={() => onMark(prayer, 'missed', groupId)}>
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
function PrayerGroup({ group, prayerStatus, onMark, onDhikrPrompt }) {
  const [expanded, setExpanded] = useState(true)
  const marked = group.prayers.filter(p => prayerStatus[p.id]).length
  const allMarked = marked === group.prayers.length

  return (
    <div className={`prayer-group${allMarked ? ' prayer-group-complete' : ''}${group.id === 'tahajjud' ? ' prayer-group-legendary' : ''}`}>
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
            <PrayerRow key={p.id} prayer={p} status={prayerStatus[p.id]} groupId={group.id} onMark={onMark} onDhikrPrompt={onDhikrPrompt} />
          ))}
        </div>
      )}
    </div>
  )
}


/* ── Main Page ── */
export default function Prayers() {
  const [prayerStatus, setPrayerStatus] = useState(() => {
    try { return JSON.parse(localStorage.getItem(todayStatusKey()) || '{}') } catch { return {} }
  })
  const [motivModal, setMotivModal]   = useState(null)
  const [dhikrPending, setDhikrPending] = useState(null)

  const promptDhikr = (prayer, status, groupId) => {
    setDhikrPending({ prayer, status, groupId })
  }

  const confirmDhikr = (didIt) => {
    if (!dhikrPending) return
    const { prayer, status, groupId } = dhikrPending
    markPrayer(prayer, status, groupId)
    if (didIt) creditWallet(50)
    else debitWallet(50)
    setDhikrPending(null)
  }

  const markPrayer = (prayer, status, groupId) => {
    if (prayerStatus[prayer.id]) return
    if (status === 'missed') {
      debitWallet(prayer.reward.missed ?? 0)
      if (MISSED_MOTIVATION[groupId]) setMotivModal(MISSED_MOTIVATION[groupId])
    } else {
      creditWallet(prayer.reward[status] ?? 0)
    }
    const next = { ...prayerStatus, [prayer.id]: status }
    setPrayerStatus(next)
    localStorage.setItem(todayStatusKey(), JSON.stringify(next))
  }

  /* summary */
  const totalPrayers = ALL_PRAYERS.length
  const markedPrayers = ALL_PRAYERS.filter(p => prayerStatus[p.id]).length
  const fardhDone = ALL_PRAYERS.filter(p => p.type === 'fardh' && prayerStatus[p.id] && prayerStatus[p.id] !== 'missed').length
  const earnedToday = ALL_PRAYERS.reduce((s, p) => {
    const st = prayerStatus[p.id]
    return s + (st && st !== 'missed' ? (p.reward[st] ?? 0) : 0)
  }, 0)
  const lostToday = ALL_PRAYERS.reduce((s, p) => {
    const st = prayerStatus[p.id]
    return s + (st === 'missed' ? (p.reward.missed ?? 0) : 0)
  }, 0)

  return (
    <div className="good-deeds">
      <MotivationalModal data={motivModal} onClose={() => setMotivModal(null)} />
      <DhikrModal pending={dhikrPending} onAnswer={confirmDhikr} />
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
        <div className="gd-summary-divider" />
        <div className="gd-summary-item">
          <span className="gd-summary-value" style={{ color: '#F87171' }}>-₹{lostToday.toFixed(2)}</span>
          <span className="gd-summary-label">Lost Today</span>
        </div>
      </div>

      <div className="gd-section">
        <h3 className="gd-section-title"><span className="gd-section-dot green" />Daily Prayers</h3>
        <div className="prayer-groups-list">
          {PRAYER_GROUPS.map(g => (
            <PrayerGroup key={g.id} group={g} prayerStatus={prayerStatus} onMark={markPrayer} onDhikrPrompt={promptDhikr} />
          ))}
        </div>
      </div>

    </div>
  )
}
