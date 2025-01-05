const currentDate = new Date();

export const appointmentObjetc = {
  id: "",
  patientId: "",
  object: "",
  referralPlace: "",
  referrer: "",
  company: false,
  checkMedical: "Lần đầu",
  require: false,
  paraclinical: false,
  priority: "",
  serviceName: "",
  serviceId: "",
  departmentId: "",
  doctor: "",
  doctorId: "",
  date: {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  },
};

export const appointmentLogic = {
  focusName: false,
  focusGender: false,
  focusAge: false,
  focusNation: false,
  focusEthnicity: false,
  focusLocation: false,
  focusCodeLocation: false,
  focusMarital: false,
  focusJob: false,
  focusObject: false,
  focusRelatives: false,
  focusRelativesPhone: false,
  focusReferralPlace: false,
  focusReferrer: false,
  focusPriority: false,
  focusService: false,
  focusDoctor: false,
  focusSearch: false,
};

export const requireList = {
  name: false,
  labelName: "Yêu cầu trường này",
  birth: false,
  labelBirth: "Tuổi phải từ 1 - 18t",
  gender: false,
  labelGender: "Hãy chọn 1",
  age: false,
  labelAge: "Tuổi phải từ 1 - 18t",
  nation: false,
  labelNation: "Hãy chọn 1",
  ethnicity: false,
  labelEthnicity: "Hãy chọn 1",
  location: false,
  labelLocation: "Hãy chọn đủ",
  codeLocation: false,
  labelCodeLocation: "Yêu cầu trường này",
  marital: false,
  labelMarital: "Hãy chọn 1",
  job: false,
  labelJob: "Hãy chọn 1",
  object: false,
  labelObject: "Hãy chọn 1",
  relatives: false,
  labelRelatives: "Yêu cầu trường này",
  relativesPhone: false,
  labelRelativesPhone: "Yêu cầu trường này",
  referralPlace: false,
  labelReferralPlace: "Hãy chọn 1",
  referrer: false,
  labelReferrer: "Yêu cầu trường này",
  priority: false,
  labelPriority: "Hãy chọn 1",
  serviceName: false,
  labelService: "Hãy chọn 1",
  doctor: false,
  labelDoctor: "Hãy chọn 1",
};

export const maritalOption = [
  { marital: "Độc thân", id: 1 },
  { marital: "Đã kết hôn", id: 2 },
];

export const objectOption = [
  { object: "Thu phí", id: 1 },
  { object: "Bảo hiểm y tế", id: 2 },
  { object: "Bảo hiểm bảo lãnh", id: 3 },
  { object: "BHYT + BHBL", id: 4 },
];

export const referalPlaceList = [
  { referralPlace: "Không có", id: 0 },
  { referralPlace: "Cơ quan y tế", id: 1 },
  { referralPlace: "Tự đến", id: 2 },
  { referralPlace: "Người nhà đưa đến", id: 3 },
  { referralPlace: "Công an đưa đến", id: 4 },
  { referralPlace: "Nhân dân đưa đến", id: 5 },
  { referralPlace: "Ứng dụng DROH", id: 6 },
];

export const priorityList = [
  { priority: "Trẻ em", id: 1 },
  { priority: "Tàn tật", id: 2 },
  { priority: "Người già", id: 3 },
  { priority: "Sơ sinh", id: 4 },
  { priority: "Hẹn khám", id: 5 },
];

export const insertDateAppointment = (patient, key, value) => {
  if (key === "day") {
    return {
      ...patient,
      appointment: { ...patient.appointment, [key]: checkDay(value, patient) },
    };
  } else if (key === "month") {
    return {
      ...patient,
      appointment: {
        ...patient.appointment,
        [key]: checkMonth(value, patient),
      },
    };
  } else {
    return {
      ...patient,
      appointment: { ...patient.appointment, [key]: checkYear(value, patient) },
    };
  }
};

const checkDay = (value, patient) => {
  if (value < 1) {
    return 1;
  } else if (value > 31) {
    return 31;
  } else {
    const newDate = new Date(
      patient.appointment.year,
      patient.appointment.month - 1,
      value
    );

    return newDate.getDate();
  }
};

