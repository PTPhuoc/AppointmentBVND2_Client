import React, { useContext, useEffect, useState } from "react";
import {
  scheduleObject,
  scheduleLogic,
  duplicate,
  listState,
  intDay,
  stringDay,
  handleList,
  formatDate,
} from "../Functions/HandleSchedule";
import InputDate from "./InputDate";
import axios from "axios";
import { getWeek, isSameDay } from "date-fns";
import Loader from "./Loader";
import ObjectDoctorRoom from "./ObjectDoctorRoom";
import { userContext } from "../Context/User";
import { useNavigate } from "react-router-dom";

export default function Schedule() {
  const currentContext = useContext(userContext);
  const [schedule, setSchedule] = useState(scheduleObject);
  const [isFocusInput, setIsFocusInput] = useState(scheduleLogic);
  const [isSelectDate, setIsSelectDate] = useState({ schedule: false });
  const [isPedding, setIsPedding] = useState({
    doctorRoom: true,
  });
  const [listRoom, setListRoom] = useState([]);
  const [listShift, setListShift] = useState([]);
  const [listDoctor, setListDoctor] = useState([]);
  const [listDoctorRoom, setListDocTorRoom] = useState([]);
  const [isForm, setIsForm] = useState({
    createSchedule: false,
    updateSchedule: false,
    duplicateSchedule: false,
  });
  const [targetDuplicate, setTargetDuplicate] = useState(duplicate);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule({ ...schedule, [name]: value });
  };

  const getRoom = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/room/get-all-room")
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListRoom(rs.data.Rooms);
        } else {
          setListRoom([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getShift = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/shift/get-all-shift")
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListShift(rs.data.Shifts);
        } else {
          setListShift([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDocTor = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/employee/get-type-employee", {
        params: { type: "Bác sĩ" },
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListDoctor(rs.data.Employees);
        } else {
          setListDoctor([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDoctorRoom = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/doctor-room/get-doctor-room", {
        params: {
          week: schedule.week,
          date: new Date(
            schedule.date.year,
            schedule.date.month - 1,
            schedule.date.day
          ),
        },
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListDocTorRoom(rs.data.DoctorRooms);
        } else {
          setListDocTorRoom([]);
        }
        setIsPedding({ doctorRoom: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSaveSchedule = () => {
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/doctor-room/" +
          (isForm.updateSchedule ? "update-doctor-room" : "add-doctor-room"),
        {
          ...schedule,
          employeeId: schedule.doctorId,
          day: intDay(schedule.day),
          state: schedule.stateId,
          date: new Date(
            schedule.date.year,
            schedule.date.month - 1,
            schedule.date.day
          ),
        }
      )
      .then((rs) => {
        if (rs.data.Status === "Success") {
          getDoctorRoom();
          setSchedule({
            ...schedule,
            shift: "",
            room: "",
            department: "",
            doctor: "",
          });
          setIsForm({ createSchedule: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteSchedule = () => {
    axios
      .delete(
        process.env.REACT_APP_API_URL + "/doctor-room/delete-doctor-room",
        { params: { id: schedule.id } }
      )
      .then((rs) => {
        if (rs.data.Status === "Success") {
          getDoctorRoom();
          setIsPedding({ doctorRoom: false });
        } else {
          console.log(rs.data.Message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteAllDoctorRoom = (week, date) => {
    axios
      .delete(
        process.env.REACT_APP_API_URL + "/doctor-room/delete-all-doctor-room",
        {
          params: {
            week: week,
            date: date,
          },
        }
      )
      .then((rs) => {
        if (rs.data.Status === "Success") {
          currentContext.setNotification({
            ...currentContext.notification,
            isOpen: true,
            content: "Xóa tất cả thành công",
            option: "N",
            for: "DelectAllDoctorRoom",
            handle: "pending",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const duplicateDoctorRoom = (object, targetObject) => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "/doctor-room/duplicate-doctor-room",
        {
          week: object.week,
          day: intDay(object.day),
          date: new Date(
            object.date.year,
            object.date.month - 1,
            object.date.day
          ),
          targetWeek: targetObject.week,
          targetDay: intDay(targetObject.day),
          targetDate: new Date(
            targetObject.date.year,
            targetObject.date.month - 1,
            targetObject.date.day
          ),
        }
      )
      .then((rs) => {
        if (rs.data.Status === "Success") {
          currentContext.setNotification({
            ...currentContext.notification,
            isOpen: true,
            content: "Nhân đôi tất cả thành công",
            option: "N",
            for: "DuplicateDoctorRoom",
            handle: "pending",
          });
          setIsForm({ ...isForm, duplicateSchedule: false });
        } else if (rs.data.Status === "Has Data") {
          currentContext.setWindowWarning({
            ...currentContext.windowWarning,
            for: "InsertDoctorRoom",
            isOpen: true,
            content:
              "Lịch tuần " +
              object.week +
              ", thứ " +
              object.day +
              ", ngày " +
              formatDate(
                new Date(
                  object.date.year,
                  object.date.month - 1,
                  object.date.day
                )
              ) +
              " đã có cho ngày " +
              formatDate(
                new Date(
                  targetObject.date.year,
                  targetObject.date.month - 1,
                  targetObject.date.day
                )
              ) +
              ", bạn có muốn thay thế!",
            handle: "pending",
          });
          setIsForm({ ...isForm, duplicateSchedule: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const insertDoctorRoom = (object, targetObject) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/doctor-room/insert-doctor-room", {
        week: object.week,
        day: intDay(object.day),
        date: new Date(
          object.date.year,
          object.date.month - 1,
          object.date.day
        ),
        targetWeek: targetObject.week,
        targetDay: intDay(targetObject.day),
        targetDate: new Date(
          targetObject.date.year,
          targetObject.date.month - 1,
          targetObject.date.day
        ),
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          currentContext.setWindowWarning({
            ...currentContext.windowWarning,
            for: "",
            isOpen: false,
            handle: "pending",
          });
          currentContext.setNotification({
            ...currentContext.notification,
            isOpen: true,
            content: "Thay thế thành công",
            option: "N",
            for: "InsertDoctorRoom",
            handle: "pending",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigate = useNavigate();

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
        currentContext.setNotification({
          ...currentContext.notification,
          isOpen: false,
          handle: "pending",
        });
        getRoom();
        getShift();
        getDocTor();
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
    currentContext.setNotification({
      ...currentContext.notification,
      isOpen: false,
      handle: "pending",
    });
    getRoom();
    getShift();
    getDocTor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selectDate = new Date(
      schedule.date.year,
      schedule.date.month - 1,
      schedule.date.day
    );
    const numberWeek = getWeek(selectDate, { weekStartsOn: 0 });
    setSchedule({
      ...schedule,
      week: numberWeek,
      day: stringDay(selectDate.getDay()),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.date]);

  useEffect(() => {
    if (!isForm.updateSchedule) {
      setIsPedding({ doctorRoom: true });
    }
    const timer = setTimeout(() => {
      if (!isForm.updateSchedule) {
        getDoctorRoom();
      }
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.date, currentContext.windowWarning.handle]);

  useEffect(() => {
    if (currentContext.windowWarning.handle === "Success") {
      setIsPedding({ ...isPedding, doctorRoom: true });
      if (currentContext.windowWarning.for === "DeleteAllDoctorRoom") {
        deleteAllDoctorRoom(
          schedule.week,
          new Date(
            schedule.date.year,
            schedule.date.month - 1,
            schedule.date.day
          )
        );
      }
      if (currentContext.windowWarning.for === "DuplicateDoctorRoom") {
        duplicateDoctorRoom(targetDuplicate, schedule);
      }
      if (currentContext.windowWarning.for === "InsertDoctorRoom") {
        setIsPedding({ ...isPedding, doctorRoom: true });
        deleteAllDoctorRoom(
          schedule.week,
          new Date(
            schedule.date.year,
            schedule.date.month - 1,
            schedule.date.day
          )
        );
        insertDoctorRoom(targetDuplicate, schedule);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContext.windowWarning]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-3"
      onClick={() => {
        setIsFocusInput(scheduleLogic);
      }}
    >
      <div className="flex flex-wrap w-full items-center gap-3">
        <div className="relative p-3 flex flex-grow flex-wrap gap-3 items-center justify-center">
          <div className="relative w-[200px]">
            <input
              className="w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear border-[#005121]"
              value={schedule.week}
            />
            <div
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                schedule.week
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Tuần</p>
            </div>
          </div>
          <div className="relative w-[200px]">
            <input
              className="w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear border-[#005121]"
              value={schedule.day}
            />
            <div
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                schedule.day
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Thứ</p>
            </div>
          </div>
          <InputDate
            className={
              "relative z-[3] flex items-center w-[300px] border-2 border-[#005121] rounded-lg px-5 py-2"
            }
            lable={"Ngày"}
            overYear={true}
            object={schedule}
            keyObject={"date"}
            setObject={setSchedule}
            logic={isSelectDate}
            keyLogic={"schedule"}
            handleLogic={setIsSelectDate}
            lableRequire={""}
            inputRequire={false}
          />
          {(isForm.createSchedule || isForm.updateSchedule) && (
            <div className="absolute z-[5] w-full h-full bg-white opacity-80"></div>
          )}
        </div>
        <div className="relative flex p-3 flex-grow gap-3 items-center justify-center md">
          {isForm.duplicateSchedule ? (
            <div>
              <button
                onClick={() => {
                  currentContext.setWindowWarning({
                    ...currentContext.windowWarning,
                    for: "DuplicateDoctorRoom",
                    isOpen: true,
                    content:
                      "Bạn có chắc muốn nhân đôi toàn bộ giờ làm của bác sĩ tại tuần " +
                      targetDuplicate.week +
                      ", thứ " +
                      targetDuplicate.day +
                      ", ngày " +
                      formatDate(
                        new Date(
                          targetDuplicate.date.year,
                          targetDuplicate.date.month - 1,
                          targetDuplicate.date.day
                        )
                      ) +
                      " cho tuần " +
                      targetDuplicate.week +
                      ", thứ " +
                      targetDuplicate.day +
                      ",ngày " +
                      formatDate(
                        new Date(
                          schedule.date.year,
                          schedule.date.month - 1,
                          schedule.date.day
                        )
                      ),
                    handle: "pending",
                  });
                }}
                disabled={
                  !isSameDay(
                    new Date(
                      targetDuplicate.date.year,
                      targetDuplicate.date.month - 1,
                      targetDuplicate.date.day
                    ),
                    new Date(
                      schedule.date.year,
                      schedule.date.month - 1,
                      schedule.date.day
                    )
                  )
                    ? false
                    : true
                }
                className={
                  !isSameDay(
                    new Date(
                      targetDuplicate.date.year,
                      targetDuplicate.date.month - 1,
                      targetDuplicate.date.day
                    ),
                    new Date(
                      schedule.date.year,
                      schedule.date.month - 1,
                      schedule.date.day
                    )
                  )
                    ? "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
                    : "px-5 py-3 bg-slate-300 text-white border-2 border-slate-300 rounded-xl duration-200 ease-in"
                }
              >
                Xác nhận
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => {
                  setIsForm({ ...isForm, duplicateSchedule: true });
                  setTargetDuplicate({
                    week: schedule.week,
                    day: schedule.day,
                    date: { ...schedule.date },
                  });
                }}
                disabled={listDoctorRoom.length > 0 ? false : true}
                className={
                  listDoctorRoom.length > 0
                    ? "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
                    : "px-5 py-3 bg-slate-300 text-white border-2 border-slate-300 rounded-xl duration-200 ease-in"
                }
              >
                Nhân đôi lịch
              </button>
            </div>
          )}
          {isForm.duplicateSchedule ? (
            <div>
              <button
                onClick={() => {
                  setIsForm({ ...isForm, duplicateSchedule: false });
                }}
                className="px-5 py-3 bg-red-500 text-white border-2 border-red-500 rounded-xl duration-200 ease-in hover:bg-white hover:text-red-500"
              >
                Hủy
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => {
                  currentContext.setWindowWarning({
                    ...currentContext.windowWarning,
                    for: "DeleteAllDoctorRoom",
                    isOpen: true,
                    content:
                      "Bạn có chắc muốn xóa toàn bộ giờ làm của bác sĩ tại tuần " +
                      schedule.week +
                      ", thứ " +
                      schedule.day +
                      ", ngày " +
                      formatDate(
                        new Date(
                          schedule.date.year,
                          schedule.date.month - 1,
                          schedule.date.day
                        )
                      ),
                    handle: "pending",
                  });
                }}
                disabled={listDoctorRoom.length > 0 ? false : true}
                className={
                  listDoctorRoom.length > 0
                    ? "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
                    : "px-5 py-3 bg-slate-300 text-white border-2 border-slate-300 rounded-xl duration-200 ease-in"
                }
              >
                Dọn tất cả
              </button>
            </div>
          )}
          {(isForm.createSchedule || isForm.updateSchedule) && (
            <div className="absolute z-[2] w-full h-full bg-white opacity-80"></div>
          )}
        </div>
        <div className="relative flex flex-col w-full h-[690px] bg-slate-300 gap-1 overflow-auto">
          {isForm.duplicateSchedule && (
            <div className="absolute z-[2] top-0 left-0 w-full h-full bg-white opacity-30"></div>
          )}
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
            <div className="w-[15%] p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
              <p>Phòng</p>
            </div>
            <div className="w-[5%] p-3 bg-[#00BA4B] text-white border-r-2 border-white text-center">
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
            <div className="flex w-full justify-center bg-white p-10">
              <Loader></Loader>
            </div>
          ) : listDoctorRoom.length === 0 ? (
            <div className="w-full p-10 bg-white text-slate-400 text-center font-bold">
              <p>Lịch hôm nay trống</p>
            </div>
          ) : (
            listDoctorRoom.map((el) => (
              <ObjectDoctorRoom
                object={el}
                onObject={schedule}
                form={isForm}
                setForm={setIsForm}
                setObject={setSchedule}
              />
            ))
          )}
          <div className="w-full h-1 bg-[#005121]"></div>
          <div
            className={
              "scrollbarList w-full flex min-w-[1500px] duration-200 ease-in-out " +
              (isForm.createSchedule
                ? "max-h-[70px]"
                : "max-h-[0] overflow-hidden")
            }
          >
            <div className="w-[5%] p-3 bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
              <p>{schedule.week}</p>
            </div>
            <div className="w-[8%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
              <p>{schedule.day}</p>
            </div>
            <div className="w-[10%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
              <p>
                {schedule.date.day +
                  "/" +
                  schedule.date.month +
                  "/" +
                  schedule.date.year}
              </p>
            </div>
            <div className="w-[10%] p-3 bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
              <p>{schedule.zone}</p>
            </div>
            <div className="relative w-[15%] p-3 bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
              <input
                className="w-full outline-none"
                placeholder="Tên phòng"
                name="room"
                type="text"
                value={schedule.room}
                onChange={handleChange}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onFocus={() => {
                  setIsFocusInput({ ...scheduleLogic, focusRoom: true });
                }}
              />
              <div
                className={
                  "absolute scrollbarList w-full overflow-auto left-0 top-0 translate-y-14 flex flex-col gap-1 items-center bg-slate-100 duration-200 ease-in-out " +
                  (isFocusInput.focusRoom ? "max-h-[150px]" : "max-h-0")
                }
              >
                {handleList(listRoom, schedule.room).map((el) => (
                  <div className="w-full">
                    <button
                      onClick={() => {
                        setSchedule({
                          ...schedule,
                          room: el.Name,
                          roomId: el.Id,
                          department: el.Department.Name,
                          departmentId: el.Department.Id,
                        });
                      }}
                      className="bg-white w-full py-3 text-[#005121] duration-200 ease-linear hover:bg-[#00BA4B] hover:text-white"
                    >
                      {el.Name + el.CodeName + " - " + el.Department.Name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-[5%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
              <input
                className="w-full outline-none"
                placeholder="Ca"
                type="text"
                value={schedule.shift}
                name="shift"
                onChange={handleChange}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onFocus={() => {
                  setIsFocusInput({ ...scheduleLogic, focusShift: true });
                }}
              />
              <div
                className={
                  "absolute scrollbarList w-full overflow-auto left-0 top-0 translate-y-14 flex flex-col gap-1 items-center bg-slate-100 duration-200 ease-in-out " +
                  (isFocusInput.focusShift ? "max-h-[150px]" : "max-h-0")
                }
              >
                {handleList(listShift, schedule.shift).map((el) => (
                  <div className="w-full">
                    <button
                      onClick={() => {
                        setSchedule({
                          ...schedule,
                          shift: el.Name,
                          shiftId: el.Id,
                        });
                      }}
                      className="bg-white w-full py-3 text-[#005121] duration-200 ease-linear hover:bg-[#00BA4B] hover:text-white"
                    >
                      {el.Name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[15%] p-3 bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center ">
              <p className="w-full truncate">{schedule.department}</p>
            </div>
            <div className="relative flex-grow p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
              <input
                className="w-full outline-none"
                placeholder="Tên bác sĩ"
                type="text"
                value={schedule.doctor}
                name="doctor"
                onChange={handleChange}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onFocus={() => {
                  setIsFocusInput({ ...scheduleLogic, focusDocTor: true });
                }}
              />
              <div
                className={
                  "absolute scrollbarList w-full overflow-auto left-0 top-0 translate-y-14 flex flex-col gap-1 items-center bg-slate-100 duration-200 ease-in-out " +
                  (isFocusInput.focusDocTor ? "max-h-[150px]" : "max-h-0")
                }
              >
                {handleList(listDoctor, schedule.doctor).map((el) => (
                  <div className="w-full">
                    <button
                      onClick={() => {
                        setSchedule({
                          ...schedule,
                          doctor: el.Name,
                          doctorId: el.Id,
                        });
                      }}
                      className="bg-white w-full py-3 text-[#005121] duration-200 ease-linear hover:bg-[#00BA4B] hover:text-white"
                    >
                      {el.Name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-[10%] p-3 bg-white text-[#00BA4B] text-center">
              <input
                className="w-full outline-none"
                placeholder="Trạng thái"
                type="text"
                value={schedule.state}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onFocus={() => {
                  setIsFocusInput({ ...scheduleLogic, focusState: true });
                }}
              />
              <div
                className={
                  "absolute scrollbarList w-full overflow-auto left-0 top-0 translate-y-14 flex flex-col gap-1 items-center bg-slate-100 duration-200 ease-in-out " +
                  (isFocusInput.focusState ? "max-h-[150px]" : "max-h-0")
                }
              >
                {listState.map((el) => (
                  <div className="w-full">
                    <button
                      onClick={() => {
                        setSchedule({
                          ...schedule,
                          state: el.state,
                          stateId: el.id,
                        });
                      }}
                      className="bg-white w-full py-3 text-[#005121] duration-200 ease-linear hover:bg-[#00BA4B] hover:text-white"
                    >
                      {el.state}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full bg-white gap-2 p-2">
            {isForm.createSchedule ? (
              <>
                <div>
                  <button
                    onClick={() => {
                      setIsPedding({ doctorRoom: true });
                      setIsForm({
                        ...isForm,
                        createSchedule: false,
                        updateSchedule: false,
                      });
                      handleSaveSchedule();
                    }}
                    disabled={
                      schedule.room && schedule.shift && schedule.doctor
                        ? false
                        : true
                    }
                    className={
                      schedule.room && schedule.shift && schedule.doctor
                        ? "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
                        : "px-5 py-3 bg-slate-300 text-white border-2 border-slate-300 rounded-xl duration-200 ease-in"
                    }
                  >
                    Xác nhận
                  </button>
                </div>
                {isForm.updateSchedule && (
                  <div>
                    <button
                      onClick={() => {
                        setIsPedding({ doctorRoom: true });
                        setIsForm({
                          ...isForm,
                          createSchedule: false,
                          updateSchedule: false,
                        });
                        setSchedule({
                          ...schedule,
                          shift: "",
                          room: "",
                          department: "",
                          doctor: "",
                        });
                        handleDeleteSchedule();
                      }}
                      className="px-5 py-3 bg-red-500 text-white border-2 border-red-500 rounded-xl duration-200 ease-in hover:bg-white hover:text-red-500"
                    >
                      Xóa
                    </button>
                  </div>
                )}
                <div>
                  <button
                    onClick={() => {
                      setIsForm({
                        ...isForm,
                        createSchedule: false,
                        updateSchedule: false,
                      });
                      setSchedule({
                        ...schedule,
                        shift: "",
                        room: "",
                        department: "",
                        doctor: "",
                      });
                    }}
                    className="px-5 py-3 bg-orange-500 text-white border-2 border-orange-500 rounded-xl duration-200 ease-in hover:bg-white hover:text-orange-500"
                  >
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsForm({ ...isForm, createSchedule: true });
                  }}
                  className="px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
                >
                  Thêm mới
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
