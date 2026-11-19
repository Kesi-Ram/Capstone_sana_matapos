import { useEffect, useState } from "react";
import "./dashboard.css";
import RequestDetails from "../requests/requestDetails";

function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadDashboard() {
    const response = await fetch("/api/dashboard.php", {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load dashboard data.");
    }

    setDashboardData(data);
  }

  useEffect(() => {
    async function fetchDashboard() {
      try {
        await loadDashboard();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  async function openRequestDetails(requestId) {
    try {
      setError("");

      const response = await fetch("/api/requests.php", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load request details.");
      }

      const fullRequest = (data.requests || []).find(
        (item) => String(item.id) === String(requestId)
      );

      if (!fullRequest) {
        throw new Error("Request not found.");
      }

      setSelectedRequest(fullRequest);
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateRequestStatus(id, newStatus, reason = "") {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/update_request_status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id,
          status: newStatus,
          reason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not update the request.");
      }

      // Update the open details page immediately.
      setSelectedRequest((currentRequest) => {
        if (!currentRequest) return currentRequest;

        return {
          ...currentRequest,
          status: newStatus,
          ...(newStatus === "rejected"
            ? { reject_reason: reason }
            : {}),
        };
      });

      // Refresh dashboard counts and recent requests.
      try {
        await loadDashboard();
      } catch (refreshError) {
        setError(
          "The request status was updated, but the dashboard could not refresh."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!dashboardData) {
    return <p role="alert">{error || "Could not load dashboard data."}</p>;
  }

  if (selectedRequest) {
    return (
      <RequestDetails
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        onApprove={(id) => updateRequestStatus(id, "approved")}
        onReject={(id, reason) =>
          updateRequestStatus(id, "rejected", reason)
        }
        saving={saving}
      />
    );
  }

  const recentRequests = dashboardData.recent_requests || [];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
      </header>

      {error && <p role="alert">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <p>Pending Requests</p>
          <h2>{dashboardData.stats.pending_requests}</h2>
        </div>

        <div className="stat-card">
          <p>Approved Requests</p>
          <h2>{dashboardData.stats.approved_requests}</h2>
        </div>

        <div className="stat-card">
          <p>Active Facilities</p>
          <h2>{dashboardData.facilities.active_facilities}</h2>
        </div>
      </div>

      <section className="recent-section">
        <div className="section-header">
          <h2>Recent Requests</h2>
        </div>

        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Control No.</th>
                <th>Organization</th>
                <th>Activity</th>
                <th>Facility</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {recentRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.control_number}</td>
                  <td>{request.organization}</td>
                  <td>{request.nature_of_activity}</td>
                  <td>{request.facility}</td>
                  <td>{request.start_datetime}</td>
                  <td>
                    <span
                      className={`request-status request-status--${request.status}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="view-details-btn"
                      onClick={() => openRequestDetails(request.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {recentRequests.length === 0 && (
                <tr>
                  <td colSpan="7">No requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;