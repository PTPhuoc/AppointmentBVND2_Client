const currentDate = new Date();

export const patientObject = {
  id: "",
  name: "",
  birth: {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  },
  gender: "",
  age: 0,
  ethnicity: "",
  nation: "",
  location: {
    city: "",
    cityCode: 0,
    district: "",
    districtCode: 0,
    ward: "",
    wardCode: 0,
  },
  typeRelatives: "",
  relatives: "",
  relativesPhone: 0,
};

export const listGender = [
  { gender: "Nam", id: 1 },
  { gender: "Nữ", id: 2 },
];

export const objectPatientOption = [
  { object: "Thu phí ", id: 1 },
  { object: "Bảo hiểm y tế", id: 2 },
  { object: "Bảo hiểm bảo lãnh", id: 3 },
  { object: "BHYT + BHBL", id: 4 },
];

export const objectRelatives = [
  { relatives: "Ba", id: 1 },
  { relatives: "Mẹ", id: 2 },
];

export const setPatientValue = (patient) => {
  const patientBirth = new Date(patient.Birth);
  const patientLocation = patient.Location.split(", ");
  return {
    id: patient.Id,
    name: patient.Name,
    birth: {
      day: patientBirth.getDate(),
      month: patientBirth.getMonth() + 1,
      year: patientBirth.getFullYear(),
    },
    gender: patient.Gender,
    age: patient.Age,
    ethnicity: patient.Ethnicity,
    nation: patient.Nation,
    location: {
      city: patientLocation[0],
      cityCode: 0,
      district: patientLocation[1],
      districtCode: 0,
      ward: patientLocation[2],
      wardCode: 0,
    },
    typeRelatives: patient.TypeRelatives,
    relatives: patient.Relatives,
    relativesPhone: patient.RelativesPhone,
  };
};

export const searchPatientByName = (list, value) => {
  if (value) {
    const searchObject = list.filter((item) =>
      item.Name.toLowerCase().includes(value.toLowerCase())
    );
    if (searchObject.length > 0) {
      return searchObject;
    } else {
      return [];
    }
  } else {
    return list;
  }
}

