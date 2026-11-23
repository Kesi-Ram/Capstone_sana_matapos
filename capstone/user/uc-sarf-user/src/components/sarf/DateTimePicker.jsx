import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  DAY_SLOTS,
  SLOT_MINUTES,
  MIN_LEAD_DAYS,
  at,
  dayStatus,
  formatTime,
  isSlotBooked,
  rangeConflicts,
  slotLabel,
  toDateKey,
  toMinutes,
  toValue,
} from '../../utils/schedule'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthStart = (d) => new Date(d.getFullYear(), d.getMonth(), 1)
const longDate = (key) =>
  at(key, 0).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

/**
 * mode="start": choosing a slot sets the start to that slot's start time.
 * mode="end":   choosing a slot sets the end to that slot's end time.
 * value / minValue use 'YYYY-MM-DDTHH:mm'.
 */
export default function DateTimePicker({ label, mode, value, onChange, minValue, bookings }) {
  const titleId = useId()
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => monthStart(new Date()))
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() + MIN_LEAD_DAYS)
  const earliestKey = toDateKey(today)
  const minKey = minValue ? minValue.slice(0, 10) : null
  const locked = mode === 'end' && !minValue

  function openPicker() {
    const seed = (value || minValue || '').slice(0, 10)
    const base = seed ? at(seed, 0) : new Date()
    setMonth(monthStart(base))
    setPicked(seed || null)
    setOpen(true)
  }

  function choose(val) {
    onChange(val)
    setOpen(false)
  }

  // ----- calendar -----
  const y = month.getFullYear()
  const m = month.getMonth()
  const lead = month.getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const canGoBack = month > monthStart(new Date())

  // ----- time slots for the picked day -----

const slots = picked
  ? DAY_SLOTS.map((min) => {
      let disabled = false

      if (mode === 'start') {
        // Disable already booked slots.
        disabled = isSlotBooked(bookings, picked, min)

        // Prevent selecting a time in the past.
        if (!disabled) {
          disabled = at(picked, min) <= now
        }
      }

      if (mode === 'end' && minValue) {
        const from = new Date(minValue)
        const to = at(picked, min + SLOT_MINUTES)

        // End must be later than start.
        if (to <= from) {
          disabled = true
        }

        // Check the entire selected time range.
        if (!disabled) {
          disabled = rangeConflicts(bookings, from, to)
        }
      }

      return {
        min,
        disabled,
        val: toValue(
          picked,
          mode === 'start' ? min : min + SLOT_MINUTES
        ),
      }
    })
  : []


  const display = value
    ? `${longDate(value.slice(0, 10))}, ${formatTime(toMinutes(value.slice(11, 16)))}`
    : null

  return (
    <div className="ln">
      <span>{label} <em>*</em></span>
      <button
        type="button"
        className={`dt-trigger${display ? '' : ' empty'}`}
        onClick={openPicker}
        disabled={locked}
        aria-haspopup="dialog"
      >
        {display || (locked ? 'Select the start first' : 'Select date and time')}
        <span aria-hidden="true">▾</span>
      </button>

      {open && createPortal(
        <div className="dtp-overlay" onMouseDown={() => setOpen(false)}>
          <div
            className="dtp-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="dtp-top">
              <strong id={titleId}>Activity {label}</strong>
              <button type="button" className="dtp-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>

            <div className="dtp-month">
              <button type="button" onClick={() => setMonth(new Date(y, m - 1, 1))} disabled={!canGoBack} aria-label="Previous month">‹</button>
              <h3>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
              <button type="button" onClick={() => setMonth(new Date(y, m + 1, 1))} aria-label="Next month">›</button>
            </div>

            <div className="dtp-grid dtp-weekdays">
              {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
            </div>

            <div className="dtp-grid">
              {cells.map((day, i) => {
                if (day === null) return <span key={`b${i}`} className="dtp-day blank" />
                const key = toDateKey(new Date(y, m, day))
                const isSunday = (lead + day - 1) % 7 === 0
                const status = dayStatus(bookings, key)
                const off = isSunday || key < earliestKey || (minKey && key < minKey) || status === 'full'
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={off}
                    onClick={() => setPicked(key)}
                    aria-pressed={picked === key}
                    aria-label={`${longDate(key)}${status === 'partial' ? ', some slots taken' : ''}`}
                    className={`dtp-day${isSunday ? ' sunday' : ''}${picked === key ? ' selected' : ''}`}
                  >
                    {day}
                    {status !== 'free' && <i className="dtp-dot" />}
                  </button>
                )
              })}
            </div>

            <p className="dtp-legend">
              <i className="dtp-dot" /> Some time slots are already taken. Days without a dot are fully available.
            </p>

            <div className="dtp-slots">
              <h3>Select a Time Slot</h3>
              {picked ? (
                <>
                  <p className="dtp-selected">Selected Date: {longDate(picked)}</p>
                  {mode === 'end' && <p className="dtp-hint">Pick the slot where the activity ends.</p>}
                  <div className="dtp-slotgrid">
                    {slots.map((s) => (
                      <button
                        key={s.min}
                        type="button"
                        disabled={s.disabled}
                        className={`dtp-slot${value === s.val ? ' selected' : ''}`}
                        onClick={() => choose(s.val)}
                      >
                        {slotLabel(s.min)}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="dtp-hint">Choose a date above to see its time slots.</p>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
