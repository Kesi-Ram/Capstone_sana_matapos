import { useEffect, useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import SarfForm from './components/sarf/SarfForm'

// Tiny hash router: "#/" = dashboard, "#/sarf" = the form.
const readRoute = () => (window.location.hash.startsWith('#/sarf') ? 'sarf' : 'dashboard')

export default function App() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return (
    <>
      <Header route={route} />
      <main>{route === 'sarf' ? <SarfForm /> : <Dashboard />}</main>
      <footer>UC-AR-FORM-36 · March 29, 2021 · Rev.01 · Online prototype for academic project use</footer>
    </>
  )
}
