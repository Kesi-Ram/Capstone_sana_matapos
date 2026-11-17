// Demo bookings used to show availability in the date picker.
// Replace with data from your backend / the admin Schedules page later.
// Intervals are local time: 'YYYY-MM-DDTHH:mm'.
export const SEED_BOOKINGS = [
  { venue: 'gymnasium', start: '2026-12-01T10:00', end: '2026-12-01T11:00' },
  { venue: 'auditorium', start: '2026-12-01T13:00', end: '2026-12-01T15:30' },
  { venue: 'function-hall-a',      start: '2026-12-02T09:00', end: '2026-12-02T12:00' },
  { venue: 'avr-1',       start: '2026-12-03T14:00', end: '2026-12-03T16:00' },
  { venue: 'covered-court', start: '2026-12-04T08:00', end: '2026-12-04T10:00' },
]

// Same room names as the admin side (rooms.js) so venues match.
export const VENUES = [
  'gymnasium',
  'auditorium',
  'function-hall-a',
  'avr-1',
  'covered-court',
  'theatre',
]
