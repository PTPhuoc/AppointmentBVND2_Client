import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {
  appointmentObjetc,
  appointmentLogic,
  maritalOption,
  objectOption,
  referalPlaceList,
  priorityList,
  insertDateAppointment,
  handleDatePickerAppointment,
  requireList,
  checkKey,
  searchAppointment,
  setAppointmentValue,
  covertTime,
} from "../Functions/HandleAppointment";
import {
  patientObject,
  setPatientValue,
  searchPatientByName,
} from "../Functions/HandlePatien";
import { genderList } from "../Functions/HandleRegisterNumber";
import Ethnicity from "../Json/Ethnicity.json";
import CityList from "../Json/Citys.json";
import DistrictList from "../Json/Districts.json";
import WardList from "../Json/Wards.json";
import Job from "../Json/Job.json";
import Nation from "../Json/Nation.json";
import Loader from "./Loader";
import InputDefault from "./InputDefault";
import InputDate from "./InputDate";
import InputList from "./InputList";
import { userContext } from "../Context/User";

export default function Appointment() {
  const currentContext = useContext(userContext);
  const [patient, setPatient] = useState(patientObject);
  const [appointment, setAppointment] = useState(appointmentObjetc);
  const [isFocusInput, setIsFocusInput] = useState(appointmentLogic);
  const [isSelectDate, setIsSelectDate] = useState({
    patient: false,
    appointment: false,
  });
  const [isOpenSelectDate, setIsOpenSelectDate] = useState({
    appointment: false,
  });
  const [listLocation, setListLocation] = useState(CityList);
  const [listService, setListService] = useState([]);
  const [listEmployee, setListEmployee] = useState([]);
  const [listAppointment, setListAppointment] = useState([]);
  const [listPatient, setListPatient] = useState([]);
  const [appointmentInfor, setAppointmentInfor] = useState({
    search: "",
    id: "",
    notRegistered: false,
    registered: false,
    canceled: false,
  });
  const [requireInput, setRequireInput] = useState(requireList);
  const [isWait, setIsWait] = useState({
    currentPage: true,
    listAppointment: true,
  });
  const currentDate = new Date();

  const saveLocation = (
    key,
    city,
    cityCode,
    district,
    districtCode,
    ward,
    wardCode
  ) => {
    if (city) {
      setPatient({
        ...patient,
        [key]: { ...patient[key], city: city, cityCode: cityCode },
      });
    } else if (district) {
      setPatient({
        ...patient,
        [key]: {
          ...patient[key],
          district: district,
          districtCode: districtCode,
        },
      });
    } else {
      setPatient({
        ...patient,
        [key]: { ...patient[key], ward: ward, wardCode: wardCode },
      });
    }
  };

  const selectLocationList = (cityCode, districtCode, wardCode) => {
    if (districtCode === 0) {
      return DistrictList.filter((items) => items.cityCode === cityCode);
    } else if (wardCode === 0) {
      return WardList.filter((items) => items.districtCode === districtCode);
    } else {
      return CityList;
    }
  };

  const handleInputPatient = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleInputAppointment = (e) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleInputSearch = (e) => {
    const { name, value } = e.target;
    setAppointmentInfor({ ...appointmentInfor, [name]: value });
  };

  const handleInputDateAppointment = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      appointment: { ...patient.appointment, [name]: value },
    });
  };

  const changeDateAppointment = (value) => {
    const dateAppointment = new Date(
      appointment.date.year,
      appointment.date.month - 1,
      appointment.date.day
    );
    dateAppointment.setDate(dateAppointment.getDate() + value);
    setAppointment({
      ...appointment,
      date: {
        day: dateAppointment.getDate(),
        month: dateAppointment.getMonth() + 1,
        year: dateAppointment.getFullYear(),
      },
    });
  };

  const inputRefs = useRef({});

  const focusInput = (name) => {
    inputRefs.current[name].click();
    inputRefs.current[name].focus();
  };

  const getServices = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/service/get-service")
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListService(rs.data.Services);
        } else {
          setListService([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPatient = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/patient/all-patient")
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListPatient(rs.data.Patients);
          console.log(rs.data.Patients);
        } else {
          setListPatient([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getEmployee = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/employee/get-type-employee", {
        params: { type: "Bác sĩ" },
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListEmployee(rs.data.Employees);
        } else {
          setListEmployee([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAppointment = () => {
    const dateAppointment = new Date(
      appointment.date.year,
      appointment.date.month - 1,
      appointment.date.day
    );
    axios
      .get(process.env.REACT_APP_API_URL + "/appointment/get-appointment", {
        params: { date: dateAppointment },
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListAppointment(rs.data.Appointments);
          setIsWait({ ...isWait, listAppointment: false });
        } else {
          setListAppointment([]);
          setIsWait({ ...isWait, listAppointment: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formatPrice = (value) => {
    const format = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return format.format(value);
  };

  const navigate = useNavigate();

  const getInfor = (appointments) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/patient/one-patient", {
        params: { id: appointments.PatientId },
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setPatient(setPatientValue(rs.data.Patients));
          setAppointment({
            ...appointment,
            ...setAppointmentValue(appointments),
          });
          if (appointments.State !== "Đã hủy") {
            currentContext.setNotification({
              ...currentContext.notification,
              isOpen: true,
              for: "GetData",
              content:
                "Bạn đang chỉnh sửa lịch hẹn của " + rs.data.Patients.Name,
              option: "N",
            });
          }
          const saveData = {
            patient: { ...setPatientValue(rs.data.Patients) },
            appointment: {
              ...appointment,
              ...setAppointmentValue(appointments),
            },
          };
          window.localStorage.setItem("CurrentData", JSON.stringify(saveData));
          window.scrollTo({
            top: 0,
            behavior: "smooth", // Thêm hiệu ứng mượt mà
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAppointment = () => {
    if (checkKey(patient, requireInput, setRequireInput)) {
      const datePatient = new Date(
        patient.birth.year,
        patient.birth.month - 1,
        patient.birth.day
      );
      const dateAppointment = new Date(
        appointment.date.year,
        appointment.date.month - 1,
        appointment.date.day
      );
      const selectLocation =
        patient.location.city +
        ", " +
        patient.location.district +
        ", " +
        patient.location.ward;

      axios
        .post(process.env.REACT_APP_API_URL + "/patient/save-patient", {
          ...patient,
          birth: datePatient,
          location: selectLocation,
        })
        .then((rs1) => {
          if (rs1.data.Status === "Success") {
            axios
              .post(
                process.env.REACT_APP_API_URL + "/appointment/save-appointment",
                {
                  ...appointment,
                  date: dateAppointment,
                  status: "Chưa đăng ký",
                  patientId: rs1.data.Patient.Id,
                  serviceId: appointment.serviceId
                    ? appointment.serviceId
                    : null,
                  doctorId: appointment.doctorId ? appointment.doctorId : null,
                }
              )
              .then((rs2) => {
                if (rs2.data.Status === "Success") {
                  const currentData = JSON.stringify({
                    patient: { ...patient, id: rs1.data.Patient.Id },
                    appointment: { ...appointment, id: rs2.data.AppointmentId },
                  });
                  window.localStorage.setItem("CurrentData", currentData);
                  navigate("/select-schedule");
                } else {
                  alert(rs2.data.Message.name);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            alert(rs1.data.Message.name);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSave = () => {
    const allData = {
      patient: { ...patient },
      appointment: { ...appointment },
    };
    const stringObject = JSON.stringify(allData);
    window.localStorage.setItem("CurrentData", stringObject);
  };

  const formatDate = (date) => {
    const fDate = new Date(date);
    return (
      fDate.getDate() + "/" + (fDate.getMonth() + 1) + "/" + fDate.getFullYear()
    );
  };

  const handleCancel = (appointments) => {
    currentContext.setWindowWarning({
      ...currentContext.windowWarning,
      for: "CancelApointment",
      isOpen: true,
      content: "Bạn có chắc muốn hủy hẹn của " + appointments.Patient.Name,
      handle: "pending",
    });
  };

  const reRegister = (appointments) => {
    const dateAppointment = new Date(
      appointment.date.year,
      appointment.date.month - 1,
      appointment.date.day
    );
    axios
      .post(process.env.REACT_APP_API_URL + "/appointment/save-appointment", {
        ...appointment,
        ...setAppointmentValue(appointments),
        date: dateAppointment,
        status: "Chưa đăng ký",
        patientId: appointments.Patient.Id,
      })
      .then((rs1) => {
        if (rs1.data.Status === "Success") {
          axios
            .get(process.env.REACT_APP_API_URL + "/patient/one-patient", {
              params: { id: appointments.PatientId },
            })
            .then((rs) => {
              if (rs.data.Status === "Success") {
                const saveData = {
                  patient: { ...setPatientValue(rs.data.Patients) },
                  appointment: {
                    ...appointment,
                    ...setAppointmentValue(appointments),
                    id: rs1.data.AppointmentId,
                  },
                };
                console.log(saveData);
                window.localStorage.setItem(
                  "CurrentData",
                  JSON.stringify(saveData)
                );
                navigate("/select-schedule");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          alert(rs1.data.Message.name);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (window.localStorage.getItem("Name")) {
      if (!currentContext.Account.id) {
        currentContext.setNotification({
          ...currentContext.notification,
          isOpen: true,
          for: "RePageMain",
          content: "Thực hiện đăng nhập để tiếp tục",
          option: "N",
        });
        navigate("/signin");
      } else {
        getServices();
        getEmployee();
        getPatient();
        if (window.localStorage.getItem("CurrentData")) {
          const patientLocalStorage = JSON.parse(
            window.localStorage.getItem("CurrentData")
          );
          if (patientLocalStorage.patient.name !== patient.name) {
            currentContext.setNotification({
              ...currentContext.notification,
              isOpen: true,
              for: "GetOldData",
              content: "Dùng thông tin của " + patientLocalStorage.patient.name,
              option: "YorN",
            });
          }
        }
      }
    } else {
      currentContext.setNotification({
        ...currentContext.notification,
        isOpen: true,
        for: "RePageMain",
        content: "Thực hiện đăng nhập để tiếp tục",
        option: "N",
      });
      navigate("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getAppointment();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment.date]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.localStorage.getItem("CurrentData")) {
        const patientLocalStorage = JSON.parse(
          window.localStorage.getItem("CurrentData")
        );
        if (patientLocalStorage.patient.name !== patient.name) {
          setPatient({ ...patient, id: "" });
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.name]);

  useEffect(() => {
    if (currentContext.notification.for === "GetOldData") {
      if (currentContext.notification.handle === "Success") {
        const patientLocalStorage = JSON.parse(
          window.localStorage.getItem("CurrentData")
        );
        setPatient(patientLocalStorage.patient);
        currentContext.setNotification({
          ...currentContext,
          isOpen: false,
          handle: "pending",
        });
      } else if (currentContext.notification.handle === "Fault") {
        currentContext.setNotification({
          ...currentContext,
          isOpen: false,
          handle: "pending",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContext.notification.handle]);

  useEffect(() => {
    if (currentContext.windowWarning.handle === "Success") {
      if (currentContext.windowWarning.for === "CancelApointment") {
        axios
          .post(
            process.env.REACT_APP_API_URL + "/appointment/cancel-appointment",
            { id: appointmentInfor.id }
          )
          .then((rs) => {
            if (rs.data.Status === "Success") {
              currentContext.setNotification({
                ...currentContext.notification,
                isOpen: true,
                for: "CancelData",
                content: "Hủy hẹn thành công",
                option: "N",
              });
              getAppointment();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContext.windowWarning.handle]);

  useEffect(() => {
    const { cityCode, districtCode, wardCode } = patient.location;
    if (cityCode || districtCode || wardCode) {
      // Gọi selectLocationList với các tham số từ state
      const updatedList = selectLocationList(cityCode, districtCode, wardCode);
      setListLocation(updatedList);
    } else {
      setListLocation(CityList); // Nếu không có gì, trả về danh sách thành phố
    }
  }, [patient.location]);

  return (
    <div
      className="w-full h-full flex flex-col items-center gap-5 pb-5"
      onClick={() => setIsFocusInput(appointmentLogic)}
    >
      <div className="w-full h-full justify-center flex flex-wrap pt-5 gap-5">
        <div className="flex flex-col items-center w-[45%] min-w-[850px] border-2 border-[#005121] rounded-3xl gap-5 py-5 bg-white">
          <div>
            <p className="text-[#005121] text-[25px]">THÔNG TIN</p>
          </div>
          <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
          <div className="relative w-[80%] z-[9]">
            <input
              name="name"
              ref={(el) => (inputRefs.current["name"] = el)}
              value={patient.name}
              onFocus={() => {
                setIsFocusInput({ ...appointmentLogic, focusName: true });
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={handleInputPatient}
              className={
                "w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear " +
                (requireInput.name ? "border-red-400" : "border-[#005121]")
              }
              type="text"
            />
            {requireInput.name && (
              <div className="absolute top-0 right-0 mr-3 -translate-y-4 bg-red-500 text-white px-1 rounded-md">
                <p className="text-[15px]">{requireInput.labelName}</p>
              </div>
            )}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...appointmentLogic, focusName: true });
                focusInput("name");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.name || isFocusInput.focusName
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Tên bệnh nhân</p>
            </div>
            <div
              className={
                "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                (isFocusInput.focusName ? "max-h-[150px] pt-5" : "max-h-0")
              }
            >
              {searchPatientByName(listPatient, patient.name).length > 0 ? (
                searchPatientByName(listPatient, patient.name).map((el) => (
                  <div className="w-full">
                    <button
                      onClick={() => {
                        setPatient(setPatientValue(el));
                      }}
                      className="bg-white w-full py-2 text-[#005121] duration-200 ease-linear hover:bg-[#00BA4B] hover:text-white"
                    >
                      {el.Name + " - " + el.RelativesPhone}
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white w-full py-2 text-[#005121] duration-200 ease-linear ">
                  <p className="w-full text-center">Trống</p>
                </div>
              )}
            </div>
          </div>
          <InputDate
            key={2}
            className={
              "relative z-[8] flex items-center w-[80%] border-2 rounded-lg px-5 py-2 " +
              (requireInput.birth ? "border-red-400" : "border-[#005121]")
            }
            lable={"Ngày sinh"}
            keyObject={"birth"}
            object={patient}
            setObject={setPatient}
            handleLogic={setIsSelectDate}
            logic={isSelectDate}
            keyLogic={"patient"}
            overYear={false}
            inputRequire={requireInput.birth}
            lableRequire={requireInput.labelBirth}
          />
          <InputList
            key={3}
            className={"relative w-[80%] z-[7]"}
            inputRefs={inputRefs}
            lable={"Giới tính"}
            handleRef={focusInput}
            object={patient}
            keyObject={"gender"}
            setObject={setPatient}
            logic={isFocusInput}
            keyLogic={"forcusGender"}
            handleLogic={setIsFocusInput}
            objectLogic={appointmentLogic}
            listSelect={genderList}
            inputRequire={requireInput.gender}
            lableRequire={requireInput.labelGender}
          />
          <InputDefault
            key={4}
            className={"relative w-[80%]"}
            lable={"Tuổi"}
            type={"number"}
            name={"age"}
            inputRefs={inputRefs}
            handleRef={focusInput}
            object={patient}
            handleObject={handleInputPatient}
            handleLogic={setIsFocusInput}
            logic={isFocusInput}
            keyLogic={"focusAge"}
            objectLogic={appointmentLogic}
            inputRequire={requireInput.age}
            lableRequire={requireInput.labelAge}
          />
          <InputList
            className={"relative w-[80%] z-[6]"}
            lable={"Dân tộc"}
            inputRefs={inputRefs}
            handleRef={focusInput}
            object={patient}
            keyObject={"ethnicity"}
            setObject={setPatient}
            logic={isFocusInput}
            keyLogic={"focusEthnicity"}
            handleLogic={setIsFocusInput}
            objectLogic={appointmentLogic}
            listSelect={Ethnicity}
            inputRequire={requireInput.ethnicity}
            lableRequire={requireInput.labelEthnicity}
          />

          <div className="relative w-[80%] z-[5]">
            <input
              ref={(el) => (inputRefs.current["location"] = el)}
              name="location"
              value={
                patient.location.city +
                (patient.location.district &&
                  ", " + patient.location.district) +
                (patient.location.ward && ", " + patient.location.ward)
              }
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...appointmentLogic, focusLocation: true });
              }}
              className={
                "w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear " +
                (requireInput.location ? "border-red-400" : "border-[#005121]")
              }
              type="text"
            />
            {requireInput.location && (
              <div className="absolute top-0 right-0 mr-3 -translate-y-4 bg-red-500 text-white px-1  rounded-md">
                <p className="text-[15px]">{requireInput.labelLocation}</p>
              </div>
            )}
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("location");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.location.city ||
                patient.location.district ||
                patient.location.ward ||
                isFocusInput.focusLocation
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Địa chỉ</p>
            </div>
            <div
              className={
                "absolute flex items-center h-full mr-5 top-0 right-0 " +
                (!patient.location.city && "hidden")
              }
            >
              <div className="w-[30px] h-[30px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPatient({
                      ...patient,
                      location: {
                        city: "",
                        cityCode: 0,
                        district: "",
                        districtCode: 0,
                        ward: "",
                        wardCode: 0,
                      },
                    });
                  }}
                  className="w-[30px] h-[30px] bg-white"
                >
                  <svg
                    className="w-[30px] h-[30px] fill-slate-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
            </div>
            <div
              className={
                "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                (isFocusInput.focusLocation && !patient.location.ward
                  ? "max-h-[150px] pt-5"
                  : "max-h-0")
              }
            >
              {listLocation.map((el) => (
                <div className="w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveLocation(
                        "location",
                        el.city,
                        el.cityCode,
                        el.district,
                        el.districtCode,
                        el.ward,
                        el.wardCode
                      );
                      el.ward &&
                        setIsFocusInput({
                          ...isFocusInput,
                          focusLocation: false,
                        });
                    }}
                    className="w-full text-center pl-5 py-2 bg-white duration-200 ease-linear hover:bg-slate-500 hover:text-white"
                  >
                    {el.city ? el.city : el.district ? el.district : el.ward}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <InputDefault
            className={"relative w-[80%]"}
            lable={"Mã địa bàn"}
            type={"text"}
            name={"codeLocation"}
            inputRefs={inputRefs}
            handleRef={focusInput}
            object={patient}
            handleObject={handleInputPatient}
            logic={isFocusInput}
            keyLogic={"focusCodeLocation"}
            handleLogic={setIsFocusInput}
            objectLogic={appointmentLogic}
            inputRequire={requireInput.codeLocation}
            lableRequire={requireInput.labelCodeLocation}
          />
          <InputList
            className={"relative w-[80%] z-[4]"}
            lable={"Tình trạng hôn nhân"}
            inputRefs={inputRefs}
            handleRef={focusInput}
            object={patient}
            keyObject={"marital"}
            setObject={setPatient}
            logic={isFocusInput}
            keyLogic={"focusMarital"}
            handleLogic={setIsFocusInput}
            objectLogic={appointmentLogic}
            listSelect={maritalOption}
            inputRequire={requireInput.marital}
            lableRequire={requireInput.labelMarital}
          />
          <InputList
            className={"relative w-[80%] z-[3]"}
            lable={"Đối tượng"}
            inputRefs={inputRefs}
            handleRef={focusInput}
            object={appointment}
            keyObject={"object"}
            setObject={setAppointment}
            logic={isFocusInput}
            keyLogic={"focusObject"}
            handleLogic={setIsFocusInput}
            objectLogic={appointmentLogic}
            listSelect={objectOption}
            inputRequire={requireInput.object}
            lableRequire={requireInput.labelObject}
          />
          <InputList
            className={"relative w-[80%] z-[2]"}
            lable={"Nghề nghiệp"}
            inputRefs={inputRefs}
            handleRef={focusInput}
            object={patient}
            keyObject={"job"}
            setObject={setPatient}
            logic={isFocusInput}
            keyLogic={"focusJob"}
            handleLogic={setIsFocusInput}
            objectLogic={appointmentLogic}
            listSelect={Job}
            inputRequire={requireInput.job}
            lableRequire={requireInput.labelJob}
          />
          <InputList
            className={"relative w-[80%] z-[1]"}
            lable={"Quốc tịch"}
            inputRefs={inputRefs}
            handleRef={focusInput}
            object={patient}
            keyObject={"nation"}
            setObject={setPatient}
            logic={isFocusInput}
            keyLogic={"focusNation"}
            handleLogic={setIsFocusInput}
            objectLogic={appointmentLogic}
            listSelect={Nation}
            inputRequire={requireInput.nation}
            lableRequire={requireInput.labelNation}
          />
          <InputDefault
            className={"relative w-[80%]"}
            lable={"Tên thân nhân"}
            type={"text"}
            name={"relatives"}
            inputRefs={inputRefs}
            handleRef={focusInput}
            object={patient}
            handleObject={handleInputPatient}
            logic={isFocusInput}
            keyLogic={"focusRelatives"}
            handleLogic={setIsFocusInput}
            objectLogic={appointmentLogic}
            inputRequire={requireInput.relatives}
            lableRequire={requireInput.labelRelatives}
          />
          <InputDefault
            className={"relative w-[80%]"}
            lable={"SDT thân nhân"}
            type={"number"}
            name={"relativesPhone"}
            inputRefs={inputRefs}
            handleRef={focusInput}
            object={patient}
            handleObject={handleInputPatient}
            logic={isFocusInput}
            keyLogic={"focusRelativesPhone"}
            handleLogic={setIsFocusInput}
            objectLogic={appointmentLogic}
            inputRequire={requireInput.relativesPhone}
            lableRequire={requireInput.labelRelativesPhone}
          />
        </div>
        <div className="flex flex-col flex-wrap items-center gap-5">
          <div className="flex flex-col items-center w-[45%] min-w-[850px] border-2 border-[#005121] rounded-3xl gap-5 py-5 bg-white">
            <div>
              <p className="text-[#005121] text-[25px]">
                NƠI GIỚI THIỆU/DOANH NGHIỆP HỢP TÁC
              </p>
            </div>
            <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
            <InputList
              className={"relative w-[80%] z-[3]"}
              lable={"Nơi giới thiệu"}
              inputRefs={inputRefs}
              handleRef={focusInput}
              object={appointment}
              keyObject={"referralPlace"}
              setObject={setAppointment}
              logic={isFocusInput}
              keyLogic={"focusReferralPlace"}
              handleLogic={setIsFocusInput}
              objectLogic={appointmentLogic}
              listSelect={referalPlaceList}
              inputRequire={requireInput.referralPlace}
              lableRequire={requireInput.labelReferralPlace}
            />
            <InputDefault
              className={"relative w-[80%]"}
              lable={"Thông tin người giới thiệu (tên/SDT)"}
              type={"text"}
              name={"referrer"}
              inputRefs={inputRefs}
              handleRef={focusInput}
              object={appointment}
              handleObject={handleInputAppointment}
              logic={isFocusInput}
              keyLogic={"focusReferrer"}
              handleLogic={setIsFocusInput}
              objectLogic={appointmentLogic}
              inputRequire={requireInput.referrer}
              lableRequire={requireInput.labelReferrer}
            />
            <div className="relative w-[80%]">
              <button
                onClick={() => {
                  setAppointment({
                    ...appointment,
                    company: !appointment.company,
                  });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg text-left"
              >
                Doanh nghiệp hợp tác
              </button>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setAppointment({
                    ...appointment,
                    company: !appointment.company,
                  });
                }}
                className={
                  "absolute flex h-full w-[100px] top-0 right-0 items-center justify-center border-2 rounded-lg cursor-pointer duration-200 ease-in-out " +
                  (appointment.company
                    ? "bg-[#00BA4B] fill-white border-[#005121]"
                    : "bg-white fill-[#005121] border-[#00BA4B]")
                }
              >
                <div className="w-[30px] h-[30px]">
                  <svg
                    className="w-[30px] h-[30px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d={
                        appointment.company
                          ? "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                          : "M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
                      }
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-[45%] min-w-[850px] border-2 border-[#005121] rounded-3xl gap-5 py-5 bg-white">
            <div>
              <p className="text-[#005121] text-[25px]">PHÂN LOẠI KHÁM</p>
            </div>
            <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
            <div className="w-[80%]">
              <div className="w-full pl-5 py-2 border-2 border-[#005121] rounded-lg">
                <p>
                  Phân loại khám -
                  <span className="text-[#00BA4B]">
                    {appointment.checkMedical}
                  </span>
                </p>
              </div>
            </div>
            <InputList
              className={"relative w-[80%] z-[3]"}
              lable={"Ưu tiên"}
              inputRefs={inputRefs}
              handleRef={focusInput}
              object={appointment}
              keyObject={"priority"}
              setObject={setAppointment}
              logic={isFocusInput}
              keyLogic={"focusPriority"}
              handleLogic={setIsFocusInput}
              objectLogic={appointmentLogic}
              listSelect={priorityList}
              inputRequire={requireInput.priority}
              lableRequire={requireInput.labelPriority}
            />
            <div className="relative w-[80%]">
              <button
                onClick={() => {
                  setAppointment({
                    ...appointment,
                    paraclinical: !appointment.paraclinical,
                  });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg text-left"
              >
                Cận lâm sàn
              </button>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setAppointment({
                    ...appointment,
                    paraclinical: !appointment.paraclinical,
                  });
                }}
                className={
                  "absolute flex h-full w-[100px] top-0 right-0 items-center justify-center border-2 rounded-lg cursor-pointer duration-200 ease-in-out " +
                  (appointment.paraclinical
                    ? "bg-[#00BA4B] fill-white border-[#005121]"
                    : "bg-white fill-[#005121] border-[#00BA4B]")
                }
              >
                <div className="w-[30px] h-[30px]">
                  <svg
                    className="w-[30px] h-[30px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d={
                        appointment.paraclinical
                          ? "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                          : "M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
                      }
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="relative w-[80%]">
              <button
                onClick={() => {
                  setAppointment({
                    ...appointment,
                    require: !appointment.require,
                  });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg text-left"
              >
                Yêu cầu
              </button>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setAppointment({
                    ...appointment,
                    require: !appointment.require,
                  });
                }}
                className={
                  "absolute flex h-full w-[100px] top-0 right-0 items-center justify-center border-2 rounded-lg cursor-pointer duration-200 ease-in-out " +
                  (appointment.require
                    ? "bg-[#00BA4B] fill-white border-[#005121]"
                    : "bg-white fill-[#005121] border-[#00BA4B]")
                }
              >
                <div className="w-[30px] h-[30px]">
                  <svg
                    className="w-[30px] h-[30px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d={
                        appointment.require
                          ? "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                          : "M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
                      }
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center w-[45%] min-w-[850px] border-2 border-[#005121] rounded-3xl gap-5 py-5 bg-white">
            <div>
              <p className="text-[#005121] text-[25px]">DỊCH VỤ KHÁM</p>
            </div>
            <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
            <div className="relative w-[80%] z-[2]">
              <input
                ref={(el) => (inputRefs.current["serviceName"] = el)}
                name="serviceName"
                value={appointment.serviceName}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...appointmentLogic, focusService: true });
                }}
                className={
                  "w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear " +
                  (requireInput.service ? "border-red-400" : "border-[#005121]")
                }
                type="text"
              />
              {requireInput.serviceName && (
                <div className="absolute top-0 right-0 mr-3 -translate-y-4 bg-red-500 text-white px-1  rounded-md">
                  <p className="text-[15px]">{requireInput.labelService}</p>
                </div>
              )}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("serviceName");
                  setIsFocusInput({ ...appointmentLogic, focusService: true });
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  appointment.serviceName || isFocusInput.focusService
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Dịch vụ khám</p>
              </div>
              <div
                className={
                  "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                  (isFocusInput.focusService ? "max-h-[150px] pt-5" : "max-h-0")
                }
              >
                {listService.map((el) => (
                  <div className="w-full">
                    <button
                      key={el.Id}
                      className="w-full bg-white px-5 py-2 border-y-2 border-white duration-200 ease-in-out hover:bg-slate-400 hover:text-white"
                      onClick={() => {
                        setAppointment({
                          ...appointment,
                          serviceName: el.Name,
                          serviceId: el.Id,
                          departmentId: el.DepartmentId,
                        });
                        setIsFocusInput(appointmentLogic);
                      }}
                    >
                      {"[" +
                        el.CodeName +
                        "]" +
                        el.Name +
                        " - " +
                        formatPrice(el.Price)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-[80%] z-[1]">
              <input
                ref={(el) => (inputRefs.current["doctor"] = el)}
                name="doctor"
                value={appointment.doctor}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...appointmentLogic, focusDoctor: true });
                }}
                className={
                  "w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear " +
                  (requireInput.doctor ? "border-red-400" : "border-[#005121]")
                }
                type="text"
              />
              {requireInput.doctor && (
                <div className="absolute top-0 right-0 mr-3 -translate-y-4 bg-red-500 text-white px-1  rounded-md">
                  <p className="text-[15px]">{requireInput.labelDoctor}</p>
                </div>
              )}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("doctor");
                  setIsFocusInput({ ...appointmentLogic, focusDoctor: true });
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  appointment.doctor || isFocusInput.focusDoctor
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Bác sĩ</p>
              </div>
              <div
                className={
                  "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                  (isFocusInput.focusDoctor ? "max-h-[150px] pt-5" : "max-h-0")
                }
              >
                {listEmployee.map((el) => (
                  <div className="w-full">
                    <button
                      key={el.Id}
                      className="w-full bg-white px-5 py-2 border-y-2 border-white duration-200 ease-in-out hover:bg-slate-400 hover:text-white"
                      onClick={() => {
                        setAppointment({
                          ...appointment,
                          doctor: el.Name,
                          doctorId: el.Id,
                        });
                        setIsFocusInput(appointmentLogic);
                      }}
                    >
                      {el.Name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={() => handleSave()}
          className="px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
        >
          Lưu thông tin
        </button>
      </div>
      <div className="w-full h-1 bg-[#005121]"></div>
      <div>
        <p className="text-[#005121] text-[25px]">NGÀY HẸN KHÁM</p>
      </div>
      <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
      <div className="flex flex-col items-center w-[45%] min-w-[850px] border-2 border-[#005121] rounded-3xl p-5 gap-5 bg-white">
        <div className="relative flex w-full justify-between items-center border-2 border-[#005121] rounded-xl">
          {isOpenSelectDate.appointment && (
            <div className="absolute top-0 translate-y-16">
              <DatePicker
                onChange={(date) => {
                  setAppointment(
                    handleDatePickerAppointment(date, appointment)
                  );
                  setIsOpenSelectDate({ appointment: false });
                }}
                inline
              ></DatePicker>
            </div>
          )}
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                changeDateAppointment(-1);
              }}
              className="flex justify-center items-center w-[100px] py-3 bg-[#005121] fill-white border-2 border-[#005121] rounded-lg duration-100 ease-out active:bg-white active:fill-[#005121]"
            >
              <div className="w-[30px] h-[30px] ">
                <svg
                  className="w-[30px] h-[30px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
              </div>
            </button>
          </div>

          <div className="flex">
            <div>
              <input
                name="day"
                value={appointment.date.day}
                onBlur={(e) => {
                  setAppointment(
                    insertDateAppointment(
                      appointment,
                      e.target.name,
                      e.target.value
                    )
                  );
                }}
                onChange={handleInputDateAppointment}
                className="w-8 outline-none text-center"
                type="number"
              />
            </div>
            <div>
              <p>/</p>
            </div>
            <div>
              <input
                name="month"
                value={appointment.date.month}
                onBlur={(e) => {
                  setAppointment(
                    insertDateAppointment(
                      appointment,
                      e.target.name,
                      e.target.value
                    )
                  );
                }}
                onChange={handleInputDateAppointment}
                className="w-8 outline-none text-center"
                type="number"
              />
            </div>
            <div>
              <p>/</p>
            </div>
            <div>
              <input
                name="year"
                value={appointment.date.year}
                onBlur={(e) => {
                  setAppointment(
                    insertDateAppointment(
                      appointment,
                      e.target.name,
                      e.target.value
                    )
                  );
                }}
                onChange={handleInputDateAppointment}
                className="w-14 outline-none text-center"
                type="number"
              />
            </div>
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                changeDateAppointment(1);
              }}
              className="flex justify-center items-center w-[100px] py-3 bg-[#005121] fill-white border-2 border-[#005121] rounded-lg duration-100 ease-out active:bg-white active:fill-[#005121]"
            >
              <div className="w-[30px] h-[30px]">
                <svg
                  className="w-[30px] h-[30px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
        <div className="flex w-full justify-center py-3 gap-10">
          <div>
            <p>
              Chưa đăng ký:{" "}
              {
                listAppointment.filter((item) => item.State === "Chưa đăng ký")
                  .length
              }
            </p>
          </div>
          <div>
            <p>
              Đã đăng ký:{" "}
              {
                listAppointment.filter((item) => item.State === "Đã đăng ký")
                  .length
              }
            </p>
          </div>
          <div>
            <p>
              Đã hủy:{" "}
              {listAppointment.filter((item) => item.State === "Đã hủy").length}
            </p>
          </div>
        </div>
        <div className="w-1/2 h-1 bg-[#00BA4B]"></div>
        <div className="flex justify-center gap-10">
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenSelectDate({
                  appointment: !isOpenSelectDate.appointment,
                });
              }}
              className="flex justify-center items-center px-5 py-3 bg-[#005121] fill-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:fill-[#005121]"
            >
              <div className="w-[30px] h-[30px]">
                <svg
                  className="w-[30px] h-[30px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
                </svg>
              </div>
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                handleAppointment();
              }}
              disabled={
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate()
                ) <=
                new Date(
                  appointment.date.year,
                  appointment.date.month - 1,
                  appointment.date.day
                )
                  ? false
                  : true
              }
              className={
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate()
                ) <=
                new Date(
                  appointment.date.year,
                  appointment.date.month - 1,
                  appointment.date.day
                )
                  ? "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
                  : "px-5 py-3 bg-slate-300 text-white border-2 border-slate-300 rounded-xl duration-200 ease-in cursor-default"
              }
            >
              Hẹn khám
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-[#005121]"></div>
      <div className="flex justify-center items-center gap-5 w-[75%] min-w-[850px]">
        <div className="relative w-[40%]">
          <input
            ref={(el) => (inputRefs.current["search"] = el)}
            name="search"
            value={appointmentInfor.search}
            onChange={handleInputSearch}
            onClick={(e) => {
              e.stopPropagation();
              setIsFocusInput({ ...appointmentLogic, focusSearch: true });
            }}
            className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
            type="text"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              focusInput("search");
            }}
            className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
              appointmentInfor.search || isFocusInput.focusSearch
                ? "-translate-y-6 text-sm text-[#005121]"
                : "text-gray-400"
            }`}
          >
            <p className="bg-white px-1">Tìm kiếm (tên/sdt/mã)</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              setAppointmentInfor({
                ...appointmentInfor,
                notRegistered: !appointmentInfor.notRegistered,
                canceled: false,
                registered: false,
              });
            }}
            className={
              appointmentInfor.notRegistered
                ? "px-5 py-3 bg-white text-[#005121] border-2 border-[#005121] rounded-xl duration-200 ease-in"
                : "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in"
            }
          >
            Chưa đăng ký
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              setAppointmentInfor({
                ...appointmentInfor,
                notRegistered: false,
                canceled: false,
                registered: !appointmentInfor.registered,
              });
            }}
            className={
              appointmentInfor.registered
                ? "px-5 py-3 bg-white text-[#005121] border-2 border-[#005121] rounded-xl duration-200 ease-in"
                : "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in"
            }
          >
            Đã đăng ký
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              setAppointmentInfor({
                ...appointmentInfor,
                notRegistered: false,
                canceled: !appointmentInfor.canceled,
                registered: false,
              });
            }}
            className={
              appointmentInfor.canceled
                ? "px-5 py-3 bg-white text-[#005121] border-2 border-[#005121] rounded-xl duration-200 ease-in"
                : "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in"
            }
          >
            Đã hủy
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center w-[90%] min-w-[850px] h-[500px] bg-slate-300 text-white gap-1">
        <div className="flex w-full bg-[#00BA4B]">
          <div className="w-[10%] py-3 text-center border-r-2 border-white">
            <p>Mã hẹn</p>
          </div>
          <div className="flex-grow-[1] py-3 text-center border-r-2 border-white">
            <p>Tên</p>
          </div>
          <div className="w-[10%] py-3 text-center border-r-2 border-white">
            <p>SDT Thân nhân</p>
          </div>
          <div className="w-[15%] py-3 text-center border-r-2 border-white">
            <p>Dịch vụ</p>
          </div>
          <div className="w-[15%] py-3 text-center border-r-2 border-white">
            <p>Bác sĩ</p>
          </div>
          <div className="w-[15%] py-3 text-center border-r-2 border-white">
            <p>Ngày</p>
          </div>
          <div className="w-[10%] py-3 text-center border-r-2 border-white">
            <p>Trạng thái</p>
          </div>
          <div className="w-[10%] py-3 text-center">
            <p>Tùy chọn</p>
          </div>
        </div>
        <div
          className={
            "w-full h-full flex justify-center " +
            (isWait.listAppointment ? "items-center" : "items-start")
          }
        >
          {isWait.listAppointment ? (
            <Loader />
          ) : listAppointment.length === 0 ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="font-bold">Không ai hẹn vào hôm nay!</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-1 items-center min-w-[1500px] scrollbarList overflow-y-auto overflow-x-hidden">
              {searchAppointment(
                listAppointment,
                appointmentInfor.search,
                appointmentInfor
              ).map((el) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    getInfor(el);
                  }}
                  className="flex w-full justify-stretch bg-white text-black cursor-pointer duration-200 ease-in-out hover:scale-[1.01]"
                >
                  <div className="w-[10%] py-3 text-center border-r-2 border-black">
                    {el.Id}
                  </div>
                  <div className="flex-grow-[1] py-3 text-center border-r-2 border-black">
                    {el.Patient.Name}
                  </div>
                  <div className="w-[10%] py-3 text-center border-r-2 border-black">
                    {el.Patient.RelativesPhone}
                  </div>
                  <div className="w-[15%] py-3 text-center border-r-2 border-black">
                    {el.Service ? el.Service.Name : "Chưa chọn"}
                  </div>
                  <div className="w-[15%] py-3 text-center border-r-2 border-black">
                    {el.Doctor ? el.Doctor : "Chưa chọn"}
                  </div>
                  <div className="w-[15%] py-3 text-center border-r-2 border-black">
                    {formatDate(el.Date) +
                      (el.Time ? " - " + covertTime(el.Time) : "")}
                  </div>
                  <div className="w-[10%] py-3 text-center border-r-2 border-white">
                    {el.State}
                  </div>
                  <div className="w-[10%]">
                    {el.State === "Đã đăng ký" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAppointmentInfor({
                            ...appointmentInfor,
                            id: el.Id,
                          });
                          handleCancel(el);
                        }}
                        className="w-full h-full text-center bg-red-500 text-white border-2 border-red-500 duration-200 ease-linear hover:bg-white hover:text-red-500"
                      >
                        Hủy đăng ký
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          reRegister(el);
                        }}
                        className="w-full h-full text-center bg-[#005121] text-white border-2 border-[#005121] duration-200 ease-linear hover:bg-white hover:text-[#005121]"
                      >
                        Đăng ký {el.State === "Đã hủy" && "lại"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
