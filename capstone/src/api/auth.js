export async function signIn({ email, password }) {
  let res;
  try {
    res = await fetch("/api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Can't reach the server. Is it running?");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Sign in failed.");
  return data.user;
}

// Returns the logged-in user, or null. Never throws.
export async function getCurrentUser() {
  try {
    const res = await fetch("/api/me.php");
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function signOut() {
  await fetch("/api/logout.php", { method: "POST" });
}