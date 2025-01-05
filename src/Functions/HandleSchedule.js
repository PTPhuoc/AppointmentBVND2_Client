import { getISOWeek } from "date-fns";
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

export const stringDay = (value) => {
  const day = listDay.find((items) => items.id === value);
  return day.day;
};

export const scheduleObject = {
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
  room: "",
  roomId: "",
  department: "",
  departmentId: "",
  doctor: "",
  doctorId: "",
  state: "Mở",
  stateId: 1,
};

export const duplicate = {
  week: 0,
  day: "",
  date: {
    day: 0,
    month: 0,
    year: 0,
  },
};

export const scheduleLogic = {
  focusWeek: false,
  focusDay: false,
  focusRoom: false,
  focusShift: false,
  focusDocTor: false,
  focusState: false,
};

export const listState = [
  { state: "Mở", id: 1 },
  { state: "Đóng", id: 0 },
];

export const intDay = (value) => {
  const day = listDay.find((items) => items.day === value);
  return day.id;
};

export const handleList = (list, value) => {
  if (value) {
    const filter = list.filter((item) =>
      item.Name.toLowerCase().includes(value.toLowerCase())
    );
    if (filter.length > 0) {
      return filter;
    } else {
      return [];
    }
  } else {
    return list;
  }
};

export const formatDate = (eachDate) => {
  const convertDate = new Date(eachDate);
  return (
    convertDate.getDate() +
    "/" +
    (convertDate.getMonth() + 1) +
    "/" +
    convertDate.getFullYear()
  );
};
