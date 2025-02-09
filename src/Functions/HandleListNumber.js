import { getISOWeek } from "date-fns";
import { stringDay } from "./HandleDate";

const currentDate = new Date();

export const numberObject = {
  date: {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  },
  week: getISOWeek(currentDate),
  day: stringDay(currentDate.getDay()),
  priority: false,
  normal: false,
  register: false,
  cancel: false,
  search: null,
};

export const handleSearchNumber = (object, list) => {
  let handleList = [...list];
  if(object.priority){
    handleList = handleList.filter((item) => item.Priority === object.priority);
  }
  if(object.normal){
    handleList = handleList.filter((item) => item.Priority === !object.normal);
  }
  if (object.register) {
    handleList = handleList.filter((item) => item.State === "Đã đăng ký");
  }
  if (object.cancel) {
    handleList = handleList.filter((item) => item.State === "Đã hủy");
  }
  if (object.search) {
    const searchTerm = object.search.toLowerCase();
    handleList = handleList.filter(
      (item) =>
        item.Id.toLowerCase().includes(searchTerm) ||
        item.Patient.Name.toLowerCase().includes(searchTerm)
    );
  }

  return handleList;
};
