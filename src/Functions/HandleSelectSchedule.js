export const selectScheduleObject = {
  patientId: "",
  name: "",
  shift: "",
  shiftId: "",
  week: 0,
  day: "",
  date: {
    day: 0,
    month: 0,
    year: 0,
  },
  serviceName: "",
  serviceId: "",
  departmentId: "",
  room: "",
  doctor: "",
  doctorId: "",
  doctorRoomId: "",
  scheduleId: "",
  slot: 0,
  valable: 0,
};

export const selectScheduleLogic = {
  focusShift: false,
  focusWeek: false,
  focusDay: false,
  focusService: false,
  focusRoom: false,
  focusDoctor: false,
};

export const converToCurrentDate = (date) => {
  const currentDate = new Date();
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    0
  );
};
