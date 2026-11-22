const API_URL = '/api'

export async function getRequester() {
  const response = await fetch(`${API_URL}/me-requester.php`, {
    credentials: 'include',
  })

  if (!response.ok) {
    return null
  }

  return await response.json()
}