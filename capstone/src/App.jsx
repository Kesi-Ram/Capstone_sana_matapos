import React, { useEffect, useState } from 'react'
import Signin from './components/SigninPage/signin'
import MainDash from './components/dashboard/dashboardComponents/mainDash'
import './components/dashboard/dashboardComponents/dashboard.css'
import { getCurrentUser, signOut } from './api/auth'

function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  // On page load, ask the server whether a session already exists.
  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser)
      setChecking(false)
    })
  }, [])

  async function handleLogout() {
    await signOut()
    setUser(null)
  }

  if (checking) return null

  return user ? (
    <MainDash user={user} onLogout={handleLogout} />
  ) : (
    <Signin onLogin={setUser} />
  )
}

export default App