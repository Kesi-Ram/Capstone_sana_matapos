import { useEffect, useState } from "react";
import { MAJORS } from "../data/rooms";
import { DAYS, MEETING_TYPES, NO_LECTURE_DAYS, TIME_SLOTS } from "../data/classes";

const emptyClass = {
  subject: "",
  section: "",
  instructor: "",
  major: MAJORS[0],
  type: "Lecture",
  days: [],
  slot: TIME_SLOTS[0].label,
  studentCount: "",
};

export default function ClassModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(emptyClass);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...emptyClass });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function toggleDay(day) {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.section.trim() || !formData.instructor.trim()) {
      setError("Subject, section, and instructor are required.");
      return;
    }
    if (formData.days.length === 0) {
      setError("Select at least one day.");
      return;
    }
    if (formData.type === "Lecture" && formData.days.some((day) => NO_LECTURE_DAYS.includes(day))) {
      setError("Lectures cannot be scheduled on Friday or Saturday.");
      return;
    }
    if (Number(formData.studentCount) <= 0) {
      setError("Student count must be greater than 0.");
      return;
    }

    const slot = TIME_SLOTS.find((s) => s.label === formData.slot);

    onSave({
      subject: formData.subject.trim(),
      section: formData.section.trim(),
      instructor: formData.instructor.trim(),
      major: formData.major,
      type: formData.type,
      days: DAYS.filter((day) => formData.days.includes(day)), // keeps Mon-Sat order
      start: slot.start,
      end: slot.end,
      studentCount: Number(formData.studentCount),
      roomId: null,
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Class Meeting</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Subject
            <input name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Web Development" />
          </label>

          <div className="form-row">
            <label>
              Section
              <input name="section" value={formData.section} onChange={handleChange} placeholder="e.g. WT-2A" />
            </label>
            <label>
              Instructor
              <input name="instructor" value={formData.instructor} onChange={handleChange} />
            </label>
          </div>

          <div className="form-row">
            <label>
              Major
              <select name="major" value={formData.major} onChange={handleChange}>
                {MAJORS.map((major) => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </label>
            <label>
              Meeting type
              <select name="type" value={formData.type} onChange={handleChange}>
                {MEETING_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="checkbox-group">
            <legend>Days</legend>
            {DAYS.map((day) => (
              <label key={day}>
                <input type="checkbox" checked={formData.days.includes(day)} onChange={() => toggleDay(day)} />
                {day}
              </label>
            ))}
          </fieldset>

          <div className="form-row">
            <label>
              Time slot
              <select name="slot" value={formData.slot} onChange={handleChange}>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.label} value={slot.label}>{slot.label}</option>
                ))}
              </select>
            </label>
            <label>
              Students
              <input type="number" name="studentCount" min="1" value={formData.studentCount} onChange={handleChange} />
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Class</button>
          </div>
        </form>
      </div>
    </div>
  );
}