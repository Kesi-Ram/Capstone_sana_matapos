import { useMemo, useState } from "react";

export default function RoomTable({ rooms = [], onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRooms = useMemo(() => {
    return rooms.filter((rooms) => {
      const matchesSearch =
        rooms.name.toLowerCase().includes(search.toLowerCase()) ||
        rooms.building.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || rooms.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rooms, search, statusFilter]);

  return (
    <div className="table-container">
      <div className="table-toolbar">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search rooms or buildings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All statuses</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      <div className="table-scroll">
        <table className="room-table">
          <thead>
            <tr>
              <th>ROOM NAME</th>
              <th>LOCATION</th>
              <th>CAPACITY</th>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((rooms) => (
                <tr key={rooms.id}>
                  <td>
                    <div className="room-name">
                      <div className="room-icon">▣</div>
                      <strong>{rooms.name}</strong>
                    </div>
                  </td>

                  <td>
                    <div className="location-cell">
                      <strong>{rooms.building}</strong>
                      <span>{rooms.floor}</span>
                    </div>
                  </td>

                  <td>{rooms.capacity} seats</td>
                  <td>{rooms.type}</td>

                  <td>
                    <span
                      className={`status-badge ${rooms.status.toLowerCase()}`}
                    >
                      <span className="status-dot"></span>
                      {rooms.status}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn"
                        title="Edit room"
                        onClick={() => onEdit(rooms)}
                      >
                        ✎
                      </button>

                      <button
                        className="action-btn delete-btn"
                        title="Delete room"
                        onClick={() => onDelete(rooms.id)}
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        Showing {filteredRooms.length} of {rooms.length} rooms
      </div>
    </div>
  );
}