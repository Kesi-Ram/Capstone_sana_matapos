import { useState } from "react";
import Sidebar from "../dashboardComponents/Sidebar";
import RoomTable from "../dashboardComponents/roomTable";
import AddRoomModal from "../dashboardComponents/editRoomModal";
import { initialRooms } from "../data/rooms";

export default function Dashboard() {
  const [rooms, setRooms] = useState(initialRooms);
  const [activePage, setActivePage] = useState("Overview");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  const available = rooms.filter(
    (rooms) => rooms.status === "Available"
  ).length;

  const occupied = rooms.filter(
    (rooms) => rooms.status === "Occupied"
  ).length;

  const maintenance = rooms.filter(
    (rooms) => rooms.status === "Maintenance"
  ).length;

  function handleAddRoom() {
    setEditRoom(null);
    setIsModalOpen(true);
  }

  function handleEditRoom(rooms) {
    setEditRoom(rooms);
    setIsModalOpen(true);
  }

  function handleSaveRoom(roomData) {
    if (editRoom) {
      setRooms((prev) =>
        prev.map((rooms) =>
          rooms.id === editRoom.id
            ? { ...roomData, id: editRoom.id }
            : rooms
        )
      );
    } else {
      setRooms((prev) => [
        ...prev,
        {
          ...roomData,
          id: Math.max(0, ...prev.map((rooms) => rooms.id)) + 1,
        },
      ]);
    }
  }

  function handleDeleteRoom(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (confirmed) {
      setRooms((prev) => prev.filter((rooms) => rooms.id !== id));
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">
              Workspace / {activePage}
            </span>
            <h1>{activePage}</h1>
          </div>

          <div className="topbar-right">

            <div className="topbar-profile">
              <div className="profile-avatar">A</div>
              <div>
                <strong>Administrator</strong>
                <span>System Admin</span>
              </div>
            </div>
          </div>
        </header>

        {activePage === "Overview" && (
          <>
            <section className="welcome-section">
              <button className="btn-primary" onClick={handleAddRoom}>
                + Add Room
              </button>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-top">
                  <span>Total Rooms</span>
                  <span className="stat-icon blue">▣</span>
                </div>
                <h2>{rooms.length}</h2>
                <p>Registered rooms</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Available</span>
                  <span className="stat-icon green">✓</span>
                </div>
                <h2>{available}</h2>
                <p>Ready for use</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Occupied</span>
                  <span className="stat-icon orange">◷</span>
                </div>
                <h2>{occupied}</h2>
                <p>Currently in use</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Maintenance</span>
                  <span className="stat-icon red">⚙</span>
                </div>
                <h2>{maintenance}</h2>
                <p>Unavailable rooms</p>
              </div>
            </section>

            <section className="content-section">
              <div className="section-heading">
                <div>
                  <h2>Room Management</h2>
                  <p>View and manage registered rooms.</p>
                </div>
                <button
                  className="btn-outline"
                  onClick={() => setActivePage("Rooms")}
                >
                  View All Rooms →
                </button>
              </div>

              <RoomTable
                rooms={rooms.slice(0, 5)}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
              />
            </section>
          </>
        )}

        {activePage === "Rooms" && (
          <section className="content-section">
            <div className="section-heading">
              <div>
                <h2>All Rooms</h2>
                <p>Manage your registered campus rooms.</p>
              </div>

              <button className="btn-primary" onClick={handleAddRoom}>
                + Add Room
              </button>
            </div>

            <RoomTable
              rooms={rooms}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
            />
          </section>
        )}

        {activePage === "Schedules" && (
          <section className="placeholder-page">
            <div className="placeholder-icon">▤</div>
            <h2>Schedule Management</h2>
            <p>Room schedules and availability will appear here.</p>
          </section>
        )}

        {activePage === "Users" && (
          <section className="placeholder-page">
            <div className="placeholder-icon">♙</div>
            <h2>User Management</h2>
            <p>Manage administrator and user accounts here.</p>
          </section>
        )}
      </main>

      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoom}
        editRoom={editRoom}
      />
    </div>
  );
}