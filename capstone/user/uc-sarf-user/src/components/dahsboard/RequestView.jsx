import { useEffect, useRef } from 'react'
import { loadRequests } from '../../utils/storage'
import {
  BMO, LMO, ITSS, ADMIN, CHARGES, INSURANCE_COLUMNS, INSURANCE_ROWS,
} from '../../data/sarfOptions'

// ---------- helpers ----------
const fmtDateTime = (v) =>
  v
    ? new Date(v).toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
      })
    : ''

const fmtDate = (v) =>
  v
    ? new Date(`${v}T00:00`).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : ''

// Turns the ticked options into readable lines, e.g. "5 pcs of chairs", "others: banner".
function describe(options, selected = [], d = {}) {
  return options
    .filter((o) => selected.includes(typeof o === 'string' ? o : o.value))
    .map((o) => {
      if (typeof o === 'string') return o
      return [o.before, o.qty ? d[o.qty] : '', o.label, o.text ? d[o.text] : '']
        .filter(Boolean)
        .join(' ')
    })
}

function Row({ label, children }) {
  const empty = children === '' || children == null
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{empty ? '—' : children}</span>
    </div>
  )
}

function List({ items }) {
  if (!items.length) return <span className="detail-value">—</span>
  return (
    <ul className="detail-list">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  )
}

function Sign({ label, title, name, date }) {
  return (
    <div className="detail-sign">
      <span className="sign-label">{label}</span>
      <div className="detail-sign-name">{name || '—'}</div>
      <div className="sign-line" />
      <div className="sign-title">{title}</div>
      <div className="detail-sign-date">Date: {fmtDate(date) || '—'}</div>
    </div>
  )
}

function SupportView({ title, venue, listLabel, items, d, prefix, approver, extra }) {
  return (
    <div className="box card">
      <div className="card-head">
        {title}
        {venue !== undefined && <span>Venue: {venue || '—'}</span>}
      </div>
      <div className="card-body">
        <div>
          <span className="lb">{listLabel}</span>
          <List items={items} />
          {extra}
        </div>
        <div>
          <Row label="Other requirements">{d[`${prefix}OtherRequirements`]}</Row>
          <Row label="Remarks">{d[`${prefix}Remarks`]}</Row>
        </div>
      </div>
      <Sign
        label="Noted and Approved:"
        title={approver}
        name={d[`${prefix}ApprovedBy`]}
        date={d[`${prefix}Date`]}
      />
    </div>
  )
}

