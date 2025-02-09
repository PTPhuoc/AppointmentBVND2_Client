import React, { useContext, useEffect, useRef, useState } from "react";
import InputShow from "./InputShow";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { insertPatientAppointment } from "../Functions/HandleRegisterAppointment";
import ListSelectAppointment from "./ListSelectAppointment";
import { userContext } from "../Context/User";
import { stringUTCTime } from "../Functions/HandleDate";

export default function SelectAppointment() {
  const currentContext = useContext(userContext);
  const [appointment, setAppointment] = useState({
    id: null,
    patientId: null,
    patientName: null,
    doctorName: "",
    doctorId: "",
    doctorRoomId: null,
    priority: false,
    number: 0,
    time: null,
    date: {
      day: 0,
      month: 0,
      year: 0,
    },
    dateString: null,
  });
  const [optionAppointment, setOptionAppointment] = useState({
    doctorRoom: null,
    timeStart: null,
    timeEnd: null,
    available: 0,
  });
  const [listHours, setListHours] = useState([]);
  const [listDoctorRooms, setListDoctorRooms] = useState([]);
  const [listAppointments, setListAppointment] = useState([]);

  const navigate = useNavigate();

  const scrollTitle = useRef(null);
  const scrollButton = useRef(null);

  const getHours = () => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/consultation-hours/get-consultation-hours"
      )
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListHours(rs.data.ConsultationHours);
        } else if (rs.data.Status === "Server Error") {
          console.log(rs.data.Message);
        } else {
          setListHours([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDoctorRoom = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/doctor-room/get-doctor-room", {})
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListDoctorRooms(rs.data.DoctorRooms);
        } else if (rs.data.Status === "Server Error") {
          console.log(rs.data.Message);
        } else {
          setListDoctorRooms([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancelAppointment = () => {
    if (appointment.doctorRoomId) {
      axios
        .post(
          process.env.REACT_APP_API_URL + "/appointment/cancel-appointment",
          { id: appointment.id }
        )
        .then((rs) => {
          if (rs.data.Status === "Success") {
            window.localStorage.setItem("idAppointment", null);
            navigate("/appointment");
          } else if (rs.data.Status === "Server Error") {
            console.log(rs.data.Message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .delete(
          process.env.REACT_APP_API_URL + "/appointment/delete-appointment",
          { params: { id: appointment.id } }
        )
        .then((rs) => {
          if (rs.data.Status === "Success") {
            window.localStorage.setItem("idAppointment", null);
            navigate("/appointment");
          } else if (rs.data.Status === "Server Error") {
            console.log(rs.data.Message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleScroll = (sourceRef, targetRef) => {
    if (targetRef.current) {
      targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    }
  };

  const handleSaveAppointment = () => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "/appointment/reset-select-appointment",
        {
          date: new Date(
            appointment.date.year,
            appointment.date.month - 1,
            appointment.date.day
          ),
          id: appointment.id,
        }
      )
      .then((rs) => {
        if (rs.data.Status === "Server Error") {
          console.log(rs.data.Message);
        } else {
          axios
            .post(
              process.env.REACT_APP_API_URL + "/appointment/save-appointment",
              {
                ...appointment,
                date: new Date(
                  appointment.date.year,
                  appointment.date.month - 1,
                  appointment.date.day
                ),
                time: null,
                status: "Đã đăng ký",
                doctorId: optionAppointment.doctor.id,
                timeStart: optionAppointment.timeStart,
                timeEnd: optionAppointment.timeEnd,
                doctorRoomId: optionAppointment.doctorRoom.id,
              }
            )
            .then((rs) => {
              if (rs.data.Status === "Success") {
                axios
                  .post(
                    process.env.REACT_APP_API_URL +
                      "/appointment/reset-target-appointment",
                    {
                      date: new Date(
                        appointment.date.year,
                        appointment.date.month - 1,
                        appointment.date.day
                      ),
                      id: appointment.id,
                    }
                  )
                  .then((rs) => {
                    if (rs.data.Status === "Server Error") {
                      console.log(rs.data.Message);
                    } else {
                      currentContext.setWindowWarning({
                        ...currentContext.windowWarning,
                        handle: "pending",
                        for: "",
                      });
                      window.localStorage.setItem("idAppointment", "")
                      navigate("/appointment");
                    }
                  });
              } else if (rs.data.Status === "Server Error") {
                console.log(rs.data.Message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const appointmentId = window.localStorage.getItem("idAppointment");
    if (appointmentId) {
      axios
        .get(
          process.env.REACT_APP_API_URL +
            "/appointment/get-patient-appointment",
          { params: { id: appointmentId } }
        )
        .then((rs) => {
          if (rs.data.Status === "Success") {
            setAppointment({
              ...insertPatientAppointment(rs.data.PatientAppointment),
            });
          } else if (rs.data.Status === "Server Error") {
            console.log(rs.data.Message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      navigate("/register-appointment");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentContext.pendingPage.getAccount === "Success") {
      if (currentContext.Account.id) {
        if (appointment.id) {
          getHours();
          getDoctorRoom();
          getAppointment();
        }
      } else {
        navigate("/signin");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment, currentContext.pendingPage]);

  useEffect(() => {
    if (currentContext.windowWarning.handle === "Success") {
      if (currentContext.windowWarning.for === "SelectAppointment") {
        handleSaveAppointment();
      }
      if (currentContext.windowWarning.for === "CancelAppointment") {
        cancelAppointment();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContext.windowWarning.handle]);

  return (
    <div className="flex flex-col gap-5 w-full justify-center items-center my-5">
      <div className="flex w-[90%] justify-between items-center">
        <div className="flex justify-center items-center gap-5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/appointment");
              window.localStorage.setItem("idAppointment", "")
            }}
            className="h-full w-[200px] bg-orange-500 border-2 border-orange-500 p-2 text-white rounded-xl duration-200 ease-linear hover:bg-white hover:text-orange-500"
          >
            Quay về
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              currentContext.setWindowWarning({
                for: "CancelAppointment",
                content:
                  "Bạn có chắc muốn hủy hẹn của " + appointment.patientName,
                handle: "pending",
                isOpen: true,
              });
            }}
            className="h-full w-[200px] bg-red-500 border-2 border-red-500 p-2 text-white rounded-xl duration-200 ease-linear hover:bg-white hover:text-red-500"
          >
            Hủy hẹn khám
          </button>
        </div>
        <div className="flex justify-center items-center gap-5">
          <InputShow
            lable={"Bệnh nhân"}
            object={appointment}
            objectKey={"patientName"}
            className={"w-[500px]"}
          />
          <InputShow
            lable={"Ngày hẹn khám"}
            object={appointment}
            objectKey={"dateString"}
            className={"w-[500px]"}
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-[90%] h-[690px] bg-zinc-300">
        <div
          ref={scrollTitle}
          className="flex gap-1 overflow-x-auto bg-[#005121] border-2 border-[#005121] w-full hidden-scrollbar"
        >
          {listHours.length > 0 &&
            listHours.map((item) => (
              <div className="w-[300px] min-w-[300px] py-4 text-center text-white border-r-2 border-white">
                {item.Name}
              </div>
            ))}
        </div>
        <div
          ref={scrollButton}
          onScroll={() => handleScroll(scrollButton, scrollTitle)}
          className="flex flex-col gap-1 py-1 flex-1 overflow-x-auto w-full scrollbarList"
        >
          <ListSelectAppointment
            listHours={listHours}
            listDoctorRooms={listDoctorRooms}
            listAppointments={listAppointments}
            appointment={appointment}
            handleClick={(item, item1, available) => {
              setOptionAppointment({
                doctorRoom: { id: item.Id, maxTime: item.MaxTime },
                doctor: { id: item.Employee.Id },
                timeStart: item1.Start,
                timeEnd: item1.End,
                available: available,
              });
              currentContext.setWindowWarning({
                for: "SelectAppointment",
                content:
                  "Bạn có chắc là chọn lịch hẹn của bác sĩ " +
                  item.Employee.Name +
                  " tại giờ khám " +
                  stringUTCTime(new Date(item1.Start)) +
                  " - " +
                  stringUTCTime(new Date(item1.End)),
                handle: "pending",
                isOpen: true,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
