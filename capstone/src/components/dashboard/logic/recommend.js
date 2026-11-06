// Two meetings clash if they share a day and their time ranges overlap.
export function meetingsOverlap(a, b) {
  const sharesDay = a.days.some((day) => b.days.includes(day));
  return sharesDay && a.start < b.end && b.start < a.end;
}

// Every room that can host this meeting: right type, allowed major,
// enough seats, and no clash with another meeting already in that room.
export function getAvailableRooms(meeting, rooms, classes) {
  return rooms.filter((room) => {
    if (room.type !== meeting.type) return false;
    if (!room.allowedMajors.includes(meeting.major)) return false;
    if (room.capacity < meeting.studentCount) return false;

    const hasClash = classes.some(
      (other) =>
        other.id !== meeting.id &&
        other.roomId === room.id &&
        meetingsOverlap(meeting, other)
    );

    return !hasClash;
  });
}

// The single best room, or null if none fits.
// Ranking: rooms used by fewer majors first, then the smallest room that fits.
export function recommendRoom(meeting, rooms, classes) {
  const options = getAvailableRooms(meeting, rooms, classes);
  if (options.length === 0) return null;

  return [...options].sort((a, b) => {
    if (a.allowedMajors.length !== b.allowedMajors.length) {
      return a.allowedMajors.length - b.allowedMajors.length;
    }
    return a.capacity - b.capacity;
  })[0];
}