const checkMonth = (value, patient) => {
  if (value < 1) {
    return 1;
  } else if (value > 12) {
    return 12;
  } else {
    const newDate = new Date(
      patient.appointment.year,
      value - 1,
      patient.appointment.day
    );
    return newDate.getMonth() + 1;
  }
};

const checkYear = (value, patient) => {
  if (value < 1950) {
    return 1950;
  } else if (value > currentDate.getFullYear()) {
    return currentDate.getFullYear();
  } else {
    const newDate = new Date(
      value,
      patient.appointment.month - 1,
      patient.appointment.day
    );

    return newDate.getFullYear();
  }
};

export const handleDatePickerAppointment = (date, appointment) => {
  return {
    ...appointment,
    date: {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    },
  };
};

export const checkKey = (object, requireInput, setRequireInput) => {
  const currentDate = new Date();
  const skipKey = [
    "referralPlace",
    "referrer",
    "codeLocation",
    "marital",
    "id",
    "require",
    "paraclinical",
    "company",
    "doctor",
  ];
  let updatedRequireInput = { ...requireList };
  let isSuccess = true;

  for (const key in object) {
    if (key === "birth") {
      const Age = currentDate.getFullYear() - object.birth.year;
      if (Age > 18 || Age < 1) {
        updatedRequireInput.birth = true;
        updatedRequireInput.age = true;
        isSuccess = false;
      }
    } else if (key === "location") {
      if (
        !object.location.city ||
        !object.location.district ||
        !object.location.ward
      ) {
        updatedRequireInput.location = true;
        isSuccess = false;
      }
    } else if (!skipKey.includes(key)) {
      if (!object[key]) {
        updatedRequireInput[key] = true;
        isSuccess = false;
      }
    } else {
      continue;
    }
  }
  setRequireInput({ ...requireInput, ...updatedRequireInput }); // Cập nhật lại state
  return isSuccess;
};

export const searchAppointment = (list, name, option) => {
  if (name) {
    const searchByName = list.filter((item) =>
      item.Patient.Name.toLowerCase().includes(name.toLowerCase())
    );
    const searchById = list.filter((item) => item.Id === name);
    const searchByPhone = list.filter(
      (item) => item.Patient.RelativesPhone === name
    );
    let allList = [...searchByName, ...searchById, ...searchByPhone];
    if (option.registered) {
      return allList.filter((item) => item.State === "Đã đăng ký");
    } else if (option.notRegistered) {
      return allList.filter((item) => item.State === "Chưa đăng ký");
    } else if (option.canceled) {
      return allList.filter((item) => item.State === "Đã hủy");
    } else {
      return allList;
    }
  } else {
    if (option.registered) {
      return list.filter((item) => item.State === "Đã đăng ký");
    } else if (option.notRegistered) {
      return list.filter((item) => item.State === "Chưa đăng ký");
    } else if (option.canceled) {
      return list.filter((item) => item.State === "Đã hủy");
    } else {
      return list;
    }
  }
};

export const setAppointmentValue = (appointments) => {
  return {
    id: appointments.State === "Đã hủy" ? "" : appointments.Id,
    patientId: appointments.PatientId,
    object: appointments.Object,
    referralPlace: appointments.ReferralPlace,
    referrer: appointments.Referrer,
    company: appointments.Company,
    checkMedical: "Lần đầu",
    require: appointments.Require,
    paraclinical: appointments.Paraclinical,
    priority: appointments.Priority,
    serviceName: appointments.Service
      ? appointments.Service.Name
        ? appointments.Service.Name
        : null
      : null,
    departmentId: appointments.Service
    ? appointments.Service.DepartmentId
      ? appointments.Service.DepartmentId
      : null
    : null,
    doctor: appointments.Doctor ? appointments.Doctor : null,
    serviceId: appointments.Service
      ? appointments.Service.Id
        ? appointments.Service.Id
        : null
      : null,
    doctorId: appointments.DoctorId ? appointments.DoctorId : null,
  };
};

export const covertTime = (time) => {
  const setDate = new Date(time);
  return (
    setDate.getUTCHours().toString().padStart(2, "0") +
    ":" +
    setDate.getUTCMinutes().toString().padStart(2, "0")
  );
};
