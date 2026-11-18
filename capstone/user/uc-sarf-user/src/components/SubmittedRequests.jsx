import { useState } from 'react'
import { loadRequests } from '../utils/storage'

const fmtSubmitted = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
      })
    : '—'

export default function SubmittedRequests() {
  const [requests] = useState(() => [...loadRequests()].reverse())

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">SUBMITTED FORMS</div>
          <h1>Submitted SARF Forms</h1>
          <p>Open a submitted form, or print / save it as PDF.</p>
        </div>
        <a className="btn" href="#/sarf">Fill Up SARF</a>
      </div>

      <section className="form-section">
        <h2>All Submitted Forms</h2>
        <p className="section-sub">
          Click “Print / PDF” and choose “Save as PDF” as the printer in the print dialog.
        </p>

        {requests.length === 0 ? (
          <p className="notice empty">No SARF forms submitted yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Control No.</th>
                  <th>Activity</th>
                  <th>Venue</th>
                  <th>Schedule</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  const id = encodeURIComponent(r.id)
                  return (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.title}</td>
                      <td>{r.venue}</td>
                      <td>{r.date}</td>
                      <td>{fmtSubmitted(r.submittedAt)}</td>
                      <td>
                        <div className="table-actions">
                          <a className="btn secondary small" href={`#/request/${id}`}>View</a>
                          <a className="btn small" href={`#/request/${id}?print`}>Print / PDF</a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}