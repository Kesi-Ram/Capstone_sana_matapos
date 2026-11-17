
import { useEffect, useState } from "react";
import "./request.css";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    return requests.filter((request) => request.status === status).length;
  };

  // Filter requests by status and search text
  const filteredRequests = requests.filter((request) => {
    const matchesStatus = request.status === activeTab;

    const searchText = [
      request.control_number,
      request.organization,
      request.name_of_program,
      request.nature_of_activity,
      request.facility
    ].join(" ").toLowerCase();

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
      minute: "2-digit"
    });
  }

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p>{error}</p>;

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
          {["pending", "approved", "rejected"].map((status) => (
            <button
              type="button"
              key={status}
              className={`requests-tab ${activeTab === status ? "active" : ""}`}
              onClick={() => setActiveTab(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}

              <span className="tab-count">
                {countByStatus(status)}
              </span>
            </button>
          ))}
        </div>

        <input
          type="search"
          className="requests-search"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="requests-table-container">
        <table className="requests-list-table">
          <thead>
            <tr>
              <th>Control No.</th>
              <th>Organization</th>
              <th>Activity</th>
              <th>Facility</th>
              <th>Date & Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.control_number}</td>
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
              </tr>
            ))}

            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="6" className="requests-empty">
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
