export default function About() {
  return (
    <div className="about-page">

      {/* Creator card */}
      <div className="about-creator-card">
        <div className="about-crescent">☪</div>
        <div className="about-creator-info">
          <h2 className="about-creator-name">Sabyasachi Rakshit</h2>
          <span className="about-creator-badge">Revert Muslim · Creator</span>
          <p className="about-creator-msg">
            This app is built with the intention of helping Muslims — and myself — stay consistent
            in worship, track good and bad deeds, and motivate ourselves through small rewards.
            May Allah accept it as a Sadaqah Jariyah. 🤲
          </p>
        </div>
      </div>

      {/* How to use */}
      <div className="about-section">
        <h3 className="about-section-title">📖 How to Use This App</h3>
        <p className="about-intro">Everything is simple — here's a quick guide:</p>

        <div className="about-steps">

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(167,139,250,0.12)', color: '#A78BFA', borderColor: 'rgba(167,139,250,0.30)' }}>1</span>
            <div className="about-step-body">
              <strong>Prayers</strong>
              <p>Go to <em>Prayers</em> in the sidebar. Every day you will see all your prayers — Fajr, Dhuhr, Asr, Maghrib, Isha, and Tahajjud. For each prayer, tap <span className="about-tag green">On Time</span> or <span className="about-tag orange">Late</span> to earn reward money, or <span className="about-tag red">Missed</span> to deduct money as a reminder.</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(0,229,160,0.10)', color: '#00E5A0', borderColor: 'rgba(0,229,160,0.25)' }}>2</span>
            <div className="about-step-body">
              <strong>Good Deeds</strong>
              <p>Go to <em>Good Deeds</em>. Tap <span className="about-tag green">Add Deed</span> and enter a name (e.g. "Read Quran"), choose Daily or One-time, set how much money you earn for doing it and how much is deducted if you miss it, then pick a priority. Each day, mark your deeds as <span className="about-tag green">Done</span> or <span className="about-tag red">Missed</span>.</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', borderColor: 'rgba(248,113,113,0.25)' }}>3</span>
            <div className="about-step-body">
              <strong>Bad Deeds</strong>
              <p>Go to <em>Bad Deeds</em>. Add things you want to avoid (e.g. "Wasted time on phone"). Each day mark them as <span className="about-tag green">Avoided</span> to earn money, or <span className="about-tag red">Committed</span> to lose money. This builds self-accountability.</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(251,191,36,0.10)', color: '#FBBF24', borderColor: 'rgba(251,191,36,0.25)' }}>4</span>
            <div className="about-step-body">
              <strong>Rewards</strong>
              <p>Go to <em>Rewards</em>. Your wallet balance builds up as you pray and do good deeds. When you have enough money, redeem a reward like "Favourite Meal" or add your own custom treats. This is your halal motivation system!</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(96,165,250,0.10)', color: '#60A5FA', borderColor: 'rgba(96,165,250,0.25)' }}>5</span>
            <div className="about-step-body">
              <strong>Dashboard</strong>
              <p>The <em>Dashboard</em> shows your daily prayer overview — how many Fardh, Sunnah, and Nafl you completed or missed. Use the <em>Quick Actions</em> cards to jump to any section fast.</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(244,114,182,0.10)', color: '#F472B6', borderColor: 'rgba(244,114,182,0.25)' }}>6</span>
            <div className="about-step-body">
              <strong>Reset & Share</strong>
              <p>Use <span className="about-tag red">Reset Data</span> in the top bar to clear everything and start fresh. Use <span className="about-tag purple">Share</span> to send this app to family and friends — it is Sadaqah Jariyah!</p>
            </div>
          </div>

        </div>
      </div>

      {/* Note */}
      <div className="about-note">
        <span className="about-note-icon">💡</span>
        <p>All your data is saved on <strong>your device only</strong> — nothing is uploaded to any server. Your data resets automatically each day for daily prayers and deeds.</p>
      </div>

      {/* Dua */}
      <div className="about-dua-card">
        <p className="about-dua-arabic">رَبَّنَا تَقَبَّلْ مِنَّا</p>
        <p className="about-dua-trans">Our Lord, accept from us.</p>
        <p className="about-dua-ref">— Surah Al-Baqarah (2:127)</p>
      </div>

    </div>
  )
}
