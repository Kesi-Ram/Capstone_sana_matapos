import { useEffect, useState } from 'react'
import Facilities from './Facilities'
import { logoutRequester } from '../../api/auth'

const API_URL = '/api'

export default function Dashboard({ onLogout }) {
  const [requests, setRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [requestsError, setRequestsError] = useState('')

  useEffect(() => {
    async function fetchMyRequests() {
      try {
        const response = await fetch(`${API_URL}/my-requests.php`, {
          credentials: 'include',
        })
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Could not load your requests.')
        }

        setRequests(result.requests || [])
      } catch (error) {
        setRequestsError(error.message)
      } finally {
        setRequestsLoading(false)
      }
    }

    fetchMyRequests()
  }, [])

    async function logout() {
    try {
      await logoutRequester()
      onLogout()
    } catch (error) {
      alert(error.message)
    }
  }

  

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">CAMPUS FACILITY MANAGEMENT SYSTEM</div>
          <h1>Student Activity Request Form</h1>
          <p>On-campus activity request portal prototype</p>
        </div>
        <a className="btn" href="#/sarf">Fill Up SARF</a>
      </div>

      <section className="form-section">
        <h2>My SARF Requests</h2>
        <p className="section-sub">Requests submitted in this browser will appear below.</p>

        {requests.length === 0 ? (
          <p className="notice empty">No SARF requests submitted yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Control No.</th>
                  <th>Activity</th>
                  <th>Venue</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.title}</td>
                    <td>{r.venue}</td>
                    <td>{r.date}</td>
                    <td><span className="status-pill">{r.status}</span></td>
                    <td>
                      <a className="btn btn-small" href={`#/requests/${encodeURIComponent(r.id)}`}>View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Facilities />

      <button onClick={logout} className="logout-btn" >Log Out</button>

      <p className="notice">
        Demo only. Requests are saved in local browser storage. Real user accounts, routing, PDF
        generation, signatures and notifications require a backend.
      </p>
    </>
  )
}