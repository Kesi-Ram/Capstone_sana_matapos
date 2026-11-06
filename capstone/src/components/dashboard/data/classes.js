// Placeholder data: subjects, sections, instructors, and time slots are examples.
// Replace them with the department's real values.
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MEETING_TYPES = ["Lecture", "Lab"];

// Confirmed: major subjects have no lecture meetings on Friday and Saturday.
export const NO_LECTURE_DAYS = ["Fri", "Sat"];

// PLACEHOLDER slots until the department confirms its real ones.
export const TIME_SLOTS = [
  { label: "7:30 - 9:00", start: "07:30", end: "09:00" },
  { label: "9:00 - 10:30", start: "09:00", end: "10:30" },
  { label: "10:30 - 12:00", start: "10:30", end: "12:00" },
  { label: "1:00 - 2:30", start: "13:00", end: "14:30" },
  { label: "2:30 - 4:00", start: "14:30", end: "16:00" },
  { label: "8:00 - 11:00 (3 hrs)", start: "08:00", end: "11:00" },
  { label: "1:00 - 4:00 (3 hrs)", start: "13:00", end: "16:00" },
];

// One record per MEETING. A subject with a lecture and a lab is two records.
// roomId points to a room's id in rooms.js; null means not assigned yet.
export const initialClasses = [
  { id: 1, subject: "Web Development", section: "WT-2A", instructor: "Instructor A", major: "Web Tech", type: "Lecture", days: ["Mon", "Wed"], start: "09:00", end: "10:30", studentCount: 35, roomId: 6 },
  { id: 2, subject: "Web Development", section: "WT-2A", instructor: "Instructor A", major: "Web Tech", type: "Lab", days: ["Fri"], start: "13:00", end: "16:00", studentCount: 35, roomId: 2 },
  { id: 3, subject: "Multimedia Design", section: "MM-2A", instructor: "Instructor B", major: "Multimedia", type: "Lecture", days: ["Tue", "Thu"], start: "09:00", end: "10:30", studentCount: 40, roomId: 6 },
  { id: 4, subject: "Multimedia Design", section: "MM-2A", instructor: "Instructor B", major: "Multimedia", type: "Lab", days: ["Sat"], start: "08:00", end: "11:00", studentCount: 40, roomId: 4 },
  { id: 5, subject: "Web Systems", section: "WT-3A", instructor: "Instructor D", major: "Web Tech", type: "Lecture", days: ["Mon", "Wed"], start: "13:00", end: "14:30", studentCount: 33, roomId: 7 },
  { id: 6, subject: "Web Systems", section: "WT-3A", instructor: "Instructor D", major: "Web Tech", type: "Lab", days: ["Sat"], start: "13:00", end: "16:00", studentCount: 33, roomId: 5 },
  { id: 7, subject: "Network Security", section: "NS-3A", instructor: "Instructor C", major: "Netsec", type: "Lecture", days: ["Mon", "Wed"], start: "10:30", end: "12:00", studentCount: 30, roomId: null },
  { id: 8, subject: "Network Security", section: "NS-3A", instructor: "Instructor C", major: "Netsec", type: "Lab", days: ["Fri"], start: "08:00", end: "11:00", studentCount: 30, roomId: null },
];