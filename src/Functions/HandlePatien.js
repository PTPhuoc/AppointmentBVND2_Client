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
  job: "",
  location: {
    city: "",
    cityCode: 0,
    district: "",
    districtCode: 0,
    ward: "",
    wardCode: 0,
  },
  codeLocation: "",
  marital: "",
  relatives: "",
  relativesPhone: 0,
};

export const setPatientValue = (patient) => {
  const patientBirth = new Date(patient.Birth);
  const patientLocation = patient.Location.split(",");
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
    job: patient.Job,
    location: {
      city: patientLocation[0],
      cityCode: 0,
      district: patientLocation[1],
      districtCode: 0,
      ward: patientLocation[2],
      wardCode: 0,
    },
    codeLocation: patient.CodeLocation,
    marital: patient.Marital,
    relatives: patient.Relatives,
    relativesPhone: patient.RelativesPhone,
  };
};
