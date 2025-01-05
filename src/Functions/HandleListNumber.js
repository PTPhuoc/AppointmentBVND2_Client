import { converToCurrentDate } from "./HandleSelectSchedule";

export const searchObject = {
  search: "",
  shift: "",
};

export const focusInput = {
  search: false,
  shift: false,
};

export const handleSearch = (list, name, time, option) => {
  if (name) {
    const searchByDoctor = list.filter((item) =>
      item.Doctor.toLowerCase().includes(name.toLowerCase())
    );

    const searchByService = list.filter((item) =>
      item.ServiceName.toLowerCase().includes(name.toLowerCase())
    );
    
    let allList = [...searchByDoctor, ...searchByService];

    allList = allList.filter(
      (item, index, self) => self.findIndex(obj => obj.Id === item.Id) === index
    );

    if (time) {
      allList = allList.filter(
        (item) => converToCurrentDate(new Date(item.Time)) <= converToCurrentDate(new Date(time))
      );
    }

    if (option.register) {
      return allList.filter((item) => item.State === "Đã đăng ký");
    } else if (option.notRegister) {
      return allList.filter((item) => item.State === "Chưa đăng ký");
    } else if (option.cancel) {
      return allList.filter((item) => item.State === "Đã hủy");
    } else {
      return allList;
    }
  } else {
    let allList = list;
    if (time) {
      allList = allList.filter(
        (item) => converToCurrentDate(new Date(item.Time)) <= converToCurrentDate(new Date(time))
      );
    }

    if (option.register) {
      return allList.filter((item) => item.State === "Đã đăng ký");
    } else if (option.notRegister) {
      return allList.filter((item) => item.State === "Chưa đăng ký");
    } else if (option.cancel) {
      return allList.filter((item) => item.State === "Đã hủy");
    } else {
      return allList;
    }
  }
};
