
const API_URL = '/api'

export async function getFacilityBookings(facilityId) {
  if (!facilityId) {
    return []
  }

  const response = await fetch(
    `${API_URL}/facility-availability.php?facility_id=${encodeURIComponent(facilityId)}`,
    {
      credentials: 'include'
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || 'Could not load facility availability.'
    )
  }

  return result.bookings
}
