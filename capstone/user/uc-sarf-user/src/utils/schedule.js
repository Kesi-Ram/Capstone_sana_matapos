
export const SLOT_MINUTES = 30
// Set to 14 to enforce the form's "two weeks prior" rule in the calendar.
export const MIN_LEAD_DAYS = 14

// Bookable 30-minute slots, 8:00AM–5:00PM, skipping the 12:00–1:00PM lunch break.
export const DAY_SLOTS = (() => {
  const out = []
  for (let m = 8 * 60; m < 17 * 60; m += SLOT_MINUTES) {
    if (m >= 12 * 60 && m < 13 * 60) continue
    out.push(m)
  }
  return out
})()

const pad = (n) => String(n).padStart(2, '0')

export const toDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const toValue = (key, minutes) => `${key}T${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
export const toMinutes = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))

// Local Date for a 'YYYY-MM-DD' key plus minutes after midnight.
export function at(key, minutes) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d, 0, minutes)
}

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60)
  return `${h % 12 || 12}:${pad(minutes % 60)}${h >= 12 ? 'PM' : 'AM'}`
}
export const slotLabel = (m) => `${formatTime(m)}-${formatTime(m + SLOT_MINUTES)}`


// With no venue typed yet, every booking is shown.
export function bookingsForVenue(bookings, venue = '') {
  const v = venue.trim().toLowerCase()
  return v ? bookings.filter((b) => b.venue.trim().toLowerCase() === v) : bookings
}

export const isSlotBooked = (bookings, key, minutes) => {
  const s = at(key, minutes)
  const e = at(key, minutes + SLOT_MINUTES)
  return bookings.some((b) => b.start < e && b.end > s)
}

// 'free' = no dot, 'partial' = dot, 'full' = every slot taken
export function dayStatus(bookings, key) {
  const taken = DAY_SLOTS.filter((m) => isSlotBooked(bookings, key, m)).length
  if (taken === 0) return 'free'
  return taken === DAY_SLOTS.length ? 'full' : 'partial'
}

export const rangeConflicts = (bookings, start, end) =>
  bookings.some((b) => b.start < end && b.end > start)
