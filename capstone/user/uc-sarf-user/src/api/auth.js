const API_URL = 'http://localhost/capstone_sana_matapos/capstone/admin/api'



export async function loginRequester(email, password) {
  const response = await fetch(`${API_URL}/login-requester.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Login failed')
  }

  return result
}

export async function getCurrentRequester() {
  const response = await fetch(`${API_URL}/me-requester.php`, {
    credentials: 'include',
  })

  if (!response.ok) return null

  return await response.json()
}
export async function registerRequester(name, email, password) {
  const response = await fetch(`${API_URL}/register-requester.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Registration failed')
  }

  return result
}

// Log out the admin
export async function logoutRequester() {

  let response;

  try {
    response = await fetch(`${API_URL}/logout-requester.php`, {
      method: "POST"
    });
  } catch (error) {
    throw new Error("Can't reach the server.");
  }

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
}