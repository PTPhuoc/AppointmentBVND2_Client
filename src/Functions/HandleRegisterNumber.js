const currentDate = new Date();

export const patientInfor = {
  name: "",
  birth: {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  },
  gender: "",
  age: 0,
  ethnicity: "",
  location: {
    city: "",
    cityCode: 0,
    district: "",
    districtCode: 0,
    ward: "",
    wardCode: 0,
  },
  currentLocation: {
    city: "",
    cityCode: 0,
    district: "",
    districtCode: 0,
    ward: "",
    wardCode: 0,
  },
  motherName: "",
  motherPhone: 0,
  fatherName: "",
  fatherPhone: 0,
  cccd: 0,
};

export const vitalSignsInfor = {
  width: 0,
  height: 0,
  temperature: 0,
  pluse: 0,
};

export const insuranceInfor = {
  type: "",
  code: 0,
  numberCard: 0,
  to: { day: 0, month: 0, year: 0 },
  from: { day: 0, month: 0, year: 0 },
  interest: 0,
  zone: 0,
};

export const Zone = [{ value: 1 }, { value: 2 }, { value: 3 }];

export const typeInsurance = [
  { type: "Thái phép", id: "TP" },
  { type: "Chạy thận", id: "CT" },
  { type: "Chậm tăng trưởng", id: "GH" },
  { type: "Bảo hiểm", id: "BH" },
  { type: "Bệnh về máu", id: "UM" },
  { type: "HIV", id: "HI" },
  { type: "Miển phí", id: "MP" },
];

export const patientLogic = {
  focusName: false,
  focusGender: false,
  focusAge: false,
  focusEthnicity: false,
  focusLocation: false,
  focusCurrentLocation: false,
  focusMothername: false,
  focusMotherPhone: false,
  focusFatherName: false,
  focusFatherPhone: false,
  focusCccd: false,
  focusSelectDate: false,
  focusWith: false,
  focusHeignt: false,
  focusTemperature: false,
  focusPluse: false,
  focusRespiration: false,
  focusType: false,
  focusCode: false,
  focusNumberCard: false,
  focusInterest: false,
  focusZone: false,
};

export const genderList = [
  { gender: "Nam", id: 1 },
  { gender: "Nữ", id: 2 },
];

export const insertDate = (insuranceInfor, key, transfer, value, overYear) => {
  if (key === "day" && transfer in insuranceInfor) {
    return {
      ...insuranceInfor,
      [transfer]: {
        ...insuranceInfor[transfer],
        day: checkDay(value, transfer, insuranceInfor, overYear),
      },
    };
  } else if (key === "month" && transfer in insuranceInfor) {
    return {
      ...insuranceInfor,
      [transfer]: {
        ...insuranceInfor[transfer],
        month: checkMonth(value, transfer, insuranceInfor),
      },
    };
  } else {
    return overYear
      ? value < 1950
        ? {
            ...insuranceInfor,
            [transfer]: { ...insuranceInfor[transfer], year: 1950 },
            age: currentDate.getFullYear() - value,
          }
        : {
            ...insuranceInfor,
            [transfer]: { ...insuranceInfor[transfer], year: value },
            age: currentDate.getFullYear() - value,
          }
      : {
          ...insuranceInfor,
          [transfer]: {
            ...insuranceInfor[transfer],
            year: checkYear(value, transfer, insuranceInfor),
          },
          age: currentDate.getFullYear() - value,
        };
  }
};

const checkDay = (value, transfer, patient, overYear) => {
  if (value < 1) {
    return 1;
  } else if (value > 31) {
    return 31;
  } else if (overYear) {
    return value;
  } else {
    const newDate = compareDate(
      new Date(patient[transfer].year, patient[transfer].month - 1, value)
    );
    return newDate.getDate();
  }
};

const checkMonth = (value, transfer, patient, overYear) => {
  if (value < 1) {
    return 1;
  } else if (value > 12) {
    return 12;
  } else if (overYear) {
    return value;
  } else {
    const newDate = compareDate(
      new Date(patient[transfer].year, value - 1, patient[transfer].day)
    );
    return newDate.getMonth() + 1;
  }
};

const checkYear = (value, transfer, patient) => {
  if (value < 1950) {
    return 1950;
  } else if (value > currentDate.getFullYear()) {
    return currentDate.getFullYear();
  } else {
    const newDate = compareDate(
      new Date(value, patient[transfer].month - 1, patient[transfer].day)
    );
    return newDate.getFullYear();
  }
};

const compareDate = (date) => {
  const newDate = new Date(date);
  if (newDate.getTime() > currentDate.getTime()) {
    return currentDate;
  } else {
    return newDate;
  }
};

export const handleDatePicker = (patient, transfer, date) => {
  const newDate = new Date(date);
  if (newDate.getTime() > currentDate.getTime()) {
    return {
      ...patient,
      [transfer]: {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      },
      age: 0,
    };
  } else {
    return {
      ...patient,
      [transfer]: {
        day: newDate.getDate(),
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear(),
      },
      age: currentDate.getFullYear() - newDate.getFullYear(),
    };
  }
};

export const handleDateInsurance = (insurance, date, transfer) => {
  const newDate = new Date(date);
  return {
    ...insurance,
    [transfer]: {
      day: newDate.getDate(),
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    },
  };
};
