import { useEffect, useState } from "react";

const emptyRoom = {
  name: "",
  building: "",
  floor: "",
  capacity: "",
  type: "Classroom",
  status: "Available",
};

export default function AddRoomModal({ isOpen, onClose, onSave, editRoom }) {
  const [formData, setFormData] = useState(emptyRoom);

  useEffect(() => {
    if (isOpen) {
      setFormData(
        editRoom
          ? { ...editRoom }
          : { ...emptyRoom }
      );
    }
  }, [isOpen, editRoom]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim() || !formData.building.trim()) {
      return;
    }

    if (Number(formData.capacity) <= 0) {
      return;
    }

    onSave({
      ...formData,
      capacity: Number(formData.capacity),
    });

    onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-card"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{editRoom ? "Edit Room" : "Add New Room"}</h2>
            <p>Enter the room information below.</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Room Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Computer Laboratory 1"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Building
              <input
                name="building"
                value={formData.building}
                onChange={handleChange}
                placeholder="e.g. Building A"
                required
              />
            </label>

            <label>
              Floor
              <input
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="e.g. 2nd Floor"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Capacity
              <input
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="40"
                required
              />
            </label>

            <label>
              Room Type
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option>Classroom</option>
                <option>Laboratory</option>
                <option>Discussion</option>
                <option>Meeting</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Available</option>
              <option>Occupied</option>
              <option>Maintenance</option>
            </select>
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="btn-primary">
              {editRoom ? "Save Changes" : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}