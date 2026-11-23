
import { useState } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import timeGridPlugin from '@fullcalendar/react/timegrid'
import classicThemePlugin from '@fullcalendar/react/themes/classic'

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/classic/theme.css'
import '@fullcalendar/react/themes/classic/palette.css'

import './schedules.css'

export default function Schedules() {
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Format the date and time into something readable.
  function formatDateTime(date) {
    if (!date) {
      return 'Not available'
    }

    return date.toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Open the event details when an admin clicks a reservation.
  function handleEventClick(info) {
    const event = info.event

    setSelectedEvent({
      title: event.title,
      facility: event.extendedProps.facility_name,
      start: event.start,
      end: event.end,
      status: event.extendedProps.status,
      controlNumber: event.extendedProps.control_number
    })
  }

  // Close the popup.
  function closeEventDetails() {
    setSelectedEvent(null)
  }

  return (
    <div className="schedules-page">

      <div className="schedules-heading">
        <h1>Facility Schedules</h1>
        <p>View and manage campus facility reservations.</p>
      </div>

      <div className="calendar-container">

        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            classicThemePlugin
          ]}

          initialView="dayGridMonth"
          eventDisplay="block"
          

          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}

          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day'
          }}

          height={730}
          dayMaxEvents={true}
          nowIndicator={true}

          events="/api/calendar-events.php"

          eventClick={handleEventClick}
        />

      </div>

      {/* Event details popup */}
      {selectedEvent && (
        <div
          className="event-modal-overlay"
          onClick={closeEventDetails}
        >
          <div
            className="event-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="event-modal-header">
              <h2 id="event-details-title">Reservation Details</h2>

              <button
                type="button"
                className="event-modal-close"
                onClick={closeEventDetails}
                aria-label="Close reservation details"
              >
                ×
              </button>
            </div>

            <div className="event-modal-body">

              <div className="event-detail">
                <span>Event Title</span>
                <strong>{selectedEvent.title}</strong>
              </div>

              <div className="event-detail">
                <span>Facility / Venue</span>
                <strong>
                  {selectedEvent.facility || 'Unknown facility'}
                </strong>
              </div>

              <div className="event-detail">
                <span>Start Date & Time</span>
                <strong>
                  {formatDateTime(selectedEvent.start)}
                </strong>
              </div>

              <div className="event-detail">
                <span>End Date & Time</span>
                <strong>
                  {formatDateTime(selectedEvent.end)}
                </strong>
              </div>

              <div className="event-detail">
                <span>Status</span>
                <strong>{selectedEvent.status}</strong>
              </div>

              <div className="event-detail">
                <span>CONTROL NO.</span>
                <strong>{selectedEvent.controlNumber}</strong>
              </div>

            </div>

            <div className="event-modal-footer">
              <button
                type="button"
                onClick={closeEventDetails}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
