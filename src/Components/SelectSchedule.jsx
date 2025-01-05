import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  selectScheduleObject,
  selectScheduleLogic,
  converToCurrentDate,
} from "../Functions/HandleSelectSchedule";
import { stringDay, formatDate, handleList } from "../Functions/HandleSchedule";
import { getTimeConsultaion } from "../Functions/HandleConsultationHours";
import axios from "axios";
import { userContext } from "../Context/User";
import InputListSearch from "./InputListSearch";
import { getWeek } from "date-fns";
import InputDate from "./InputDate";
import Loader from "./Loader";

export default function SelectSchedule() {
  const currentContext = useContext(userContext);
  const [selectSchedule, setSelectSchedule] = useState(selectScheduleObject);
  const [focusInput, setFocusInput] = useState(selectScheduleLogic);
  const [listRoom, setListRoom] = useState([]);
  const [listConsultation, setListConsultation] = useState([]);
  const [listService, setListService] = useState([]);
  const [listDoctor, setListDoctor] = useState([]);
  const [listDoctorRoom, setListDocTorRoom] = useState([]);
  const [isPedding, setIsPedding] = useState({
    doctorRoom: true,
  });
  const [isSelectDate, setIsSelectDate] = useState({ schedule: false });
  const inputRefs = useRef([]);

  const naviate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectSchedule({ ...selectSchedule, [name]: value });
  };

  const focusRef = (value) => {
    inputRefs.current[value].focus();
    inputRefs.current[value].click();
  };

  const getServices = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/service/get-service")
      .then((rs) => {
        if (rs.data.Status === "Success") {
          const listServices = listDoctorRoom
          .map((item1) => {
            const filterService = rs.data.Services.filter(
              (item2) => item2.DepartmentId === item1.Room.Department.Id
            );
            return filterService;
          })
          .filter(
            (item, index, self) =>
              self.findIndex((obj) => obj.Id === item.Id) === index
          );
          setListService(listServices.flat());
        } else {
          setListService([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getConsulation = () => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/consultation-hours/get-consultation-hours"
      )
      .then((rs) => {
        if (rs.data.Status === "Success") {
          const currentDate = new Date();
          const getTrueTime = rs.data.ConsultationHours.filter(
            (item) => currentDate <= converToCurrentDate(new Date(item.End))
          );
          setListConsultation(getTrueTime);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDoctorRoom = () => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/doctor-room/get-doctor-room-consultation",
        {
          params: {
            shiftId: selectSchedule.shiftId,
            departmentId: selectSchedule.departmentId,
            doctorId: selectSchedule.doctorId,
            week: selectSchedule.week,
            date: new Date(
              selectSchedule.date.year,
              selectSchedule.date.month - 1,
              selectSchedule.date.day
            ),
          },
        }
      )
      .then((rs) => {
        if (rs.data.Status === "Success") {
          const currentDate = new Date();
          const getTrueTime = rs.data.DoctorRooms.filter(
            (item) =>
              currentDate <= converToCurrentDate(new Date(item.ShiftEnd))
          );
          setListDocTorRoom(getTrueTime);
        } else {
          setListDocTorRoom([]);
        }
        setIsPedding({ doctorRoom: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getData = (object) => {
    setSelectSchedule({
      ...selectSchedule,
      doctor: object.Employee.Name,
      doctorId: object.Employee.Id,
      room: object.Room.Name,
      roomId: object.Room.Id,
      doctorRoomId: object.Id,
      shift: object.Shift,
      shiftId: object.ShiftId,
      slot: object.Slot,
      valable: object.Valable,
    });
  };

  const saveAppointment = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/appointment/add-time", {
        id: selectSchedule.id,
        doctorRoomId: selectSchedule.doctorRoomId,
        shiftId: selectSchedule.shiftId,
        valable: selectSchedule.valable,
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          naviate("/appointment");
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

  useEffect(() => {
    setIsPedding({ ...isPedding, doctorRoom: true });
    const timer = setTimeout(() => {
      if (selectSchedule.name) {
        getDoctorRoom();
      }
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectSchedule.date,
    selectSchedule.shift,
    selectSchedule.week,
    selectSchedule.doctorId,
    selectSchedule.serviceId,
  ]);

  useEffect(() => {
    if (selectSchedule.name) {
      if (selectSchedule.shift) {
        const getTime = getTimeConsultaion(selectSchedule, listConsultation);
        if (getTime) {
          setSelectSchedule({
            ...selectSchedule,
            ...getTime,
          });
        } else {
          setSelectSchedule({ ...selectSchedule, shiftId: "" });
        }
      } else {
        setSelectSchedule({ ...selectSchedule, shiftId: "" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSchedule.shift]);

  useEffect(() => {
    if (
      selectSchedule.serviceName === "" ||
      handleList(listService, selectSchedule.serviceName).length === 0
    ) {
      setSelectSchedule({ ...selectSchedule, serviceId: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSchedule.serviceName]);

  useEffect(() => {
    if (
      selectSchedule.doctor === "" ||
      handleList(listDoctor, selectSchedule.doctor).length === 0
    ) {
      setSelectSchedule({ ...selectSchedule, doctorId: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSchedule.doctor]);

  useEffect(() => {
    if (selectSchedule.name) {
      const selectDate = new Date(
        selectSchedule.date.year,
        selectSchedule.date.month - 1,
        selectSchedule.date.day
      );
      const numberWeek = getWeek(selectDate);
      setSelectSchedule({
        ...selectSchedule,
        week: numberWeek,
        day: stringDay(selectDate.getDay()),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectSchedule.date]);

  useEffect(() => {
    if (window.localStorage.getItem("CurrentData")) {
      const currentData = JSON.parse(
        window.localStorage.getItem("CurrentData")
      );
      setSelectSchedule({
        ...selectSchedule,
        id: currentData.appointment.id,
        date: currentData.appointment.date,
        name: currentData.patient.name,
        patientId: currentData.patient.id,
        service: currentData.appointment.serviceName,
        serviceId: currentData.appointment.serviceId,
        departmentId: currentData.appointment.departmentId,
        doctor: currentData.appointment.doctor,
        doctorId: currentData.appointment.doctorId,
      });
    }
    currentContext.setNotification({
      ...currentContext.notification,
      isOpen: false,
      handle: "pending",
    });
    getConsulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsPedding({ ...isPedding, doctorRoom: true });
    const timer = setTimeout(() => {
      if (selectSchedule.name) {
        getDoctorRoom();
      }
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectSchedule.date,
    selectSchedule.shift,
    selectSchedule.week,
    selectSchedule.doctorId,
    selectSchedule.serviceId,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (listDoctorRoom.length > 0) {
      const listRooms = listDoctorRoom
        .map((item) => {
          return { Name: item.Room.Name, Id: item.Room.Id };
        })
        .filter(
          (item, index, self) =>
            self.findIndex((obj) => obj.Id === item.Id) === index
        );
      const listDoctors = listDoctorRoom
        .map((item) => {
          return { Name: item.Employee.Name, Id: item.Employee.Id };
        })
        .filter(
          (item, index, self) =>
            self.findIndex((obj) => obj.Id === item.Id) === index
        );

      setListDoctor(listDoctors);
      setListRoom(listRooms);
      getServices()
    }
    }, 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listDoctorRoom]);

  return (
    <div
      className="flex flex-col w-full justify-center items-center gap-5 pb-5"
      onClick={() => {
        setFocusInput(selectScheduleLogic);
      }}
    >
      <div className="flex gap-5 justify-center w-full">
        <div className="flex flex-col items-center w-[45%] min-w-[850px] gap-5 py-5">
          <div className="w-full">
            <input
              value={selectSchedule.name}
              className="w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear border-[#005121]"
              type="text"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <InputListSearch
              className={"relative z-[9] w-1/4"}
              inputRefs={inputRefs}
              focusRef={focusRef}
              object={selectSchedule}
              keyObject={"shift"}
              logic={focusInput}
              keyLogic={"focusShift"}
              handleObject={handleChange}
              setObject={setSelectSchedule}
              handleLogic={setFocusInput}
              list={listConsultation}
              lable={"Giờ khám"}
            />
            <div className="relative w-1/4">
              <input
                className="w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear border-[#005121]"
                value={selectSchedule.week}
              />
              <div
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  selectSchedule.week
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Tuần</p>
              </div>
            </div>
            <div className="relative w-1/4">
              <input
                className="w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear border-[#005121]"
                value={selectSchedule.day}
              />
              <div
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  selectSchedule.day
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Thứ</p>
              </div>
            </div>
          </div>
          <InputDate
            className={
              "relative z-[8] flex items-center w-full border-2 border-[#005121] rounded-lg px-5 py-2"
            }
            lable={"Ngày"}
            overYear={true}
            object={selectSchedule}
            keyObject={"date"}
            setObject={setSelectSchedule}
            logic={isSelectDate}
            keyLogic={"schedule"}
            handleLogic={setIsSelectDate}
            lableRequire={""}
            inputRequire={false}
          />
        </div>
        <div className="flex flex-col items-center w-[45%] min-w-[850px] gap-5 py-5">
          <div className="relative w-full z-[9]">
            <input
              ref={(el) => (inputRefs.current["serviceName"] = el)}
              name="serviceName"
              value={selectSchedule.serviceName}
              onChange={handleChange}
              onClick={(e) => {
                e.stopPropagation();
                setFocusInput({ ...selectScheduleLogic, focusService: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear border-[#005121]"
              type="text"
            />

            <div
              onClick={(e) => {
                e.stopPropagation();
                focusRef("serviceName");
                setFocusInput({ ...selectScheduleLogic, focusService: true });
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                selectSchedule.serviceName || focusInput.focusService
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Dịch vụ khám</p>
            </div>
            <div
              className={
                "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                (focusInput.focusService ? "max-h-[150px] pt-5" : "max-h-0")
              }
            >
              {handleList(listService, selectSchedule.serviceName).length >
              0 ? (
                handleList(listService, selectSchedule.serviceName).map(
                  (el) => (
                    <div className="w-full">
                      <button
                        key={el.Id}
                        className="w-full bg-white px-5 py-2 border-y-2 border-white duration-200 ease-in-out hover:bg-slate-400 hover:text-white"
                        onClick={() => {
                          setSelectSchedule({
                            ...selectSchedule,
                            serviceName: el.Name,
                            serviceId: el.Id,
                            departmentId: el.DepartmentId,
                          });
                          setFocusInput(selectScheduleLogic);
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
                  )
                )
              ) : (
                <div className="w-full bg-white text-center px-5 py-2 border-y-2 border-white">
                  <p>Không tìm thấy</p>
                </div>
              )}
            </div>
          </div>
          <InputListSearch
            className={"relative z-[7] w-full"}
            inputRefs={inputRefs}
            focusRef={focusRef}
            object={selectSchedule}
            keyObject={"room"}
            logic={focusInput}
            keyLogic={"focusRoom"}
            handleObject={handleChange}
            setObject={setSelectSchedule}
            handleLogic={setFocusInput}
            list={listRoom}
            lable={"Phòng"}
            resetLogic={selectScheduleLogic}
          />
          <InputListSearch
            className={"relative z-[6] w-full"}
            inputRefs={inputRefs}
            focusRef={focusRef}
            object={selectSchedule}
            keyObject={"doctor"}
            logic={focusInput}
            keyLogic={"focusDoctor"}
            handleObject={handleChange}
            setObject={setSelectSchedule}
            handleLogic={setFocusInput}
            resetLogic={selectScheduleLogic}
            list={listDoctor}
            lable={"Bác sĩ"}
          />
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            saveAppointment();
          }}
          disabled={
            listConsultation.length === 0 ||
            !selectSchedule.doctorId ||
            !selectSchedule.shiftId
              ? true
              : false
          }
          className={
            listConsultation.length === 0 ||
            !selectSchedule.doctorId ||
            !selectSchedule.shiftId
              ? "px-5 py-3 bg-slate-300 text-white border-2 border-slate-300 rounded-xl duration-200 ease-in cursor-default"
              : "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
          }
        >
          Hẹn khám
        </button>
      </div>
      <div className="relative flex flex-col w-[95%] h-[450px] bg-slate-300 gap-1">
        <div className="w-full flex items-center justify-center min-w-[1500px]">
          <div className="w-[5%] p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
            <p>Tuần</p>
          </div>
          <div className="w-[8%] p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
            <p>Thứ</p>
          </div>
          <div className="w-[10%] p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
            <p>Ngày</p>
          </div>
          <div className="w-[10%] p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
            <p>Khu</p>
          </div>
          <div className="w-[8%] p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
            <p>Phòng</p>
          </div>
          <div className="w-[10%] p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
            <p>Ca</p>
          </div>
          <div className="w-[15%] p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
            <p>Chuyên khoa</p>
          </div>
          <div className="flex-grow p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
            <p>Tên bác sĩ</p>
          </div>
          <div className="w-[10%] p-3 bg-[#00BA4B] text-white text-center">
            <p>Trạng thái</p>
          </div>
        </div>
        {isPedding.doctorRoom ? (
          <div className="flex w-full h-full justify-center items-center border-2 border-slate-300 bg-white">
            <Loader></Loader>
          </div>
        ) : listDoctorRoom.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center border-2 border-slate-300 bg-white text-slate-400 text-center font-bold">
            <p>Lịch hôm nay trống</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-1 items-center min-w-[1500px] scrollbarList overflow-y-auto overflow-x-hidden">
            {listDoctorRoom.map((el) => (
              <div
                onClick={() => getData(el)}
                className="w-full flex items-center justify-center min-w-[1500px] duration-200 ease-out cursor-pointer hover:scale-[1.02]"
              >
                <div className="w-[5%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
                  <p>{el.Week}</p>
                </div>
                <div className="w-[8%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
                  <p>{stringDay(el.Day)}</p>
                </div>
                <div className="w-[10%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
                  <p>{formatDate(el.Date)}</p>
                </div>
                <div className="w-[10%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
                  <p>{el.Room.Department.Zone}</p>
                </div>
                <div className="w-[8%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
                  <p>{el.Room.Name}</p>
                </div>
                <div className="w-[10%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
                  <p>{el.Shift}</p>
                </div>
                <div className="w-[15%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
                  <p className="truncate">{el.Room.Department.Name}</p>
                </div>
                <div className="flex-grow p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
                  <p>{el.Employee.Name}</p>
                </div>
                <div className="w-[10%] p-3 bg-white text-[#005121] text-center">
                  <p>{el.Valable + "/" + el.Slot}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
