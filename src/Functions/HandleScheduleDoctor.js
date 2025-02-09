import { getISOWeek } from "date-fns";
import { UTCTimeToString } from "./HandleDate";
const currentDate = new Date();

export const listDay = [
  { day: "Thứ 2", id: 1 },
  { day: "Thứ 3", id: 2 },
  { day: "Thứ 4", id: 3 },
  { day: "Thứ 5", id: 4 },
  { day: "Thứ 6", id: 5 },
  { day: "Thứ 7", id: 6 },
  { day: "Chủ Nhật", id: 0 },
];

export const listStates = [
  { state: "Mở", id: true },
  { state: "Đóng", id: false },
];

export const listTypeDay = [{ typeDay: "Ngày làm" }, { typeDay: "Ngày nghỉ" }];

export const stringDay = (value) => {
  const day = listDay.find((items) => items.id === value);
  return day.day;
};

export const scheduleObject = {
  id: "",
  week: getISOWeek(currentDate),
  day: stringDay(currentDate.getDay()),
  date: {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  },
  zone: "Nguyễn Du",
  shift: "",
  shiftId: "",
  timeStart: "",
  timeEnd: "",
  room: "",
  roomId: "",
  department: "",
  departmentId: "",
  maxTime: 15,
  doctor: "",
  doctorId: "",
  state: "Mở",
  stateId: true,
  nameSchedule: "",
};

export const optionScheduleObject = {
  name: "",
  typeDay: "Ngày làm",
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: false,
  status: true,
  targetName: "",
};

export const handleInsertOptionSchedule = (object) => {
  let insertSchedule = { ...optionScheduleObject };
  for (let key in object) {
    let lowerKey = key.toLowerCase();

    if (lowerKey in insertSchedule) {
      insertSchedule[lowerKey] = object[key] ?? insertSchedule[lowerKey];
    }
  }
  return insertSchedule;
};

export const handleInserSchedule = (object, schedule) => {
  return {
    id: object.Id,
    zone: "Nguyễn Du",
    shift: object.Shift.Name,
    shiftId: object.Shift.Id,
    timeStart: UTCTimeToString(object.Shift.Start),
    timeEnd: UTCTimeToString(object.Shift.End),
    room: object.Room.Name,
    roomId: object.Room.Id,
    department: object.Room.Department.Name,
    departmentId: object.Room.Department.Id,
    doctor: object.Employee.Name,
    doctorId: object.Employee.Id,
    state: object.State ? "Mở" : "Đóng",
    stateId: object.State,
    nameSchedule: schedule.name,
  };
};

export const filterDoctorRoom = (
  shiftId,
  RoomId,
  doctorId,
  stateId,
  scheduleName,
  list
) => {
  let searchList = list;
  if (searchList.length > 0) {
    if (shiftId) {
      searchList = searchList.filter((item) => item.Shift.Id === shiftId);
    }
    if (RoomId) {
      searchList = searchList.filter((item) => item.Room.Id === RoomId);
    }
    if (doctorId) {
      searchList = searchList.filter((item) => item.Employee.Id === doctorId);
    }
    if (stateId) {
      searchList = searchList.filter((item) => item.State === stateId);
    }
    if(!stateId){
      searchList = searchList.filter((item) => item.State === stateId);
    }
    if (scheduleName) {
      searchList = searchList.filter(
        (item) => item.ScheduleId === scheduleName
      );
    }
    return searchList;
  } else {
    return [];
  }
};
