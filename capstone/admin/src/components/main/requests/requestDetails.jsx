
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

  // Store the SARF Control Number entered by FMO
  const [controlNumber, setControlNumber] = useState(
    request.control_number || ""
  );

  function show(value) {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }

    return value;
  }

  function formatDate(datetime) {
    if (!datetime) {
      return "Not provided";
    }

    const date = new Date(datetime.replace(" ", "T"));

    if (Number.isNaN(date.getTime())) {
      return datetime;
    }

    return date.toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function formatRequestId(id) {
    return `REQ-${String(id).padStart(6, "0")}`;
  }

  // Update the input while the admin types
  function handleControlNumberChange(event) {
    setControlNumber(event.target.value);
    setActionError("");
  }

  // Approve the SARF request
  async function handleApprove() {
    setActionError("");

    if (!onApprove || saving) {
      return;
    }

    // Get the entered number and remove extra spaces
    const enteredNumber = controlNumber.trim();

    // Require a control number before approving
    if (enteredNumber === "") {
      setActionError(
        "Please enter the SARF Control Number before approving."
      );
      return;
    }

    if (enteredNumber.length > 100) {
      setActionError(
        "SARF Control Number must not exceed 100 characters."
      );
      return;
    }

    const confirmed = window.confirm(
      "Have you verified the signed SARF and the official SARF Control Number?"
    );

    if (!confirmed) {
      return;
    }

    try {
      // Send BOTH the request ID and entered control number
      console.log("Sending SARF Control Number:", enteredNumber);

      await onApprove(request.id, enteredNumber);

    } catch (error) {
      setActionError(error.message);
    }
  }

  // Reject the request without requiring a control number
  async function handleReject(event) {
    event.preventDefault();
    setActionError("");

    if (!onReject || saving) {
      return;
    }

    if (rejectReason.trim() === "") {
      setActionError("Please provide a rejection reason.");
      return;
    }

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

      <button
        type="button"
        className="details-back"
        onClick={onBack}
      >
        ← Back to Requests
      </button>

      <header className="details-header">
        <div>
          <h1>{request.name_of_program}</h1>

          <h2>{formatRequestId(request.id)}</h2>

          <p>
            SARF Control No.:{" "}
            {request.control_number || "Not yet assigned"}
          </p>
        </div>

        <span className={`request-badge ${request.status}`}>
          {request.status}
        </span>
      </header>

      {/* ACTIVITY INFORMATION */}
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

      {/* PERSON IN CHARGE */}
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

      {/* ADDITIONAL INFORMATION */}
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
                : `₱${Number(
                    request.estimated_total_budget
                  ).toLocaleString("en-PH")}`}
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

      {/* FMO PROCESSING - PENDING REQUESTS ONLY */}
      {request.status === "pending" && (
        <>
          <section className="details-card">
            <h2>FMO Processing</h2>

            <div className="control-number-field">
              <label htmlFor="sarf-control-number">
                SARF Control Number
                <span className="required-mark"> *</span>
              </label>

              <input
                id="sarf-control-number"
                type="text"
                name="controlNumber"
                value={controlNumber}
                onChange={handleControlNumberChange}
                placeholder="Enter SARF Control No."
                maxLength={100}
                disabled={saving}
              />

              <small>
                Required for approval only. Enter the number
                written on the signed SARF.
              </small>
            </div>
          </section>

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
        </>
      )}

      {/* REJECTION MODAL */}
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
              {formatRequestId(request.id)}.
            </p>

            <form onSubmit={handleReject}>
              <label htmlFor="reject-reason">
                Rejection Reason
              </label>

              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(event) =>
                  setRejectReason(event.target.value)
                }
                placeholder="Enter the reason for rejection..."
                rows={4}
                required
              />

              {actionError && (
                <p role="alert">{actionError}</p>
              )}

              <div className="reject-modal-actions">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setShowRejectModal(false);
                    setActionError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="details-reject-btn"
                  disabled={saving || !rejectReason.trim()}
                >
                  {saving
                    ? "Processing..."
                    : "Confirm Rejection"}
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
