import { useEffect, useState } from 'react'

function FacilityIcon({ type }) {
  const icons = {
    gymnasium: <><circle cx="12" cy="12" r="9" /><path d="M12 3v9l7.8 4.5M12 12l-7.8 4.5M6 5.3l6 3.5 6-3.5M3 12h4l5 8 5-8h4" /></>,
    auditorium: <><path d="M3 10h10v5a5 5 0 0 1-10 0zM11 4h10v5a5 5 0 0 1-5 5M6 13h.01M10 13h.01M6 16q2 2 4 0M14 7h.01M18 7h.01M15 10h3" /></>,
    'function-hall-a': <><path d="M4 21h16M6 21V3h10v18M16 7h3v14M12 12h.01" /></>,
    'avr-1': <><rect x="3" y="5" width="13" height="14" rx="1" /><path d="m16 10 5-4v12l-5-4" /></>,
    'covered-court': <><path d="m3 8 9-5 9 5v13H3zM3 10h18M12 3v7M7 21v-5h10v5M7 13h10" /></>,
  }

  return (
    <svg className="facility-icon" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" focusable="false">
      {icons[type] ?? icons.auditorium}
    </svg>
  )
}

function formatTime(value) {
  const [hours, minutes] = value.split(':')
  const hour = Number(hours)
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
}

// Change this URL to match where facilities.php is saved under htdocs.
const FACILITIES_API_URL ='http://localhost/capstone_sana_matapos/capstone/admin/api'

function getIconType(name) {
  // For example, "Function Hall A" becomes "function-hall-a".
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function Facilities() {
  const [facilities, setFacilities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadFacilities() {
      try {
        const response = await fetch(FACILITIES_API_URL)

        if (!response.ok) {
          throw new Error('The server could not load the facilities.')
        }

        const data = await response.json()
        setFacilities(data)
      } catch (error) {
        setErrorMessage('Could not load facilities. Check the PHP server and try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadFacilities()
  }, [])

  return (
    <section className="form-section facilities-section" aria-labelledby="facilities-heading">
      <h2 id="facilities-heading">Facilities</h2>
      <p className="section-sub">
        Browse campus halls, athletic facilities, and audiovisual spaces.
      </p>

      {isLoading && <p>Loading facilities...</p>}

      {!isLoading && errorMessage && (
        <p className="notice" role="alert">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && facilities.length === 0 && (
        <p className="notice">There are no active facilities to show.</p>
      )}

      {!isLoading && !errorMessage && facilities.length > 0 && (
        <div
          className="table-wrap facilities-table-wrap"
          role="region"
          aria-label="Facility capacities and operating hours"
          tabIndex={0}
        >
          <table className="facilities-table" aria-labelledby="facilities-heading">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Capacity</th>
                <th scope="col">Opens</th>
                <th scope="col">Closes</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr key={facility.id}>
                  <th scope="row">
                    <span className="facility-name">
                      <FacilityIcon type={getIconType(facility.name)} />
                      {facility.name}
                    </span>
                  </th>
                  <td>{facility.capacity.toLocaleString('en-US')}</td>
                  <td><time>{formatTime(facility.opens)}</time></td>
                  <td><time>{formatTime(facility.closes)}</time></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}