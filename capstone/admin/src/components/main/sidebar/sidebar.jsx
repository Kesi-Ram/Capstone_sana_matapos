
import "./Sidebar.css";


function Sidebar({ user, activePage, onNavigate, onLogout, theme, onToggleTheme }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "requests", label: "All Requests", icon: "▤" },
    { id: "schedule", label: "Schedule", icon: "▦" },
    { id: "facilities", label: "Facilities", icon: "▥" },
    { id: "forecast", label: "Predictive Analysis", icon: "▦" }
  ];

  function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (confirmed) {
      onLogout();
    }
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <h2>Facility Reservations</h2>
        <p>Campus Admin</p>
      </div>

      <nav className="sidebar-nav" aria-label="Admin navigation">
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`sidebar-link ${activePage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? "page" : undefined}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.name || "Admin"}</strong>
            <span>Admin</span>
          </div>
        </div>

        <button
            type="button"
            className="sidebar-theme"
            onClick={onToggleTheme}
            aria-pressed={theme === "dark"}
        >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
