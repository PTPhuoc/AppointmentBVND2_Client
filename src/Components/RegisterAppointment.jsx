import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputSelectSearch from "./InputSelectSearch";
import {
  listGender,
  objectRelatives,
  patientObject,
  setPatientValue,
} from "../Functions/HandlePatien";
import {
  appointmentObject,
  handleSearchAppointment,
  insertPatientAppointment,
  objectAppointmentOption,
} from "../Functions/HandleRegisterAppointment";
import Loader from "./Loader";
import axios from "axios";
import InputDateEdit from "./InputDateEdit";
import InputEdit from "./InputEdit";
import listEthnicity from "../Json/Ethnicity.json";
import listNation from "../Json/Nation.json";
import InputLocation from "./InputLocation";
import CheckDefault from "./CheckDefault";
import { checkValue } from "../Functions/HandleSelectList";
import { compareDate, stringUTCTime } from "../Functions/HandleDate";
import { userContext } from "../Context/User";

export default function RegisterAppointment() {
  const currentContext = useContext(userContext);
  const [appointment, setAppointment] = useState(appointmentObject);
  const [patient, setPatient] = useState(patientObject);
  const [search, setSearch] = useState({
    text: "",
    registed: false,
    cancel: false,
  });
  const [isPending, setIsPending] = useState({
    listAppointment: true,
  });
  const [listAppointment, setListAppointment] = useState([]);
  const [listPatient, setListPatient] = useState([]);

  const navigate = useNavigate();

  const getAppointment = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/appointment/get-appointment", {
        params: {
          date: new Date(
            appointment.date.year,
            appointment.date.month - 1,
            appointment.date.day
          ),
        },
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListAppointment(rs.data.Appointments);
        } else if (rs.data.Status === "Server Error") {
          console.log(rs.data.Message);
        } else {
          setListAppointment([]);
        }
        setIsPending({ ...isPending, listAppointment: false });
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
        } else if (rs.data.Status === "Server Error") {
          console.log(rs.data.Message);
        } else {
          setListPatient([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSavePatient = () => {
    if (patient.age > 16 || patient.age < 0) {
      currentContext.setNotification({
        for: "WarningMaxAge",
        content: "Tuổi của bệnh nhi phải dưới 16 tuổi!",
        isOpen: true,
        handle: "pending",
        option: "N",
      });
    } else {
      if (appointment.id) {
        axios
          .post(
            process.env.REACT_APP_API_URL +
              "/appointment/reset-update-appointment",
            {
              id: appointment.id,
              date: new Date(
                appointment.date.year,
                appointment.date.month - 1,
                appointment.date.day
              ),
            }
          )
          .then((rs) => {
            if (rs.data.Status === "Server Error") {
              console.log(rs.data.Message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      axios
        .post(process.env.REACT_APP_API_URL + "/patient/save-patient", {
          ...patient,
          birth: new Date(
            patient.birth.year,
            patient.birth.month - 1,
            patient.birth.day
          ),
          location:
            patient.location.city +
            ", " +
            patient.location.district +
            ", " +
            patient.location.ward,
        })
        .then((rs) => {
          if (rs.data.Status === "Success") {
            axios
              .post(
                process.env.REACT_APP_API_URL + "/appointment/save-appointment",
                {
                  id: appointment.id ? appointment.id : null,
                  patientId: rs.data.Patient.Id,
                  object: appointment.object ? appointment.object : null,
                  priority: appointment.priority ? appointment.priority : false,
                  doctorId: appointment.doctorId ? appointment.doctorId : null,
                  doctorRoomId: appointment.doctorRoomId
                    ? appointment.doctorRoomId
                    : null,
                  date: new Date(
                    appointment.date.year,
                    appointment.date.month - 1,
                    appointment.date.day
                  ),
                  time: appointment.time,
                  state: appointment.id ? "Đã đăng ký" : "Đang xử lý",
                  note: appointment.note,
                }
              )
              .then((rs1) => {
                if (rs1.data.Status === "Success") {
                  window.localStorage.setItem(
                    "idAppointment",
                    rs1.data.AppointmentId
                  );
                  navigate("/select-appointment");
                } else if (rs.data.Status === "Server Error") {
                  console.log(rs.data.Message);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (rs.data.Status === "Server Error") {
            console.log(rs.data.Message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getOnePatient = (id) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/patient/one-patient", {
        params: { id: id },
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setPatient({ ...setPatientValue(rs.data.Patient) });
        } else if (rs.data.Status === "Server Error") {
          console.log(rs.data.Message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancelAppointment = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/appointment/cancel-appointment", {
        id: appointment.id,
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          getAppointment();
        } else if (rs.data.Status === "Server Error") {
          console.log(rs.data.Message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (currentContext.pendingPage.getAccount === "Success") {
      if (window.localStorage.getItem("idAppointment")) {
        navigate("/select-appointment");
      } else {
        if (currentContext.Account.id) {
          getAppointment();
          getPatient();
        } else {
          navigate("/signin");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContext.pendingPage]);

  useEffect(() => {
    const currentDate = new Date();
    if (patient.birth.year <= currentDate.getFullYear()) {
      setPatient({
        ...patient,
        age: currentDate.getFullYear() - patient.birth.year,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.birth.year]);

  useEffect(() => {
    if (currentContext.windowWarning.handle === "Success") {
      if (currentContext.windowWarning.for === "CancelRegisterAppointment") {
        cancelAppointment();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContext.windowWarning.handle]);

  return (
    <div className="flex flex-col gap-5 w-full justify-center items-center my-5">
      <div className="flex flex-col gap-5 py-5 w-[90%] justify-center items-center border-2 border-[#005121] rounded-3xl">
        <div className="w-full text-center text-[#005121]">
          <p>THÔNG TIN BỆNH NHÂN</p>
        </div>
        <div className="w-[30%] h-1 bg-[#00BA4B] rounded-3xl"></div>
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center gap-5 w-[800px]">
            <InputSelectSearch
              className={"w-[90%] z-[8]"}
              lable={"Tên bệnh nhân"}
              list={listPatient}
              listKey={"Name"}
              object={patient}
              objectKey={"name"}
              setObject={(value) => setPatient({ ...patient, name: value })}
              insertList={(item) => {
                setPatient({ ...setPatientValue(item) });
              }}
              showList={(item) => {
                return <div>{item.Name}</div>;
              }}
            />
            <InputDateEdit
              className={"w-[90%] z-[7]"}
              object={patient.birth}
              setObject={(e) => {
                const { name, value } = e.target;
                setPatient({
                  ...patient,
                  birth: { ...patient.birth, [name]: value },
                });
              }}
              insertDate={(date) => {
                setPatient({
                  ...patient,
                  birth: {
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                  },
                });
              }}
              insertObject={(date) => {
                setPatient({ ...patient, birth: { ...date } });
              }}
              lable={"Ngày sinh"}
            />
            <InputSelectSearch
              className={"w-[90%] z-[6]"}
              lable={"Giới tính"}
              list={listGender}
              listKey={"gender"}
              object={patient}
              objectKey={"gender"}
              setObject={(value) => setPatient({ ...patient, gender: value })}
              insertList={(item) => {
                setPatient({ ...patient, gender: item.gender });
              }}
              showList={(item) => {
                return <div>{item.gender}</div>;
              }}
            />
            <InputEdit
              lable={"Tuổi"}
              className={"w-[90%] z-[5]"}
              object={patient}
              objectKey={"age"}
              setObject={(value) => setPatient({ ...patient, age: value })}
              typeInput={"number"}
            />
            <InputSelectSearch
              className={"w-[90%] z-[4]"}
              lable={"Dân tộc"}
              list={listEthnicity}
              listKey={"ethnicity"}
              object={patient}
              objectKey={"ethnicity"}
              setObject={(value) =>
                setPatient({ ...patient, ethnicity: value })
              }
              insertList={(item) => {
                setPatient({ ...patient, ethnicity: item.ethnicity });
              }}
              showList={(item) => {
                return <div>{item.ethnicity}</div>;
              }}
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-5 w-[800px]">
            <InputLocation
              lable={"Địa chỉ"}
              object={patient.location}
              className={"w-[90%] z-[8]"}
              insertList={(item) => {
                let valueInsert = { ...patient.location };
                Object.keys(item).forEach((key) => {
                  if (key in valueInsert) {
                    valueInsert[key] = item[key];
                  }
                });
                setPatient({
                  ...patient,
                  location: {
                    ...valueInsert,
                  },
                });
              }}
              clearInput={(clearValue) =>
                setPatient({ ...patient, location: { ...clearValue } })
              }
            />
            <InputSelectSearch
              className={"w-[90%] z-[7]"}
              lable={"Quốc gia"}
              list={listNation}
              listKey={"nation"}
              object={patient}
              objectKey={"nation"}
              setObject={(value) => setPatient({ ...patient, nation: value })}
              insertList={(item) => {
                setPatient({ ...patient, nation: item.nation });
              }}
              showList={(item) => {
                return <div>{item.nation}</div>;
              }}
            />
            <InputSelectSearch
              className={"w-[90%] z-[6]"}
              lable={"Đối tượng giám hộ"}
              list={objectRelatives}
              listKey={"relatives"}
              object={patient}
              objectKey={"typeRelatives"}
              setObject={(value) =>
                setPatient({ ...patient, typeRelatives: value })
              }
              insertList={(item) => {
                setPatient({ ...patient, typeRelatives: item.relatives });
              }}
              showList={(item) => {
                return <div>{item.relatives}</div>;
              }}
            />
            <InputEdit
              lable={"Tên người giám hộ"}
              className={"w-[90%] z-[5]"}
              object={patient}
              objectKey={"relatives"}
              setObject={(value) =>
                setPatient({ ...patient, relatives: value })
              }
              typeInput={"text"}
            />
            <InputEdit
              lable={"SDT người giám hộ"}
              className={"w-[90%] z-[5]"}
              object={patient}
              objectKey={"relativesPhone"}
              setObject={(value) =>
                setPatient({ ...patient, relativesPhone: value })
              }
              typeInput={"number"}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-stretch w-[90%]">
        <div className="flex flex-col gap-5 py-5 w-[800px] justify-center items-center border-2 border-[#005121] rounded-3xl">
          <div className="w-full text-center text-[#005121]">
            <p>THÔNG TIN THÊM</p>
          </div>
          <div className="w-[30%] h-1 bg-[#00BA4B] rounded-3xl"></div>
          <InputEdit
            lable={"Tình trạng"}
            className={"w-[90%] z-[3]"}
            object={appointment}
            objectKey={"note"}
            setObject={(value) =>
              setAppointment({ ...appointment, note: value })
            }
            typeInput={"text"}
          />
          <div className="flex w-[90%] justify-between">
            <InputSelectSearch
              className={"w-[500px] z-[2]"}
              lable={"Loại khám"}
              list={objectAppointmentOption}
              listKey={"object"}
              object={appointment}
              objectKey={"object"}
              setObject={(value) =>
                setAppointment({ ...appointment, object: value })
              }
              insertList={(item) => {
                setAppointment({ ...appointment, object: item.object });
              }}
              showList={(item) => {
                return <div>{item.object}</div>;
              }}
            />
            <CheckDefault
              object={appointment}
              lable={"Ưu tiên khám"}
              objectKey={"priority"}
              setObject={(value) => {
                setAppointment({ ...appointment, priority: !value });
              }}
              className={"w-[200px] h-[51px] border-[#005121]"}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 py-5 w-[800px] justify-center items-center border-2 border-[#005121] rounded-3xl">
          <div className="w-full text-center text-[#005121]">
            <p>NGÀY HẸN KHÁM</p>
          </div>
          <div className="w-[30%] h-1 bg-[#00BA4B] rounded-3xl"></div>
          <InputDateEdit
            className={"w-[90%] z-[8]"}
            object={appointment.date}
            setObject={(e) => {
              const { name, value } = e.target;
              setAppointment({
                ...appointment,
                date: { ...appointment.date, [name]: value },
              });
            }}
            insertDate={(date) => {
              setAppointment({
                ...appointment,
                date: {
                  day: date.getDate(),
                  month: date.getMonth() + 1,
                  year: date.getFullYear(),
                },
              });
            }}
            insertObject={(date) => {
              setAppointment({ ...appointment, date: { ...date } });
            }}
            lable={"Ngày hẹn khám"}
          />
          <div className="flex w-[90%] justify-between">
            <button
              onClick={() => {
                const appointmentDate = new Date(
                  appointment.date.year,
                  appointment.date.month - 1,
                  appointment.date.day
                );
                appointmentDate.setDate(appointmentDate.getDate() - 1);
                setAppointment({
                  ...appointment,
                  date: {
                    day: appointmentDate.getDate(),
                    month: appointmentDate.getMonth() + 1,
                    year: appointmentDate.getFullYear(),
                  },
                });
              }}
              className="px-8 py-2 bg-[#005121] fill-white rounded-3xl border-2 border-[#005121] duration-200 ease-linear hover:bg-white hover:fill-[#005121]"
            >
              <svg
                className="w-[30px] h-[30px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </button>
            <button
              disabled={
                !(
                  checkValue(patient, [
                    "id",
                    "cityCode",
                    "districtCode",
                    "wardCode",
                  ]) &&
                  checkValue(appointment, [], ["object"]) &&
                  compareDate(
                    new Date(
                      appointment.date.year,
                      appointment.date.month - 1,
                      appointment.date.day
                    ),
                    new Date()
                  )
                )
              }
              className={
                checkValue(patient, [
                  "id",
                  "cityCode",
                  "districtCode",
                  "wardCode",
                ]) &&
                checkValue(appointment, [], ["object"]) &&
                compareDate(
                  new Date(
                    appointment.date.year,
                    appointment.date.month - 1,
                    appointment.date.day
                  ),
                  new Date()
                )
                  ? "px-8 py-2 bg-[#005121] text-white rounded-xl border-2 border-[#005121] duration-200 ease-linear hover:bg-white hover:text-[#005121]"
                  : "px-8 py-2 text-center bg-zinc-300 text-white p-3 border-2 border-zinc-300 rounded-xl"
              }
              onClick={() => handleSavePatient()}
            >
              {appointment.id ? "Cập nhật hẹn khám" : "Đăng ký hẹn khám"}
            </button>
            {appointment.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPatient(patientObject);
                  setAppointment(appointmentObject);
                }}
                className="bg-orange-500 border-2 border-orange-500 px-8 py-2 text-white rounded-xl duration-200 ease-linear hover:bg-white hover:text-orange-500"
              >
                Hủy cập nhật
              </button>
            )}
            <button
              onClick={() => {
                const appointmentDate = new Date(
                  appointment.date.year,
                  appointment.date.month - 1,
                  appointment.date.day
                );
                appointmentDate.setDate(appointmentDate.getDate() + 1);
                setAppointment({
                  ...appointment,
                  date: {
                    day: appointmentDate.getDate(),
                    month: appointmentDate.getMonth() + 1,
                    year: appointmentDate.getFullYear(),
                  },
                });
              }}
              className="px-8 py-2 bg-[#005121] fill-white rounded-3xl border-2 border-[#005121] duration-200 ease-linear hover:bg-white hover:fill-[#005121]"
            >
              <svg
                className="w-[30px] h-[30px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-[#00BA4B] rounded-3xl"></div>
      <div className="flex gap-5 w-full justify-center items-center">
        <InputEdit
          lable={"Tìm kiếm theo mã/tên"}
          className={"w-[30%] z-[1]"}
          object={search}
          objectKey={"text"}
          setObject={(value) => setSearch({ ...search, text: value })}
          typeInput={"text"}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSearch({ ...search, registed: !search.registed, cancel: false });
          }}
          className={
            "px-8 py-2 rounded-xl border-2 border-[#005121] duration-200 ease-linear " +
            (search.registed
              ? "bg-white text-[#005121]"
              : "bg-[#005121] text-white")
          }
        >
          Đã đăng ký
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSearch({ ...search, cancel: !search.cancel, registed: false });
          }}
          className={
            "px-8 py-2 rounded-xl border-2 border-[#005121] duration-200 ease-linear " +
            (search.cancel
              ? "bg-white text-[#005121]"
              : "bg-[#005121] text-white")
          }
        >
          Đã hủy
        </button>
      </div>
      <div className="flex flex-col w-[90%] h-[700px] bg-zinc-300 items-center">
        <div className="flex items-center w-full bg-[#00BA4B]">
          <div className="w-[150px] text-center text-white py-[15px] border-r-2">
            <p>Mã hẹn</p>
          </div>
          <div className="flex-grow text-center text-white py-[15px] border-r-2">
            <p>Tên bệnh nhân</p>
          </div>
          <div className="w-[200px] text-center text-white py-[15px] border-r-2">
            <p>SDT thân nhân</p>
          </div>
          <div className="w-[150px] text-center text-white py-[15px] border-r-2">
            <p>Thời gian</p>
          </div>
          <div className="w-[200px] text-center text-white py-[15px] border-r-2">
            <p>Loại khám</p>
          </div>
          <div className="w-[350px] text-center text-white py-[15px] border-r-2">
            <p>Bác sĩ</p>
          </div>
          <div className="w-[100px] text-center text-white py-[15px] border-r-2">
            <p>Phòng</p>
          </div>
          <div className="w-[150px] text-center text-white py-[15px] border-r-2">
            <p>Trạng thái</p>
          </div>
          <div className="w-[150px] text-center text-white py-[15px] border-r-2">
            <p>Lựa chọn</p>
          </div>
        </div>
        <div
          className={
            "w-full flex flex-col flex-1 overflow-y-auto overflow-x-hidden " +
            (isPending.listAppointment ||
            handleSearchAppointment(search, listAppointment).length === 0
              ? "items-center"
              : "items-start")
          }
        >
          {handleSearchAppointment(search, listAppointment).length > 0 ? (
            handleSearchAppointment(search, listAppointment).map((item) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  getOnePatient(item.Patient.Id);
                  if (item.State === "Đã đăng ký") {
                    setAppointment({ ...insertPatientAppointment(item) });
                  } else {
                    setAppointment(appointmentObject);
                  }
                }}
                className="flex items-center w-full bg-white border-y-2 duration-200 ease-linear hover:border-[#00BA4B]"
              >
                <div className="w-[150px] text-center text-[#00BA4B] py-[15px] border-r-2">
                  <p>{item.Id}</p>
                </div>
                <div className="flex-grow text-center text-[#00BA4B] py-[15px] border-r-2">
                  <p>{item.Patient.Name}</p>
                </div>
                <div className="w-[200px] text-center text-[#00BA4B] py-[15px] border-r-2">
                  <p>{item.Patient.RelativesPhone}</p>
                </div>
                <div className="w-[150px] text-center text-[#00BA4B] py-[15px] border-r-2">
                  <p>{stringUTCTime(new Date(item.Time))}</p>
                </div>
                <div className="w-[200px] text-center text-[#00BA4B] py-[15px] border-r-2">
                  <p>{item.Priority ? "Khám ưu tiên" : "Khám thường"}</p>
                </div>
                <div className="w-[350px] text-center text-[#00BA4B] py-[15px] border-r-2">
                  <p>{item.Employee && item.Employee.Name}</p>
                </div>
                <div className="w-[100px] text-center text-[#00BA4B] py-[15px] border-r-2">
                  <p>{item.DoctorRoom && item.DoctorRoom.Room.Name}</p>
                </div>
                <div className="w-[150px] text-center text-[#00BA4B] py-[15px] border-r-2">
                  <p>{item.State}</p>
                </div>
                <button
                  disabled={item.State === "Đã đăng ký" ? false : true}
                  className={
                    item.State === "Đã đăng ký"
                      ? "w-[150px] py-[15px] bg-red-500 text-white border-2 border-red-500 duration-200 ease-linear hover:bg-white hover:text-red-500"
                      : "w-[150px] py-[15px] bg-zinc-300 text-white border-2 border-zinc-300"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    currentContext.setWindowWarning({
                      for: "CancelRegisterAppointment",
                      content:
                        "Bạn có chắc muốn hủy hẹn của " +
                        appointment.patientName,
                      handle: "pending",
                      isOpen: true,
                    });
                  }}
                >
                  Hủy đăng ký
                </button>
              </button>
            ))
          ) : (
            <div className="flex flex-1 justify-center items-center">
              {isPending.listAppointment ? (
                <Loader />
              ) : (
                <div>
                  <p>Lịch trống!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
