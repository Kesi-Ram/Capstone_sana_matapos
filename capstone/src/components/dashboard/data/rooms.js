// Placeholder data: names, buildings, and major assignments are examples.
// Replace them with the department's real rooms.
export const MAJORS = ["Web Tech", "Multimedia", "Netsec"];
export const ROOM_TYPES = ["Lecture", "Lab"];

export const initialRooms = [
  { id: 1, name: "Computer Laboratory 1", building: "Building A", floor: "2nd Floor", capacity: 40, type: "Lab", allowedMajors: ["Web Tech"] },
  { id: 2, name: "Computer Laboratory 2", building: "Building A", floor: "2nd Floor", capacity: 35, type: "Lab", allowedMajors: ["Web Tech"] },
  { id: 3, name: "Computer Laboratory 3", building: "Building A", floor: "3rd Floor", capacity: 30, type: "Lab", allowedMajors: ["Netsec"] },
  { id: 4, name: "Computer Laboratory 4", building: "Building A", floor: "3rd Floor", capacity: 40, type: "Lab", allowedMajors: ["Multimedia"] },
  { id: 5, name: "Computer Laboratory 5", building: "Building A", floor: "3rd Floor", capacity: 35, type: "Lab", allowedMajors: ["Web Tech", "Multimedia"] },
  { id: 6, name: "Lecture Room 201", building: "Building B", floor: "2nd Floor", capacity: 45, type: "Lecture", allowedMajors: [...MAJORS] },
  { id: 7, name: "Lecture Room 301", building: "Building B", floor: "3rd Floor", capacity: 35, type: "Lecture", allowedMajors: [...MAJORS] },
];