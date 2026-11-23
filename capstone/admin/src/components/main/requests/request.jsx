import { useEffect, useState } from "react";
import "./request.css";
import RequestDetails from "./requestDetails";


function Requests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [saving, setSaving] = useState(false);

  // Retrieve reservation requests from the PHP API
  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch("/api/requests.php");

        if (!response.ok) {
          throw new Error("Failed to load requests.");
        }

        const data = await response.json();
        setRequests(data.requests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  // Count requests according to status
  const countByStatus = (status) => {
    if (status === "all") {
      return requests.length;
    }

    return requests.filter((request) => request.status === status).length;
  };

  // Filter requests by status and search text
  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      activeTab === "all" || request.status === activeTab;

    const searchText = [
    request.id,
    `REQ-${String(request.id).padStart(6, "0")}`,
    request.control_number,
    request.organization,
    request.name_of_program,
    request.nature_of_activity,
    request.facility,
  ] 
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  function formatDate(datetime) {
    if (!datetime) return "—";

    const date = new Date(datetime.replace(" ", "T"));

    if (Number.isNaN(date.getTime())) return datetime;

    return date.toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }


async function updateRequestStatus(id, newStatus, reason = "", controlNumber = "") {
  console.log("Requests.jsx received:", {
  id,
  newStatus,
  reason,
  controlNumber
});
  setSaving(true);

  try {
    const response = await fetch("/api/update_request_status.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        id: id,
        status: newStatus,
        reason: reason,
        controlNumber: controlNumber
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not update the request.");
    }

    const updatedFields = {
      status: newStatus
    };

    if (newStatus === "approved") {
      updatedFields.control_number = controlNumber;
      updatedFields.reject_reason = null;
    }

    if (newStatus === "rejected") {
      updatedFields.reject_reason = reason;
    }

    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        String(item.id) === String(id)
          ? { ...item, ...updatedFields }
          : item
      )
    );

    setSelectedRequest((currentRequest) =>
      currentRequest && String(currentRequest.id) === String(id)
        ? { ...currentRequest, ...updatedFields }
        : currentRequest
    );

    return result;

  } finally {
    setSaving(false);
  }
}

  if (selectedRequest) {
    return (
      <RequestDetails
  request={selectedRequest}
  onBack={() => setSelectedRequest(null)}
  onStatusUpdated={(newStatus) => {
    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item.id === selectedRequest.id
          ? { ...item, status: newStatus }
          : item
      )
    );

    setSelectedRequest((currentRequest) =>
      currentRequest
        ? { ...currentRequest, status: newStatus }
        : currentRequest
    );
  }}

onApprove={(id, controlNumber) => {
  console.log("Approval callback received:", controlNumber);

  return updateRequestStatus(
    id,
    "approved",
    "",
    controlNumber
  );
}}
  onReject={(id, reason) =>
  updateRequestStatus(id, "rejected", reason)
}
saving={saving}
/>
    );
  } 

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p>{error}</p>;

function formatReference(request) {
  if (request.status === "approved" && request.control_number) {
    return request.control_number
  }

  return `REQ-${String(request.id).padStart(6, "0")}`
}

  return (
    <div className="requests-page">
      <div className="requests-header">
        <div>
          <h1>Requests</h1>
          <p>Review and manage facility reservation requests.</p>
        </div>
      </div>

      <div className="requests-toolbar">
        <div className="requests-tabs">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              type="button"
              key={status}
              className={`requests-tab ${
                activeTab === status ? "active" : ""
              }`}
              onClick={() => setActiveTab(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="tab-count">{countByStatus(status)}</span>
            </button>
          ))}
        </div>

        <input
          type="search"
          className="requests-search"
          placeholder="Search requests..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="requests-table-container">
        <table className="requests-list-table">
          <thead>
            <tr>
              <th>Reference ID</th>
              <th>Organization</th>
              <th>Activity</th>
              <th>Facility</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>{formatReference(request)}</td>
                <td>{request.organization}</td>
                <td>{request.name_of_program}</td>
                <td>{request.facility}</td>
                <td>
                  {formatDate(request.start_datetime)}
                  <div className="requests-end-date">
                    to {formatDate(request.end_datetime)}
                  </div>
                </td>
                <td>
                  <span className={`request-badge ${request.status}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="view-details-btn"
                    onClick={() => setSelectedRequest(request)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}

            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="7" className="requests-empty">
                  No matching requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="requests-table-footer">
          Showing {filteredRequests.length} requests
        </div>
      </div>
    </div>
  );
}

export default Requests;