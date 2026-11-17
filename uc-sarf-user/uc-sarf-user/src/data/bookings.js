// Demo bookings used to show availability in the date picker.
// Replace with data from your backend / the admin Schedules page later.
// Intervals are local time: 'YYYY-MM-DDTHH:mm'.
export const SEED_BOOKINGS = [
  { venue: 'Computer Laboratory 1', start: '2026-12-01T10:00', end: '2026-12-01T11:00' },
  { venue: 'Computer Laboratory 1', start: '2026-12-01T13:00', end: '2026-12-01T15:30' },
  { venue: 'Lecture Room 301',      start: '2026-12-02T09:00', end: '2026-12-02T12:00' },
  { venue: 'Conference Room',       start: '2026-12-03T14:00', end: '2026-12-03T16:00' },
  { venue: 'Computer Laboratory 1', start: '2026-12-04T08:00', end: '2026-12-04T10:00' },
]

// Same room names as the admin side (rooms.js) so venues match.
export const VENUES = [
  'Computer Laboratory 1',
  'Computer Laboratory 2',
  'Discussion Room 2',
  'Lecture Room 201',
  'Lecture Room 301',
  'Conference Room',
]
