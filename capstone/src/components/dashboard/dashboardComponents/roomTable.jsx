import { useMemo, useState } from "react";
import { MAJORS, ROOM_TYPES } from "../data/rooms";

export default function RoomTable({ rooms = [], onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [majorFilter, setMajorFilter] = useState("All");
  const [minCapacity, setMinCapacity] = useState("");

  const filteredRooms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(query) ||
        room.building.toLowerCase().includes(query);
      const matchesType = typeFilter === "All" || room.type === typeFilter;
      const matchesMajor =
        majorFilter === "All" || room.allowedMajors.includes(majorFilter);
      const matchesCapacity =
        minCapacity === "" || room.capacity >= Number(minCapacity);

      return matchesSearch && matchesType && matchesMajor && matchesCapacity;
    });
  }, [rooms, search, typeFilter, majorFilter, minCapacity]);

  return (
    <div>
      <div className="table-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search rooms or buildings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="All">All types</option>
          {ROOM_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select className="filter-select" value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)}>
          <option value="All">All majors</option>
          {MAJORS.map((major) => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>

        <input
          className="filter-select"
          type="number"
          min="1"
          placeholder="Min capacity"
          value={minCapacity}
          onChange={(e) => setMinCapacity(e.target.value)}
        />
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Type</th>
              <th>Allowed majors</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td><strong>{room.name}</strong></td>
                  <td>
                    <div className="location-cell">
                      <span>{room.building}</span>
                      <small>{room.floor}</small>
                    </div>
                  </td>
                  <td>{room.capacity} seats</td>
                  <td>{room.type}</td>
                  <td>
                    {room.allowedMajors.map((major) => (
                      <span className="tag" key={major}>{major}</span>
                    ))}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="Edit room" onClick={() => onEdit(room)}>✎</button>
                      <button className="action-btn delete-btn" title="Delete room" onClick={() => onDelete(room.id)}>×</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">No rooms found.</td>
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