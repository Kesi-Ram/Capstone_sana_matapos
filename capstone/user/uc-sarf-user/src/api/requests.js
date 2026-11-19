const API_URL = 'http://localhost/capstone_sana_matapos/capstone/admin/api'

export async function submitSarf(values) {
  const response = await fetch(`${API_URL}/submit-request.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ values }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Could not submit the SARF.')
  }

  return result
}