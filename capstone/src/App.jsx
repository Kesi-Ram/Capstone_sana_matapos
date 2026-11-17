
import React, { useEffect, useState } from 'react'
import Signin from './components/SigninPage/signin'
import Dashboard from './components/main/dashboard/dashboard'
import Sidebar from './components/main/sidebar/sidebar'
import { getCurrentUser, signOut } from './api/auth'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [activePage, setActivePage] = useState('dashboard')

  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser)
      setChecking(false)
    })
  }, [])

  async function handleLogout() {
    await signOut()
    setUser(null)
    setActivePage('dashboard')
  }

  if (checking) return null

  if (!user) {
    return <Signin onLogin={setUser} />
  }

  const pageNames = {
    requests: "Requests",
    schedule: "Schedule",
    facilities: "Facilities"
  }

  return (
    <div className="admin-layout">
      <Sidebar
        user={user}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
      />

      <main className="admin-main">
        {activePage === 'dashboard' ? (
          <Dashboard user={user} />
        ) : (
          <div className="page-placeholder">
            <h1>{pageNames[activePage]}</h1>
            <p>This page hasn't been built yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
