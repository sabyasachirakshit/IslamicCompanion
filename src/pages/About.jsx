import profileImg from '../assets/image.png'

export default function About() {
  return (
    <div className="about-page">

      {/* Creator card */}
      <div className="about-creator-card">
        <img src={profileImg} alt="Sabyasachi Rakshit" className="about-profile-img" />
        <div className="about-creator-info">
          <h2 className="about-creator-name">Sabyasachi Rakshit 🇮🇳</h2>
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
              <p>The <em>Dashboard</em> shows your <span className="about-tag green">Daily Prayer</span> overview — how many Fardh, Sunnah, and Nafl you completed or missed. It also shows a <span className="about-tag green">Today's Deeds Overview</span> — how many good deeds you did or missed, how many bad deeds you avoided or committed, and your one-time deed counts. Use the <em>Quick Actions</em> cards to jump to any section fast.</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(251,146,60,0.10)', color: '#FB923C', borderColor: 'rgba(251,146,60,0.25)' }}>6</span>
            <div className="about-step-body">
              <strong>Diary</strong>
              <p>Go to <em>Diary</em> and tap <span className="about-tag orange">New Note</span> to write a personal journal entry — give it a title and write freely. Use the <span className="about-tag purple">Daily Schedule</span> template to instantly fill your note with hourly time slots (00:00 → 23:00) for planning your day. Open any note to read it in full — the note viewer has a built-in <span className="about-tag blue">Search</span> bar that highlights matching words in yellow. You can also search notes from the main search bar by title, content, or date (e.g. <em>May 1, 2026</em>).</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(167,139,250,0.10)', color: '#A78BFA', borderColor: 'rgba(167,139,250,0.25)' }}>7</span>
            <div className="about-step-body">
              <strong>Dhikr</strong>
              <p>Go to <em>Dhikr</em> in the sidebar. You will see pre-loaded remembrances — SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (34), Astaghfirullah (100), and more. Tap <span className="about-tag purple">+ Dhikr</span> on any card to increment your count. A glowing progress bar fills up as you go, and a <span className="about-tag green">MashaAllah!</span> flash appears when you complete a target. Use <span className="about-tag purple">Add Dhikr</span> to create your own — type the name, click <span className="about-tag purple">🌐</span> to auto-translate to Arabic, then click <span className="about-tag purple">💡</span> to generate its meaning. Set it as <span className="about-tag purple">Daily</span> (resets every midnight) or <span className="about-tag orange">One-time</span> (progress saved permanently).</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(52,211,153,0.10)', color: '#34D399', borderColor: 'rgba(52,211,153,0.25)' }}>8</span>
            <div className="about-step-body">
              <strong>Exercise</strong>
              <p>Go to <em>Exercise</em> under <em>Additional</em> in the sidebar. First choose your mode — <span className="about-tag green">🧘 Remaining Fit</span> (250 kcal daily goal, lighter reps) or <span className="about-tag green">💪 Building Muscles</span> (500 kcal daily goal, heavier reps). Each exercise card shows a ring progress indicator. Tap the <span className="about-tag green">+</span> button to log reps — a kcal burst floats up with every tap. The hero bar at the top fills as you burn calories. Completing all goals in a day adds to your streak counter 🔥.</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(249,115,22,0.10)', color: '#F97316', borderColor: 'rgba(249,115,22,0.25)' }}>9</span>
            <div className="about-step-body">
              <strong>Urges</strong>
              <p>Go to <em>Urges</em> under <em>Additional</em>. When you feel tempted, hit the big <span className="about-tag red">💥 Crush the Urge</span> button — it logs the urge, fires a particle burst animation, and shows a motivating Islamic quote. You can also tap <span className="about-tag orange">Fight the Nafs</span> as many times as you want for a satisfying spam-able animation without affecting your count. Your urge-crush count, streaks, and a full battle log are tracked so you can see your progress over time.</p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-num" style={{ background: 'rgba(244,114,182,0.10)', color: '#F472B6', borderColor: 'rgba(244,114,182,0.25)' }}>10</span>
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