// ---------- page ----------
export default function RequestView({ id, autoPrint }) {
  const request = loadRequests().find((r) => r.id === id)
  const printed = useRef(false)

  // Opened from "Print / PDF": open the print dialog once the page has rendered.
  useEffect(() => {
    if (!autoPrint || !request || printed.current) return
    printed.current = true
    const t = setTimeout(() => {
      window.print()
      // drop "?print" so a refresh doesn't print again
      window.history.replaceState(null, '', `#/request/${encodeURIComponent(id)}`)
    }, 400)
    return () => clearTimeout(t)
  }, [autoPrint, request, id])

  if (!request) {
    return (
      <section className="form-section">
        <h2>Request not found</h2>
        <p className="section-sub">
          No SARF with Control No. {id} exists in this browser.
        </p>
        <a className="btn" href="#/">Back to Dashboard</a>
      </section>
    )
  }

  const d = request.data || {}

  return (
    <>
      <div className="page-heading no-print">
        <div>
          <div className="eyebrow">SARF PREVIEW</div>
          <h1>{request.id}</h1>
          <p>
            <span className="status-pill">{request.status}</span> · Current step: {request.stage}
          </p>
        </div>
        <div className="table-actions">
          <a className="btn secondary" href="#/">← My Requests</a>
          <a className="btn secondary" href="#/submitted">Submitted Forms</a>
          <button className="btn" type="button" onClick={() => window.print()}>
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="print-only print-title">
        <strong>UNIVERSITY OF THE CORDILLERAS</strong>
        <div>Student Activity Request Form for On-Campus · UC-AR-FORM-36 · Rev.01</div>
        <div>Control No.: {request.id}</div>
      </div>

      <div className="detail-sheet">
        {/* ================= PAGE 1 ================= */}
        <div className="box sheet-head">
          <strong>VICE PRESIDENT FOR ACADEMICS AND RESEARCH</strong>
          <span>College: <strong>{d.college || '—'}</strong></span>
        </div>

        <div className="cols">
          <div className="col">
            <div className="box">
              <div className="box-title">Activity Details</div>
              <Row label="Type of Activity">{d.activityType}</Row>
              <Row label="Organization / Office / College">{d.organization}</Row>
              <Row label="Title of Activity Program">{d.title}</Row>
              <Row label="Nature of Activity">{d.nature}</Row>
              <Row label="Start">{fmtDateTime(d.start)}</Row>
              <Row label="End">{fmtDateTime(d.end)}</Row>
              <Row label="Venue / Location">{d.venue}</Row>
            </div>

            <div className="box">
              <div className="box-title">Participants & Budget</div>
              <div className="detail-row">
                <span className="detail-label">Participants</span>
                <List items={describe(
                  ['members/office staff only', 'with other UC students/employees', 'open to Public/Outsiders'],
                  d.participants,
                )} />
              </div>
              <Row label="Estimated Total No. of Participants">{d.participantsTotal}</Row>
              <Row label="Source of Budget">{d.budgetSource}</Row>
              <Row label="Estimated Total Budget">
                {d.budget ? `PhP ${Number(d.budget).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : ''}
              </Row>
            </div>

            <div className="box">
              <div className="box-title">In-Charge of Activity</div>
              <Row label="Name">{d.personName}</Row>
              <Row label="Designation">{d.personDesignation}</Row>
              <Row label="Contact">{d.personContact}</Row>
              <Row label="Email">{d.personEmail}</Row>
            </div>

            <div className="box">
              <div className="box-title">
                Liability Waiver<small>(Accomplished by the Adviser/Coordinator)</small>
              </div>
              <Sign label="Signature:" title="ADVISER/COORDINATOR" name={d.adviserName} date={d.adviserDate} />
            </div>
          </div>

          <div className="col">
            <div className="box">
              <Row label="Remarks / Conditions">{d.remarks}</Row>
            </div>

            <div className="box">
              <span className="lb">Checklist (For Review Use Only)</span>
              <List items={d.checklist || []} />
            </div>

            <div className="box">
              <div className="box-title">Signatures</div>
              <Sign label="Submitted by:" title="President/Organizer" name={d.presidentName} date={d.presidentDate} />
              <Sign label="Noted by:" title="Adviser/Coordinator" name={d.adviserNotedName} date={d.adviserNotedDate} />
              <Sign label="Recommending Approval:" title="Academic Dean/Prog. Chair" name={d.deanName} date={d.deanDate} />
              <Sign label="Approved by:" title="VP for Academics and Research" name={d.vpAcadName} date={d.vpAcadDate} />
              <Sign label="Venue Reserved:" title="Campus Facilities, Planning & Dev’t Officer" name={d.venueReservedName} date={d.venueReservedDate} />
            </div>
          </div>
        </div>

        <div className="box">
          <div className="box-title">Amount of insurance per insured individual (PhP)</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>{INSURANCE_COLUMNS.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {INSURANCE_ROWS.map(([who, ...amounts]) => (
                  <tr key={who}>
                    <th>{who}</th>
                    {amounts.map((a, i) => <td key={i}>{a}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= PAGE 2 ================= */}
        <div className="page-break" />
        <p className="section-sub">Page 2 – Support Requirements</p>

        <div className="cols">
          <SupportView
            title="For BMO Support" venue={d.bmoVenue} listLabel="Technical Requirements:"
            items={describe(BMO, d.bmo, d)} d={d} prefix="bmo" approver="Personnel In-Charge"
          />
          <SupportView
            title="For LMO Support" listLabel="Property Requirements:"
            items={describe(LMO, d.lmo, d)} d={d} prefix="lmo" approver="Head, LMO"
          />
          <SupportView
            title="For ITSS Support" listLabel="Support Requirements:"
            items={describe(ITSS, d.itss, d)} d={d} prefix="itss" approver="Director"
          />
          <SupportView
            title="For ADMINISTRATIVE Support" listLabel="Support Requirements:"
            items={describe(ADMIN, d.admin, d)} d={d} prefix="admin"
            approver="VP for Admin. and Acad. Services"
            extra={<Row label="Green board posting text">{d.greenBoardText}</Row>}
          />
        </div>

        <div className="box card">
          <div className="card-head">For FMO Use:</div>
          <div className="fmo">
            <div>
              <span className="lb">Applicable Charges</span>
              <List items={describe(CHARGES, d.charges, d)} />
              <Row label="TOTAL">{d.chargeTotal}</Row>
            </div>
            <div>
              <Row label="Other requirements">{d.fmoOtherRequirements}</Row>
              <Row label="Remarks">{d.fmoRemarks}</Row>
            </div>
            <div>
              <Sign label="Service Agreement – Signature:" title="In-charge of Activity"
                name={d.fmoInChargeName} date={d.fmoInChargeDate} />
            </div>
          </div>
          <Sign label="Approved and Reserved:" title="Campus Facilities, Planning & Dev’t Officer"
            name={d.fmoApprovedandReserved} date={d.fmoApprovalDate} />
        </div>
      </div>
    </>
  )
}