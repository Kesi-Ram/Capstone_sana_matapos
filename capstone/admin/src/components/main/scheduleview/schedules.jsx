
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import timeGridPlugin from '@fullcalendar/react/timegrid'
import classicThemePlugin from '@fullcalendar/react/themes/classic'

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/classic/theme.css'
import '@fullcalendar/react/themes/classic/palette.css'

import './schedules.css'

export default function Schedules() {

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
          eventClick={function(info) {
             alert(
            "Event: " + info.event.title +
            "\nStart: " + info.event.start.toLocaleString() +
            "\nStatus: " + info.event.extendedProps.status
            );
        }}
        />

      </div>

    </div>
  )
}
