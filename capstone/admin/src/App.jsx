
import React, { useEffect, useState } from 'react'
import SigninPage from './components/SignInPage/signin'
import Dashboard from './components/main/dashboard/dashboard'
import Requests from './components/main/requests/request'
import Sidebar from './components/main/sidebar/sidebar'
import { getCurrentUser, signOut } from './api/auth'
import './App.css'


// Get the previously selected theme
function getSavedTheme() {
  if (localStorage.getItem("adminTheme") === "dark") {
    return "dark"
  } else {
    return "light"
  }
}


function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [activePage, setActivePage] = useState('dashboard')
  const [theme, setTheme] = useState(getSavedTheme)


  // Check whether the admin is already logged in
  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser)
      setChecking(false)
    })
  }, [])


  // Save the selected theme
  useEffect(() => {
    localStorage.setItem("adminTheme", theme)
  }, [theme])


  // Switch between light and dark mode
  function handleToggleTheme() {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }


  // Log out the admin
  async function handleLogout() {
    await signOut()
    setUser(null)
    setActivePage('dashboard')
  }


  // Wait until the login session has been checked
  if (checking) {
    return null
  }


  // Display the sign-in page if there is no user
  if (!user) {
    return <SigninPage onLogin={setUser} />
  }


  // Page names for pages that haven't been built yet
  const pageNames = {
    requests: "Requests",
    schedule: "Schedule",
    facilities: "Facilities"
  }


  // Determine which page to display
  let pageContent

  if (activePage === "dashboard") {
    pageContent = <Dashboard user={user} />

  } else if (activePage === "requests") {
    pageContent = <Requests />

  } else {
    pageContent = (
      <div className="page-placeholder">
        <h1>{pageNames[activePage]}</h1>
        <p>This page hasn't been built yet.</p>
      </div>
    )
  }


  // Display the admin interface
  return (
    <div className="admin-layout" data-theme={theme}>
      <Sidebar
        user={user}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="admin-main">
        {pageContent}
      </main>
    </div>
  )
}

export default App
