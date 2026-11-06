import { useEffect, useState } from "react";
import { MAJORS, ROOM_TYPES } from "../data/rooms";

const emptyRoom = {
  name: "",
  building: "",
  floor: "",
  capacity: "",
  type: "Lecture",
  allowedMajors: [],
};

export default function RoomModal({ isOpen, onClose, onSave, editRoom }) {
  const [formData, setFormData] = useState(emptyRoom);
  const [error, setError] = useState("");

  // Reset the form each time the modal opens (empty for add, filled for edit).
  useEffect(() => {
    if (isOpen) {
      setFormData(editRoom ? { ...editRoom } : { ...emptyRoom });
      setError("");
    }
  }, [isOpen, editRoom]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Adds the major if absent, removes it if present. Always builds a new array.
  function toggleMajor(major) {
    setFormData((prev) => ({
      ...prev,
      allowedMajors: prev.allowedMajors.includes(major)
        ? prev.allowedMajors.filter((m) => m !== major)
        : [...prev.allowedMajors, major],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim() || !formData.building.trim()) {
      setError("Room name and building are required.");
      return;
    }
    if (Number(formData.capacity) <= 0) {
      setError("Capacity must be greater than 0.");
      return;
    }
    if (formData.allowedMajors.length === 0) {
      setError("Select at least one allowed major.");
      return;
    }

    onSave({ ...formData, capacity: Number(formData.capacity) });
    onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editRoom ? "Edit Room" : "Add New Room"}</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Room name
            <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Computer Laboratory 1" />
          </label>

          <div className="form-row">
            <label>
              Building
              <input name="building" value={formData.building} onChange={handleChange} placeholder="e.g. Building A" />
            </label>
            <label>
              Floor
              <input name="floor" value={formData.floor} onChange={handleChange} placeholder="e.g. 2nd Floor" />
            </label>
          </div>

          <div className="form-row">
            <label>
              Capacity
              <input type="number" name="capacity" min="1" value={formData.capacity} onChange={handleChange} placeholder="40" />
            </label>
            <label>
              Room type
              <select name="type" value={formData.type} onChange={handleChange}>
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="checkbox-group">
            <legend>Allowed majors</legend>
            {MAJORS.map((major) => (
              <label key={major}>
                <input
                  type="checkbox"
                  checked={formData.allowedMajors.includes(major)}
                  onChange={() => toggleMajor(major)}
                />
                {major}
              </label>
            ))}
          </fieldset>

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{editRoom ? "Save Changes" : "Add Room"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}