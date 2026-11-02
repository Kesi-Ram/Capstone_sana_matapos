const navigation = [
  { name: "Overview"},
  { name: "Rooms"},
  { name: "Schedules"},
  { name: "Users"},
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div>
          <span>ADMIN PORTAL</span>
        </div>
      </div>

      <div className="sidebar-label">Menu</div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${activePage === item.name ? "active" : ""}`}
            onClick={() => setActivePage(item.name)}
          >
            {item.name}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="admin-avatar">A</div>
        <div>
          <strong>Administrator</strong>
          <span>System Admin</span>
        </div>
      </div>
    </aside>
  );
}