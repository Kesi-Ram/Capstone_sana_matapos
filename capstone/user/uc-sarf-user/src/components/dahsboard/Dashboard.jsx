import { useState } from 'react'
import { loadRequests } from '../../utils/storage'
import Facilities from './Facilities'

export default function Dashboard() {
  const [requests] = useState(loadRequests)

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
                  <th>Current Step</th>
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
                    <td>{r.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Facilities />

      <p className="notice">
        Demo only. Requests are saved in local browser storage. Real user accounts, routing, PDF
        generation, signatures and notifications require a backend.
      </p>
    </>
  )
}