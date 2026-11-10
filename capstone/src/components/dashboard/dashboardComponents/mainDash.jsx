import { useState } from "react";
import Sidebar from "./Sidebar";
import RoomTable from "./roomTable";
import RoomModal from "./editRoomModal";
import { initialRooms } from "../data/rooms";
import ClassTable from "./classTable";
import { initialClasses } from "../data/classes";
import ClassModal from "./classModal";
import AssignRoomModal from "./assignRoomModal";

export default function MainDash({ user, onLogout }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [activePage, setActivePage] = useState("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [classes, setClasses] = useState(initialClasses);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);

const stats = [
  { label: "Total rooms", value: rooms.length },
  { label: "Class meetings", value: classes.length },
  { label: "Waiting for a room", value: classes.filter((meeting) => meeting.roomId === null).length },
];

  function handleAddRoom() {
    setEditRoom(null);
    setIsModalOpen(true);
  }

  function handleEditRoom(room) {
    setEditRoom(room);
    setIsModalOpen(true);
  }

  function handleSaveRoom(roomData) {
    if (editRoom) {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === editRoom.id ? { ...roomData, id: editRoom.id } : room
        )
      );
    } else {
      setRooms((prev) => [
        ...prev,
        { ...roomData, id: Math.max(0, ...prev.map((room) => room.id)) + 1 },
      ]);
    }
  }

function handleSaveClass(classData) {
  setClasses((prev) => [
    ...prev,
    { ...classData, id: Math.max(0, ...prev.map((meeting) => meeting.id)) + 1 },
  ]);
}

function handleDeleteClass(id) {
  if (window.confirm("Delete this class meeting?")) {
    setClasses((prev) => prev.filter((meeting) => meeting.id !== id));
  }
}

// roomId = a room's id to assign, or null to unassign.
function handleAssignRoom(meetingId, roomId) {
  setClasses((prev) =>
    prev.map((meeting) => (meeting.id === meetingId ? { ...meeting, roomId } : meeting))
  );
  setAssignTarget(null);
}

function handleDeleteRoom(id) {
  if (window.confirm("Delete this room? Classes assigned to it will become unassigned.")) {
    setRooms((prev) => prev.filter((room) => room.id !== id));
    setClasses((prev) =>
      prev.map((meeting) => (meeting.roomId === id ? { ...meeting, roomId: null } : meeting))
    );
  }
}

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / {activePage}</span>
            <h1>{activePage}</h1>
          </div>
      <div className="topbar-profile">
        <div className="profile-avatar">{user.name[0]}</div>
          <div>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
          </div>
            <button className="btn-secondary btn-small" onClick={onLogout}>
            Log out
            </button>
        </div>
      </header>

        {activePage === "Overview" && (
          <section className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <span>{stat.label}</span>
                <h2>{stat.value}</h2>
              </div>
            ))}
          </section>
        )}

        {activePage === "Rooms" && (
          <section className="content-section">
            <div className="section-heading">
              <div>
                <h2>All Rooms</h2>
                <p>Rooms given to the department.</p>
              </div>
              <button className="btn-primary" onClick={handleAddRoom}>+ Add Room</button>
            </div>

            <RoomTable rooms={rooms} onEdit={handleEditRoom} onDelete={handleDeleteRoom} />
          </section>
        )}

{activePage === "Classes" && (
  <section className="content-section">
    <div className="section-heading">
      <div>
        <h2>Class Meetings</h2>
        <p>Each lecture and lab is a separate meeting.</p>
      </div>
      <button className="btn-primary" onClick={() => setIsClassModalOpen(true)}>+ Add Class</button>
    </div>

    <ClassTable
      classes={classes}
      rooms={rooms}
      onAssign={setAssignTarget}
      onDelete={handleDeleteClass}
    />
  </section>
)}

        {activePage === "Users" && (
          <section className="placeholder-page">
            <h2>User Management</h2>
            <p>Manage user accounts here.</p>
          </section>
        )}
      </main>

      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoom}
        editRoom={editRoom}
      />
      
      <ClassModal
  isOpen={isClassModalOpen}
  onClose={() => setIsClassModalOpen(false)}
  onSave={handleSaveClass}
/>

<AssignRoomModal
  meeting={assignTarget}
  rooms={rooms}
  classes={classes}
  onClose={() => setAssignTarget(null)}
  onAssign={handleAssignRoom}
/>
    </div>
  );
}