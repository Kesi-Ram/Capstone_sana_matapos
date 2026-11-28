import { useEffect, useRef, useState } from "react";
import {
  BMO, LMO, ITSS, ADMIN, CHARGES, INSURANCE_COLUMNS, INSURANCE_ROWS,
} from '../../data/sarfOptions'

const API_URL = "/api";

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
      <span className="detail-value">{empty ? '' : children}</span>
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
function hasSupport(selected, otherRequirements) {
  const hasSelectedItems =
    Array.isArray(selected) && selected.length > 0;

  const hasOtherRequirements =
    typeof otherRequirements === "string" &&
    otherRequirements.trim() !== "";

  return hasSelectedItems || hasOtherRequirements;
}

function SupportView({
  title,
  venue,
  listLabel,
  items,
  d,
  prefix,
  extra
}) {
  return (
    <div className="box card">
      <div className="card-head">
        {title}

        {venue !== undefined && (
          <span>Venue: {venue || "—"}</span>
        )}
      </div>

      <div className="card-body">
        <div>
          <span className="lb">{listLabel}</span>
          <List items={items} />
          {extra}
        </div>

        <div>
          <Row label="Other requirements">
            {d[`${prefix}OtherRequirements`]}
          </Row>

          <Row label="Remarks">
            {d[`${prefix}Remarks`]}
          </Row>
        </div>
      </div>
    </div>
  );
}


function formatRequestId(id) {
  return `REQ-${String(id).padStart(6, '0')}`
}

// ---------- page ----------
export default function RequestView({ id }) {
const [request, setRequest] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [cancelling, setCancelling] = useState(false);
const [cancelError, setCancelError] = useState("");

useEffect(() => {
  async function fetchRequest() {
    try {
      const response = await fetch(`${API_URL}/my-requests.php`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not load this request.");
      }

      const foundRequest = (result.requests || []).find(
        (item) => String(item.id) === String(id)
      );

      if (!foundRequest) {
        throw new Error("Request not found.");
      }

      const formData =
        typeof foundRequest.form_data === "string"
          ? JSON.parse(foundRequest.form_data || "{}")
          : foundRequest.form_data || {};

      setRequest({ ...foundRequest, data: formData });
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  fetchRequest();
}, [id]);



if (error || !request) {
  return (
    <section className="form-section">
      <h2>Could not open request</h2>
      <p className="section-sub">{error || "Request not found."}</p>
      <a className="btn" href="#/">Back to Dashboard</a>
    </section>
  );
}

  const d = request.data || {}


async function cancelRequest() {
  // Only pending requests can be cancelled.
  if (!request || request.status !== "pending" || cancelling) {
    return;
  }

  // Ask the requester to confirm cancellation.
  const confirmed = window.confirm(
    "Are you sure you want to cancel this reservation? Your selected time slots will become available again."
  );

  if (!confirmed) {
    return;
  }

  setCancelling(true);
  setCancelError("");

  try {
    const response = await fetch(`${API_URL}/cancel-request.php`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requestId: request.id
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not cancel the request.");
    }

    // Update the request status displayed on the page.
    setRequest({
      ...request,
      status: "cancelled"
    });

  } catch (error) {
    setCancelError(error.message);
  } finally {
    setCancelling(false);
  }
}


  return (
    <>
      <div className="page-heading no-print">
        <div>
          <div className="eyebrow">SARF PREVIEW</div>
          <h1>Request ID: {formatRequestId(request.id)}</h1>
          <p>
            <span className="status-pill">{request.status}</span>
          </p>
        </div>
        
<div className="table-actions">

  <a className="btn secondary" href="#/">
    ← My Requests
  </a>

  {request.status === "pending" && (
    <button
      className="btn secondary"
      type="button"
      onClick={cancelRequest}
      disabled={cancelling}
    >
      {cancelling ? "Cancelling..." : "Cancel Request"}
    </button>
  )}
</div>

      </div>


<div className="detail-sheet">

<div className="sarf-identifiers">
  <div>
    <strong>Request ID: </strong>
    {formatRequestId(request.id)}
  </div>

  <div className="sarf-control">
    <strong>SARF Control No. :</strong>

    {request.control_number ? (
      <span>{request.control_number}</span>
    ) : (
      <span className="control-line"></span>
    )}
  </div>
</div>

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
        
{(
  hasSupport(d.bmo, d.bmoOtherRequirements) ||
  hasSupport(d.lmo, d.lmoOtherRequirements) ||
  hasSupport(d.itss, d.itssOtherRequirements) ||
  hasSupport(d.admin, d.adminOtherRequirements) ||
  hasSupport(d.charges, d.fmoOtherRequirements) ||
  Boolean(d.fmoRemarks?.trim())
) && (
  <>
    <h2>Additional Support Requirements</h2>

    <div className="cols">

      {hasSupport(d.bmo, d.bmoOtherRequirements) && (
        <SupportView
          title="For BMO Support"
          venue={d.bmoVenue}
          listLabel="Technical Requirements:"
          items={describe(BMO, d.bmo || [], d)}
          d={d}
          prefix="bmo"
        />
      )}

      {hasSupport(d.lmo, d.lmoOtherRequirements) && (
        <SupportView
          title="For LMO Support"
          listLabel="Property Requirements:"
          items={describe(LMO, d.lmo || [], d)}
          d={d}
          prefix="lmo"
        />
      )}

      {hasSupport(d.itss, d.itssOtherRequirements) && (
        <SupportView
          title="For ITSS Support"
          listLabel="Support Requirements:"
          items={describe(ITSS, d.itss || [], d)}
          d={d}
          prefix="itss"
        />
      )}

      {hasSupport(d.admin, d.adminOtherRequirements) && (
        <SupportView
          title="For Administrative Support"
          listLabel="Support Requirements:"
          items={describe(ADMIN, d.admin || [], d)}
          d={d}
          prefix="admin"
          extra={
            <Row label="Green board posting text">
              {d.greenBoardText}
            </Row>
          }
        />
      )}

    </div>

    {(
      hasSupport(d.charges, d.fmoOtherRequirements) ||
      Boolean(d.fmoRemarks?.trim())
    ) && (
      <div className="box card">
        <div className="card-head">
          For FMO Use
        </div>

        <div className="card-body">
          <div>
            <span className="lb">
              Applicable Charges
            </span>

            <List
              items={describe(CHARGES, d.charges || [], d)}
            />

            <Row label="Total">
              {d.chargeTotal}
            </Row>
          </div>

          <div>
            <Row label="Other Requirements">
              {d.fmoOtherRequirements}
            </Row>

            <Row label="Remarks">
              {d.fmoRemarks}
            </Row>
          </div>
        </div>
      </div>
    )}

  </>
)}

      </div>
    </>
  )
}