import { useState } from "react";
import "./requestDetails.css";

function RequestDetails({
  request,
  onBack,
  onApprove,
  onReject,
  saving = false,
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState("");

  function show(value) {
    return value === null || value === undefined || value === ""
      ? "Not provided"
      : value;
  }

  function formatDate(datetime) {
    if (!datetime) return "Not provided";

    const date = new Date(datetime.replace(" ", "T"));

    if (Number.isNaN(date.getTime())) return datetime;

    return date.toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  async function handleApprove() {
    setActionError("");

    if (!onApprove) return;

    const confirmed = window.confirm(
      "Have you verified the signed SARF and request details?"
    );

    if (!confirmed) return;

    try {
      await onApprove(request.id);
    } catch (error) {
      setActionError(error.message);
    }
  }

  async function handleReject(event) {
    event.preventDefault();
    setActionError("");

    if (!rejectReason.trim() || !onReject) return;

    try {
      await onReject(request.id, rejectReason.trim());
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      setActionError(error.message);
    }
  }

  return (
    <div className="request-details">
      <button type="button" className="details-back" onClick={onBack}>
        ← Back to Requests
      </button>

      <header className="details-header">
        <div>
          <h1>{request.name_of_program}</h1>
          <p>Control No. {request.control_number}</p>
        </div>

        <span className={`request-badge ${request.status}`}>
          {request.status}
        </span>
      </header>

      <section className="details-card">
        <h2>Activity Information</h2>

        <div className="details-grid">
          <div>
            <label>Organization / Office / College</label>
            <p>{show(request.organization)}</p>
          </div>

          <div>
            <label>Type of Activity</label>
            <p>{show(request.type_of_activity)}</p>
          </div>

          <div>
            <label>Nature of Activity</label>
            <p>{show(request.nature_of_activity)}</p>
          </div>

          <div>
            <label>Requested Facility</label>
            <p>{show(request.facility)}</p>
          </div>

          <div>
            <label>Start Date &amp; Time</label>
            <p>{formatDate(request.start_datetime)}</p>
          </div>

          <div>
            <label>End Date &amp; Time</label>
            <p>{formatDate(request.end_datetime)}</p>
          </div>

          <div>
            <label>Participants Type</label>
            <p>{show(request.participants_type)}</p>
          </div>

          <div>
            <label>Estimated Participants</label>
            <p>{show(request.est_total_participants)}</p>
          </div>
        </div>
      </section>

      <section className="details-card">
        <h2>Person In Charge</h2>

        <div className="details-grid">
          <div>
            <label>Name</label>
            <p>{show(request.in_charge_name)}</p>
          </div>

          <div>
            <label>Designation</label>
            <p>{show(request.in_charge_designation)}</p>
          </div>

          <div>
            <label>Contact Number</label>
            <p>{show(request.in_charge_contact)}</p>
          </div>

          <div>
            <label>Email Address</label>
            <p>{show(request.in_charge_email)}</p>
          </div>
        </div>
      </section>

      <section className="details-card">
        <h2>Additional Information</h2>

        <div className="details-grid">
          <div>
            <label>Source of Budget</label>
            <p>{show(request.source_of_budget)}</p>
          </div>

          <div>
            <label>Estimated Total Budget</label>
            <p>
              {request.estimated_total_budget == null
                ? "Not provided"
                : `₱${Number(request.estimated_total_budget).toLocaleString("en-PH")}`}
            </p>
          </div>

          {request.status === "rejected" && (
            <div>
              <label>Rejection Reason</label>
              <p>{show(request.reject_reason)}</p>
            </div>
          )}
        </div>
      </section>

      {request.status === "pending" && (
        <div className="details-actions">
          <button
            type="button"
            className="details-reject-btn"
            disabled={saving || !onReject}
            onClick={() => {
              setActionError("");
              setShowRejectModal(true);
            }}
          >
            Reject Request
          </button>

          <button
            type="button"
            className="details-approve-btn"
            disabled={saving || !onApprove}
            onClick={handleApprove}
          >
            {saving ? "Processing..." : "Approve Request"}
          </button>

          {actionError && !showRejectModal && (
            <p role="alert">{actionError}</p>
          )}
        </div>
      )}

      {showRejectModal && (
        <div className="reject-overlay">
          <div
            className="reject-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-modal-title"
          >
            <h2 id="reject-modal-title">Reject Request</h2>

            <p>
              Please provide a reason for rejecting request{" "}
              {request.control_number}.
            </p>

            <form onSubmit={handleReject}>
              <label htmlFor="reject-reason">Rejection Reason</label>

              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
                required
              />

              {actionError && <p role="alert">{actionError}</p>}

              <div className="reject-modal-actions">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="details-reject-btn"
                  disabled={saving || !rejectReason.trim()}
                >
                  {saving ? "Processing..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestDetails;