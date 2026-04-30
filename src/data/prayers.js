export const PRAYER_GROUPS = [
  {
    id: 'tahajjud', name: 'Tahajjud', arabic: 'تهجد', time: 'Late Night · Legendary',
    color: '#FFD700', bg: 'rgba(255,215,0,0.14)', glow: '0 0 18px rgba(255,215,0,0.35)',
    prayers: [
      { id: 'tahajjud_nafl', name: 'Tahajjud', rakaat: 2, type: 'nafl', reward: { onTime: 100, missed:0 } },
    ],
  },
  {
    id: 'fajr', name: 'Fajr', arabic: 'الفجر', time: 'Pre-Dawn',
    color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', glow: '0 0 14px rgba(167,139,250,0.22)',
    prayers: [
      { id: 'fajr_sunnah', name: 'Sunnah', rakaat: 2, type: 'sunnah', reward: { onTime: 10,  late: 5 , missed:15} },
      { id: 'fajr_fardh',  name: 'Fardh',  rakaat: 2, type: 'fardh',  reward: { onTime: 15, late: 5, missed:15 } },
    ],
  },
  {
    id: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر', time: 'Midday',
    color: '#FBBF24', bg: 'rgba(251,191,36,0.12)', glow: '0 0 14px rgba(251,191,36,0.22)',
    prayers: [
      { id: 'dhuhr_sunnah_b', name: 'Sunnah (before)', rakaat: 4, type: 'sunnah', reward: { onTime: 8,  late: 4, missed:8 } },
      { id: 'dhuhr_fardh',    name: 'Fardh',           rakaat: 4, type: 'fardh',  reward: { onTime: 15, late: 7, missed:15 } },
      { id: 'dhuhr_sunnah_a', name: 'Sunnah (after)',  rakaat: 2, type: 'sunnah', reward: { onTime: 8,  late: 4, missed:8 } },
      { id: 'dhuhr_nafl',     name: 'Nafl',            rakaat: 2, type: 'nafl',   reward: { onTime: 5,  late: 2,missed:5 } },
    ],
  },
  {
    id: 'asr', name: 'Asr', arabic: 'العصر', time: 'Afternoon',
    color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', glow: '0 0 14px rgba(96,165,250,0.22)',
    prayers: [
      { id: 'asr_sunnah', name: 'Sunnah', rakaat: 4, type: 'sunnah', reward: { onTime: 8,  late: 4,missed:8 } },
      { id: 'asr_fardh',  name: 'Fardh',  rakaat: 4, type: 'fardh',  reward: { onTime: 15, late: 7,missed:15 } },
    ],
  },
  {
    id: 'maghrib', name: 'Maghrib', arabic: 'المغرب', time: 'Sunset',
    color: '#F97316', bg: 'rgba(249,115,22,0.12)', glow: '0 0 14px rgba(249,115,22,0.22)',
    prayers: [
      { id: 'maghrib_fardh',  name: 'Fardh',  rakaat: 3, type: 'fardh',  reward: { onTime: 15, late: 7, missed: 15 } },
      { id: 'maghrib_sunnah', name: 'Sunnah', rakaat: 2, type: 'sunnah', reward: { onTime: 8,  late: 4, missed: 8 } },
      { id: 'maghrib_nafl',   name: 'Nafl',   rakaat: 2, type: 'nafl',   reward: { onTime: 5,  late: 2, missed:5 } },
    ],
  },
  {
    id: 'isha', name: 'Isha', arabic: 'العشاء', time: 'Night',
    color: '#00E5A0', bg: 'rgba(0,229,160,0.12)', glow: '0 0 14px rgba(0,229,160,0.22)',
    prayers: [
      { id: 'isha_fardh',  name: 'Fardh',  rakaat: 4, type: 'fardh',  reward: { onTime: 15, late: 25 , missed:15} },
      { id: 'isha_sunnah', name: 'Sunnah', rakaat: 2, type: 'sunnah', reward: { onTime: 8,  late: 20, missed:8 } },
      { id: 'isha_nafl',   name: 'Nafl',   rakaat: 2, type: 'nafl',   reward: { onTime: 5,  late: 20,missed:5 } },
      { id: 'witr',        name: 'Witr',   rakaat: 3, type: 'wajib',  reward: { onTime: 10, late: 20,missed:10 } },
    ],
  },
]

export const ALL_PRAYERS = PRAYER_GROUPS.flatMap(g => g.prayers)

export const todayStatusKey = () =>
  `prayerStatus_${new Date().toISOString().split('T')[0]}`

export const todayCompletedKey = () =>
  `completed_${new Date().toISOString().split('T')[0]}`

export const TYPE_META = {
  fardh:  { label: 'Fardh',  color: '#00E5A0' },
  sunnah: { label: 'Sunnah', color: '#A78BFA' },
  nafl:   { label: 'Nafl',   color: '#F472B6' },
  wajib:  { label: 'Wajib',  color: '#FBBF24' },
}
