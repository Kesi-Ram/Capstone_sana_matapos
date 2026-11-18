
export async function signIn({ email, password }) {

  let response;

  // Send the login credentials to PHP
  try {
    response = await fetch("/api/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
  } catch (error) {
    throw new Error("Can't reach the server. Is it running?");
  }

  // Read the response sent by PHP
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    // Keep an empty object if PHP did not return valid JSON
  }

  // Check if the login was successful
  if (!response.ok) {
    if (data && data.message) {
      throw new Error(data.message);
    } else {
      throw new Error("Sign in failed.");
    }
  }

  // Make sure PHP returned user information
  if (!data || !data.user) {
    throw new Error("Invalid response from the server.");
  }

  return data.user;
}


// Check if there is an existing login session
export async function getCurrentUser() {

  try {
    const response = await fetch("/api/me.php");

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data && data.user) {
      return data.user;
    } else {
      return null;
    }

  } catch (error) {
    return null;
  }
}


// Log out the admin
export async function signOut() {

  let response;

  try {
    response = await fetch("/api/logout.php", {
      method: "POST"
    });
  } catch (error) {
    throw new Error("Can't reach the server.");
  }

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
}
