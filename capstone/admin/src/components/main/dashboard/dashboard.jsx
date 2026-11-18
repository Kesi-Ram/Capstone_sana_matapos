import { useEffect, useState } from "react";
import "./dashboard.css";

function Dashboard({ user}) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/dashboard.php");

        if (!response.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
  <div className="dashboard">
    <header className="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back, {user.name}</p>
      </div>

    </header>

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
        </tr>
      </thead>

      <tbody>
        {dashboardData.recent_requests.map((request) => (
          <tr key={request.id}>
            <td>{request.control_number}</td>
            <td>{request.organization}</td>
            <td>{request.nature_of_activity}</td>
            <td>{request.facility}</td>
            <td>{request.start_datetime}</td>
            <td>
              <span className={`request-status request-status--${request.status}`}>
                {request.status}
              </span>
            </td>
          </tr>
        ))}

        {dashboardData.recent_requests.length === 0 && (
          <tr>
            <td colSpan="6">No requests found.</td>
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