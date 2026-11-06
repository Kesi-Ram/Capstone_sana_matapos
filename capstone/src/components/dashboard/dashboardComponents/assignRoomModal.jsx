import { useEffect, useState } from "react";
import { getAvailableRooms, recommendRoom } from "../logic/recommend";
import { formatTime } from "../logic/formatTime";

export default function AssignRoomModal({ meeting, rooms, classes, onClose, onAssign }) {
  const [selectedRoomId, setSelectedRoomId] = useState("");

  // Clear the dropdown whenever a different meeting is opened.
  useEffect(() => {
    setSelectedRoomId("");
  }, [meeting]);

  if (!meeting) return null;

  const availableRooms = getAvailableRooms(meeting, rooms, classes);
  const recommended = recommendRoom(meeting, rooms, classes);
  const currentRoom = rooms.find((room) => room.id === meeting.roomId);

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{meeting.roomId === null ? "Assign Room" : "Change Room"}</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="assign-body">
          <p className="assign-summary">
            <strong>{meeting.subject}</strong> · {meeting.section} · {meeting.type}
            <br />
            {meeting.days.join(", ")} · {formatTime(meeting.start)} - {formatTime(meeting.end)} ·{" "}
            {meeting.studentCount} students · {meeting.major}
            {currentRoom && (
              <>
                <br />
                Current room: {currentRoom.name}
              </>
            )}
          </p>

          <div className="assign-box">
            <h3>Recommended room</h3>
            {recommended ? (
              <>
                <p>
                  {recommended.name} · {recommended.building}, {recommended.floor} · {recommended.capacity} seats
                </p>
                <button className="btn-primary" onClick={() => onAssign(meeting.id, recommended.id)}>
                  Approve recommendation
                </button>
              </>
            ) : (
              <p className="muted-text">
                No room fits this meeting. Check the room type, allowed majors, capacity, and time clashes.
              </p>
            )}
          </div>

          <div className="assign-box">
            <h3>Or choose manually ({availableRooms.length} available)</h3>
            {availableRooms.length > 0 ? (
              <>
                <select
                  className="filter-select"
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                >
                  <option value="">Select a room...</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.capacity} seats)
                    </option>
                  ))}
                </select>
                <button
                  className="btn-secondary"
                  disabled={!selectedRoomId}
                  onClick={() => onAssign(meeting.id, Number(selectedRoomId))}
                >
                  Assign selected room
                </button>
              </>
            ) : (
              <p className="muted-text">No free rooms for this meeting.</p>
            )}
          </div>

          <div className="modal-actions">
            {meeting.roomId !== null && (
              <button className="btn-secondary" onClick={() => onAssign(meeting.id, null)}>
                Unassign
              </button>
            )}
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}