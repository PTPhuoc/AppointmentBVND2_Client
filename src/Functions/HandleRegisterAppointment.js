const currentDate = new Date();

export const appointmentObject = {
  id: "",
  patientId: "",
  patientName: "",
  note: "",
  object: "",
  priority: false,
  departmentId: "",
  doctorId: "",
  doctorRoomId: "",
  number: 0,
  time: "",
  date: {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  },
};

export const objectAppointmentOption = [
  { object: "Thu phí ", id: 1 },
  { object: "Bảo hiểm y tế", id: 2 },
  { object: "Bảo hiểm bảo lãnh", id: 3 },
  { object: "BHYT + BHBL", id: 4 },
];

export const insertPatientAppointment = (object) => {
  const dateSelect = new Date(object.Date);
  return {
    id: object.Id,
    patientId: object.Patient.Id,
    patientName: object.Patient.Name,
    doctorId: object.Employee ? object.Employee.Id : null,
    object: object.Object ? object.Object : null,
    note: object.Note ? object.Note : null,
    time: object.Time ? object.Time : null,
    priority: object.Priority,
    number: 0,
    doctorRoomId: object.DoctorRoomId ? object.DoctorRoomId : null,
    date: {
      day: dateSelect.getDate(),
      month: dateSelect.getMonth() + 1,
      year: dateSelect.getFullYear(),
    },
    dateString:
      String(dateSelect.getDate()).padStart(2, "0") +
      "/" +
      String(dateSelect.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(dateSelect.getFullYear()).padStart(2, "0"),
  };
};

export const handleSearchAppointment = (object, listAppointment) => {
  if (object.text) {
    const lowerValue = object.text.toLowerCase();
    let listSearch = listAppointment.filter(
      (item) =>
        item.Id.toLowerCase().includes(lowerValue) ||
        item.Patient.Name.toLowerCase().includes(lowerValue)
    );
    if (object.registed) {
      listSearch = listSearch.filter((item) => item.State === "Đã đăng ký");
    }
    if (object.cancel) {
      listSearch = listSearch.filter((item) => item.State === "Đã hủy");
    }
    return listSearch;
  } else {
    let listSearch = listAppointment;
    if (object.registed) {
      listSearch = listSearch.filter((item) => item.State === "Đã đăng ký");
    }
    if (object.cancel) {
      listSearch = listSearch.filter((item) => item.State === "Đã hủy");
    }
    return listSearch;
  }
};
