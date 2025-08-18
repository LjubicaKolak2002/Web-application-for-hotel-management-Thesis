export const getTodayDate = () => new Date().toISOString().split("T")[0];

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid date";

  return date.toLocaleString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, //pm i am
  });
};

export const isRoomAssignedOnDate = (roomId, selectedDate, assignedRooms) => {
  const selected = new Date(selectedDate).toISOString().split("T")[0];

  return assignedRooms.some((assignment) => {
    const assignedRoomId = assignment.room;
    const assignedDate = new Date(assignment.date).toISOString().split("T")[0];

    return assignedRoomId === roomId && assignedDate === selected;
  });
};
