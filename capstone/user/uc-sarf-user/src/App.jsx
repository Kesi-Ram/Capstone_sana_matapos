import { useEffect, useState } from 'react'
import Header from './components/dahsboard/Header'
import Dashboard from './components/dahsboard/Dashboard'
import SarfForm from './components/sarf/SarfForm'
import RequesterLogin from './components/login/RequesterLogin'
import { getCurrentRequester } from './api/auth'

// Tiny hash router: "#/" = dashboard, "#/sarf" = the form.
const readRoute = () => (window.location.hash.startsWith('#/sarf') ? 'sarf' : 'dashboard')


export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [requester, setRequester] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

    useEffect(() => {
      getCurrentRequester()
        .then((currentRequester) => setRequester(currentRequester))
        .finally(() => setCheckingSession(false))
    }, [])
  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

    if (checkingSession) return <p>Checking login...</p>
    //if (!requester) return <RequesterLogin onLogin={setRequester} />
    
  return (
    <>
      <Header route={route} />
      <main>{route === 'sarf' ? <SarfForm /> : <Dashboard />}</main>
      <footer>UC-AR-FORM-36 · March 29, 2021 · Rev.01 · Online prototype for academic project use</footer>
    </>

  )
}
