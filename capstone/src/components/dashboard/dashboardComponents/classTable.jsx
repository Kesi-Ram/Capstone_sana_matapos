import { useMemo, useState } from "react";
import { MAJORS } from "../data/rooms";
import { MEETING_TYPES } from "../data/classes";
import { formatTime } from "../logic/formatTime";


   export default function ClassTable({ classes = [], rooms = [], onAssign, onDelete }) {
  const [search, setSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [roomFilter, setRoomFilter] = useState("All");

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return classes.filter((meeting) => {
      const matchesSearch = [meeting.subject, meeting.section, meeting.instructor].some(
        (field) => field.toLowerCase().includes(query)
      );
      const matchesMajor = majorFilter === "All" || meeting.major === majorFilter;
      const matchesType = typeFilter === "All" || meeting.type === typeFilter;
      const matchesRoom =
        roomFilter === "All" ||
        (roomFilter === "Assigned" ? meeting.roomId !== null : meeting.roomId === null);

      return matchesSearch && matchesMajor && matchesType && matchesRoom;
    });
  }, [classes, search, majorFilter, typeFilter, roomFilter]);

  return (
    <div>
      <div className="table-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search subject, section, or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="filter-select" value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)}>
          <option value="All">All majors</option>
          {MAJORS.map((major) => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>

        <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="All">All types</option>
          {MEETING_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select className="filter-select" value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
          <option value="All">All rooms</option>
          <option value="Assigned">Assigned</option>
          <option value="Unassigned">Unassigned</option>
        </select>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Section</th>
              <th>Instructor</th>
              <th>Major</th>
              <th>Type</th>
              <th>Days</th>
              <th>Time</th>
              <th>Students</th>
              <th>Room</th>
              <th>Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((meeting) => {
                const room = rooms.find((r) => r.id === meeting.roomId);

                return (
                  <tr key={meeting.id}>
                    <td><strong>{meeting.subject}</strong></td>
                    <td>{meeting.section}</td>
                    <td>{meeting.instructor}</td>
                    <td>{meeting.major}</td>
                    <td>{meeting.type}</td>
                    <td>{meeting.days.join(", ")}</td>
                    <td>{formatTime(meeting.start)} - {formatTime(meeting.end)}</td>
                    <td>{meeting.studentCount}</td>
                    <td>
                      {meeting.roomId === null ? (
                        <span className="badge-unassigned">Unassigned</span>
                      ) : room ? (
                        room.name
                      ) : (
                        "Room removed"
                      )}
                    </td>
                       <td>
     <div className="action-buttons">
       <button className="btn-secondary btn-small" onClick={() => onAssign(meeting)}>
         {meeting.roomId === null ? "Recommend" : "Change"}
       </button>
       <button className="action-btn delete-btn" title="Delete meeting" onClick={() => onDelete(meeting.id)}>×</button>
     </div>
   </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="empty-state">No class meetings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        Showing {filteredClasses.length} of {classes.length} meetings
      </div>
    </div>
  );
}