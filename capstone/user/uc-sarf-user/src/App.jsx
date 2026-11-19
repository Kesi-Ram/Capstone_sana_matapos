import { useEffect, useState } from 'react'
import Header from './components/dahsboard/Header'
import Dashboard from './components/dahsboard/Dashboard'
import SarfForm from './components/sarf/SarfForm'
import RequesterLogin from './components/login/RequesterLogin'
import RequestView from './components/dahsboard/RequestView'
import { getCurrentRequester } from './api/auth'

// Tiny hash router: "#/" = dashboard, "#/sarf" = the form.
const readRoute = () => {
  const hash = window.location.hash

  if (hash.startsWith('#/sarf')) return 'sarf'
  if (hash.startsWith('#/requests/')) return 'request'

  return 'dashboard'
}


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
    if (!requester) return <RequesterLogin onLogin={setRequester} />
    
  return (
    <>
      <Header route={route} />
      <main>
  {route === 'sarf' ? (
    <SarfForm />
  ) : route === 'request' ? (
    <RequestView
      id={decodeURIComponent(
        (window.location.hash.split('/')[2] || '').split('?')[0]
      )}
      autoPrint={window.location.hash.includes('?print')}
    />
  ) : (
    <Dashboard />
  )}
</main>
      <footer>Online prototype for academic project use only</footer>
    </>

  )
}
