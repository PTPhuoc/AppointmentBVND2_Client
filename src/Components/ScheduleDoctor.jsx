import React, { useContext, useEffect, useState } from "react";
import InputShow from "./InputShow";
import InputDateEdit from "./InputDateEdit";
import {
  scheduleObject,
  listTypeDay,
  optionScheduleObject,
  listStates,
  handleInsertOptionSchedule,
  handleInserSchedule,
  filterDoctorRoom,
} from "../Functions/HandleScheduleDoctor";
import { userContext } from "../Context/User";
import InputSelectSearch from "./InputSelectSearch";
import CheckDefault from "./CheckDefault";
import axios from "axios";
import InputTableList from "./InputTableList";
import { intDay, UTCTimeToString } from "../Functions/HandleDate";
import Loader from "./Loader";
import WindowInput from "./WindowInput";
import InputTable from "./InputTable";
import { useNavigate } from "react-router-dom";

export default function ScheduleDoctor() {
  const currentContext = useContext(userContext);
  const [schedule, setSchedule] = useState(scheduleObject);
  const [optionSchedule, setOptionSchedule] = useState(optionScheduleObject);
  const [listShifts, setListShifts] = useState([]);
  const [listRooms, setListRooms] = useState([]);
  const [listDoctors, setListDoctors] = useState([]);
  const [listDoctorRooms, setListDoctorRooms] = useState([]);
  const [listSchedules, setListSchedules] = useState([]);
  const [isOpen, setIsOpen] = useState({
    createTab: false,
    update: false,
  });
  const [isPending, setIsPending] = useState({
    listDoctorRooms: true,
  });

  const navigate = useNavigate();

  const getSchedule = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/schedule/all-schedule")
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListSchedules(rs.data.Schedules);
        } else {
          setListSchedules([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getShifts = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/shift/get-all-shift")
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListShifts(rs.data.Shifts);
        } else {
          setListShifts([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDocTors = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/employee/get-type-employee", {
        params: { type: "Bác sĩ" },
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListDoctors(rs.data.Employees);
        } else {
          setListDoctors([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRooms = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/room/get-all-room")
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListRooms(rs.data.Rooms);
        } else {
          setListRooms([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDoctorRooms = () => {
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
          setListDoctorRooms(rs.data.DoctorRooms);
        } else {
          setListDoctorRooms([]);
        }
        setIsPending({ listDoctorRooms: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateSchedule = (name) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/schedule/create-schedule", {
        name: name,
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          getSchedule();
          setIsOpen({ ...isOpen, createTab: false });
        } else {
          currentContext.setNotification({
            for: "UniqueName",
            content: "Tên " + name + " đã được sử dụng!",
            isOpen: true,
            option: "N",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteSchedule = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/schedule/delete-schedule", {
        name: optionSchedule.name,
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          getSchedule();
          getDoctorRooms();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateSchedule = () => {
    setOptionSchedule((preSchedule) => {
      axios
        .post(process.env.REACT_APP_API_URL + "/schedule/update-schedule", {
          listDay: {
            Monday: preSchedule.monday,
            Tuesday: preSchedule.tuesday,
            Wednesday: preSchedule.wednesday,
            Thursday: preSchedule.thursday,
            Friday: preSchedule.friday,
            Saturday: preSchedule.saturday,
            Sunday: preSchedule.sunday,
          },
          name: preSchedule.name,
          status: preSchedule.status,
          targetName: preSchedule.targetName,
        })
        .then((rs) => {
          if (rs.data.Status === "Success") {
            getSchedule();
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return preSchedule;
    });
  };

  const handleCheckUpdateOne = (value, keyDay, lable) => {
    const scheduleCompare = listSchedules.filter(
      (item) => item.Name !== optionSchedule.name && item.Status
    );
    if (scheduleCompare.length > 0) {
      const hasSet = scheduleCompare.find((item) => item[keyDay] === true);
      if (hasSet) {
        setOptionSchedule((preSchedule) => {
          return { ...preSchedule, targetName: hasSet.Name };
        });
        currentContext.setWindowWarning({
          for: "UpdateScheduleOne",
          content:
            "Hiện tại " +
            hasSet.Name +
            " cũng có lịch cho " +
            lable +
            ". Bạn có muốn chuyển lịch cho " +
            optionSchedule.name,
          handle: "pending",
          isOpen: true,
        });
      } else {
        setOptionSchedule((preSchedule) => {
          return { ...preSchedule, targetName: null };
        });
        handleUpdateSchedule();
      }
    } else {
      setOptionSchedule((preSchedule) => {
        return { ...preSchedule, targetName: null };
      });
      handleUpdateSchedule();
    }
  };

  const handleCheckUpdateMany = (value) => {
    if (value) {
      const otherSchedule = listSchedules.filter(
        (item) => item.Name !== optionSchedule.name && item.Status
      );
      if (otherSchedule.length > 0) {
        let hasSet = [];
        for (let item of otherSchedule) {
          for (let key of Object.keys(otherSchedule[0])) {
            if (item[key] === optionSchedule[key.toLowerCase()] && item[key]) {
              hasSet.push(item.Name);
              break;
            }
          }
        }
        if (hasSet.length > 0) {
          const content = hasSet.reduce((acc, cur, index) => {
            if (index === 0) {
              return acc + cur;
            } else {
              return acc + ", " + cur;
            }
          }, "");
          currentContext.setWindowWarning({
            for: "UpdateScheduleMany",
            content:
              "Hiện tại các bảng " +
              content +
              " cũng có lịch tương đồng với " +
              optionSchedule.name +
              ". Bạn có muốn chuyển lịch cho " +
              optionSchedule.name,
            handle: "pending",
            isOpen: true,
          });
        } else {
          handleUpdateSchedule();
        }
      } else {
        handleUpdateSchedule();
      }
    } else {
      handleUpdateSchedule();
    }
  };

  const handleCreate = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/doctor-room/add-doctor-room", {
        employeeId: schedule.doctorId,
        scheduleId: optionSchedule.name,
        shiftId: schedule.shiftId,
        roomId: schedule.roomId,
        week: schedule.week,
        day: intDay(schedule.day),
        maxTime: schedule.maxTime,
        date: new Date(
          schedule.date.year,
          schedule.date.month - 1,
          schedule.date.day
        ),
        state: schedule.stateId,
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          getDoctorRooms();
          setSchedule(scheduleObject);
        } else if (rs.data.Status === "Server Error") {
          console.log(rs.data.Message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/doctor-room/update-doctor-room", {
        id: schedule.id,
        employeeId: schedule.doctorId,
        scheduleId: optionSchedule.name,
        shiftId: schedule.shiftId,
        roomId: schedule.roomId,
        week: schedule.week,
        day: intDay(schedule.day),
        maxTime: schedule.maxTime,
        date: new Date(
          schedule.date.year,
          schedule.date.month - 1,
          schedule.date.day
        ),
        state: schedule.stateId,
      })
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setSchedule(scheduleObject);
          getDoctorRooms();
        } else if (rs.data.Status === "Server Error") {
          console.log(rs.data.Message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    axios
      .delete(
        process.env.REACT_APP_API_URL + "/doctor-room/delete-doctor-room",
        {
          params: { id: schedule.id },
        }
      )
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setSchedule(scheduleObject);
          getDoctorRooms();
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
      if (currentContext.Account.id) {
        getShifts();
        getRooms();
        getDocTors();
        getDoctorRooms();
        getSchedule();
      } else {
        navigate("/signin");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContext.pendingPage]);

  useEffect(() => {
    if (listSchedules.length > 0) {
      if (optionSchedule.name) {
        const findSame = listSchedules.find(
          (item) => item.Name === optionSchedule.name
        );
        if (findSame) {
          setOptionSchedule(handleInsertOptionSchedule(findSame));
        } else {
          const filterActive = listSchedules.filter(
            (item) => item.Status === true
          );
          setOptionSchedule(handleInsertOptionSchedule(filterActive[0]));
        }
      } else {
        const filterActive = listSchedules.filter(
          (item) => item.Status === true
        );
        setOptionSchedule(handleInsertOptionSchedule(filterActive[0]));
      }
    } else {
      setOptionSchedule(optionScheduleObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSchedules]);

  useEffect(() => {
    if (currentContext.windowWarning.handle === "Success") {
      if (currentContext.windowWarning.for === "DeleteSchedule") {
        handleDeleteSchedule();
        currentContext.setWindowWarning({
          ...currentContext.windowWarning,
          handle: "pending",
          for: "",
        });
      } else if (
        currentContext.windowWarning.for === "UpdateScheduleOne" ||
        currentContext.windowWarning.for === "UpdateScheduleMany"
      ) {
        handleUpdateSchedule();
      } else if (currentContext.windowWarning.for === "DeleteScheduleObject") {
        handleDelete();
      }
    } else if (currentContext.windowWarning.handle === "Fault") {
      if (
        currentContext.windowWarning.for === "UpdateScheduleOne" ||
        currentContext.windowWarning.for === "UpdateScheduleMany"
      ) {
        getSchedule();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContext.windowWarning.handle]);

  return (
    <div className="relative flex flex-col w-full items-center">
      {isOpen.createTab && (
        <div className="absolute flex justify-center items-center top-0 left-0 h-full w-full z-[9] bg-[rgba(255,255,255,0.7)]">
          <WindowInput
            lable={"Đặt tên bảng"}
            handleStatus={(value) => {
              setIsOpen({ ...isOpen, createTab: value });
            }}
            setObject={(value) => handleCreateSchedule(value)}
          />
        </div>
      )}
      <div className="flex justify-between items-center w-full px-20 py-5">
        <div className="flex gap-5">
          <InputShow
            object={schedule}
            objectKey={"week"}
            lable={"Tuần"}
            className={"w-[100px] h-[50px]"}
          />
          <InputDateEdit
            object={schedule.date}
            className={"w-[350px] z-[8]"}
            setObject={(e) => {
              const { name, value } = e.target;
              setSchedule({
                ...schedule,
                date: { ...schedule.date, [name]: value },
              });
            }}
            insertDate={(date) => {
              setSchedule({
                ...schedule,
                date: {
                  day: date.getDate(),
                  month: date.getMonth() + 1,
                  year: date.getFullYear(),
                },
              });
            }}
            lable={"Ngày"}
            insertObject={(date) => {
              setSchedule({ ...schedule, date: { ...date } });
            }}
          />
          <InputSelectSearch
            className={"w-[300px] z-[8]"}
            object={optionSchedule}
            objectKey={"typeDay"}
            lable={"Loại ngày"}
            list={listTypeDay}
            listKey={"typeDay"}
            setObject={(value) =>
              setOptionSchedule({ ...optionSchedule, typeDay: value })
            }
            insertList={(item) =>
              setOptionSchedule({ ...optionSchedule, typeDay: item.typeDay })
            }
            showList={(item) => {
              return (
                <div>
                  <p>{item.typeDay}</p>
                </div>
              );
            }}
          />
        </div>
        <div className="flex gap-5">
          <button
            disabled={!optionSchedule.name}
            onClick={(e) => {
              e.stopPropagation();
              setOptionSchedule({
                ...optionSchedule,
                status: !optionSchedule.status,
              });
              handleCheckUpdateMany(!optionSchedule.status);
            }}
            className={
              optionSchedule.name
                ? "h-full w-[200px] bg-orange-500 border-2 border-orange-500 p-2 text-white rounded-xl duration-200 ease-linear hover:bg-white hover:text-orange-500"
                : "h-full w-[200px] text-center bg-zinc-300 text-white p-2 border-2 border-zinc-300 rounded-xl"
            }
          >
            {optionSchedule.status ? "Vô hiệu hóa bảng" : "Sử dụng bảng"}
          </button>
          <button
            disabled={optionSchedule.name ? false : true}
            onClick={(e) => {
              e.stopPropagation();
              currentContext.setWindowWarning({
                for: "DeleteSchedule",
                content:
                  "Bạn có chắc muốn xóa " + optionSchedule.name + " không!",
                isOpen: true,
              });
            }}
            className={
              optionSchedule.name
                ? "h-full w-[200px] bg-red-500 border-2 border-red-500 p-2 text-white rounded-xl duration-200 ease-linear hover:bg-white hover:text-red-500"
                : "h-full w-[200px] text-center bg-zinc-300 text-white p-2 border-2 border-zinc-300 rounded-xl"
            }
          >
            Xóa bảng
          </button>
        </div>
      </div>
      <div className="flex justify-center h-[659px] w-full bg-slate-200">
        <div className="flex flex-col w-full">
          <div className="flex w-full bg-[#00BA4B] border-b-2">
            <div className="flex w-[150px] justify-center items-center text-white border-r-2">
              <p>Ca làm</p>
            </div>
            <div className="flex w-[200px] justify-center items-center text-center text-white border-r-2">
              <p>Phòng</p>
            </div>
            <div className="flex w-[150px] justify-center items-center text-center text-white border-r-2">
              <p>Thời gian</p>
            </div>
            <div className="flex w-[150px] justify-center items-center text-center text-white border-r-2">
              <p>Khu</p>
            </div>
            <div className="flex flex-grow justify-center items-center text-center text-white border-r-2">
              <p>Tên bác sĩ</p>
            </div>
            <div className="flex w-[300px] justify-center items-center text-center text-white border-r-2">
              <p>Khoa</p>
            </div>
            <div className="flex w-[150px] justify-center items-center text-center text-white border-r-2">
              <p>Thời gian khám/(BN)</p>
            </div>
            <div className="flex w-[150px] justify-center items-center text-center text-white border-r-2">
              <p>Trạng thái</p>
            </div>
          </div>
          <div className="flex w-full bg-white border-b-2">
            <div className="w-[150px] border-r-2">
              <InputTableList
                className={"z-[7] text-[#00BA4B]"}
                list={listShifts}
                listKey={"Name"}
                lable={"Nhập ca"}
                object={schedule}
                objectKey={"shift"}
                setObject={(value) =>
                  setSchedule({ ...schedule, shift: value })
                }
                showList={(item) => {
                  return <div>{item.Name}</div>;
                }}
                insertList={(item) =>
                  setSchedule({
                    ...schedule,
                    shift: item.Name,
                    shiftId: item.Id,
                    timeStart: UTCTimeToString(item.Start),
                    timeEnd: UTCTimeToString(item.End),
                  })
                }
              />
            </div>
            <div className="w-[200px] border-r-2">
              <InputTableList
                className={"z-[7] text-[#00BA4B]"}
                list={listRooms}
                listKey={"Name"}
                lable={"Nhập phòng"}
                object={schedule}
                objectKey={"room"}
                setObject={(value) => setSchedule({ ...schedule, room: value })}
                showList={(item) => {
                  return (
                    <div className="truncate">
                      {item.Name + " - " + item.Department.Name}
                    </div>
                  );
                }}
                insertList={(item) =>
                  setSchedule({
                    ...schedule,
                    room: item.Name,
                    roomId: item.Id,
                    department: item.Department.Name,
                    departmentId: item.Department.Id,
                  })
                }
              />
            </div>
            <div className="flex w-[150px] items-center justify-center text-center text-[#00BA4B] border-r-2">
              <p>
                {schedule.timeStart && schedule.timeEnd
                  ? schedule.timeStart + " - " + schedule.timeEnd
                  : "00:00 - 00:00"}
              </p>
            </div>
            <div className="flex w-[150px] items-center justify-center text-center text-[#00BA4B] border-r-2">
              <p>{schedule.zone}</p>
            </div>
            <div className="flex-grow text-[#00BA4B] border-r-2">
              <InputTableList
                className={"z-[7]"}
                list={listDoctors}
                listKey={"Name"}
                lable={"Nhập bác sĩ"}
                object={schedule}
                objectKey={"doctor"}
                setObject={(value) =>
                  setSchedule({ ...schedule, doctor: value })
                }
                showList={(item) => {
                  return <div>{item.Name}</div>;
                }}
                insertList={(item) =>
                  setSchedule({
                    ...schedule,
                    doctor: item.Name,
                    doctorId: item.Id,
                  })
                }
              />
            </div>
            <div className="flex w-[300px] items-center justify-center text-center text-[#00BA4B] border-r-2">
              <p>
                {schedule.department ? schedule.department : "Hãy chọn phòng"}
              </p>
            </div>
            <div className="w-[150px] text-[#00BA4B] border-r-2">
              <InputTable
                lable={"Nhập phút"}
                object={schedule}
                objectKey={"maxTime"}
                typeValue={"number"}
                setObject={(value) => {
                  if (value <= 0) {
                    setSchedule({ ...schedule, maxTime: 15 });
                  } else if (value > 45) {
                    setSchedule({ ...schedule, maxTime: 45 });
                  } else {
                    setSchedule({ ...schedule, maxTime: value });
                  }
                }}
              />
            </div>
            <div className="w-[150px] text-[#00BA4B] border-r-2">
              <InputTableList
                className={"z-[7]"}
                list={listStates}
                listKey={"state"}
                lable={"Nhập trạng thái"}
                object={schedule}
                objectKey={"state"}
                setObject={(value) =>
                  setSchedule({ ...schedule, state: value })
                }
                showList={(item) => {
                  return <div className="truncate">{item.state}</div>;
                }}
                insertList={(item) =>
                  setSchedule({
                    ...schedule,
                    state: item.state,
                    stateId: item.id,
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-5 justify-center w-full border-x-2 border-b-2 bg-white">
            <div>
              <button
                disabled={
                  !(
                    schedule.shiftId &&
                    schedule.roomId &&
                    schedule.doctorId &&
                    schedule.stateId
                  )
                }
                className={
                  schedule.shiftId &&
                  schedule.roomId &&
                  schedule.doctorId &&
                  schedule.stateId
                    ? "w-[120px] text-center bg-[#00BA4B] text-white p-3 border-2 border-[#00BA4B] duration-200 ease-linear hover:bg-white hover:text-[#00BA4B]"
                    : "w-[120px] text-center bg-zinc-300 text-white p-3 border-2 border-zinc-300"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (schedule.id) {
                    handleUpdate();
                  } else {
                    if (
                      filterDoctorRoom(
                        schedule.shiftId,
                        schedule.roomId,
                        schedule.doctorId,
                        schedule.stateId,
                        optionSchedule.name,
                        listDoctorRooms
                      ).length === 0
                    ) {
                      handleCreate();
                    } else {
                      currentContext.setNotification({
                        for: "WarningDuplicateSchedule",
                        content: "Bạn không thể tạo 2 lịch làm giống nhau!",
                        isOpen: true,
                        handle: "pending",
                        option: "N",
                      });
                    }
                  }
                }}
              >
                {schedule.id ? "Cập nhật" : "Thêm lịch"}
              </button>
            </div>
            {schedule.id && (
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    currentContext.setWindowWarning({
                      for: "DeleteScheduleObject",
                      content:
                        "Bạn có chắc muốn xóa lịch làm của " +
                        schedule.doctor +
                        " , ca " +
                        schedule.shift +
                        ", tại phòng " +
                        schedule.room +
                        " không!",
                      handle: "pending",
                      isOpen: true,
                    });
                  }}
                  className="w-[120px] text-center bg-red-500 text-white p-3 border-2 border-red-500 duration-200 ease-linear hover:bg-white hover:text-red-500"
                >
                  Xóa
                </button>
              </div>
            )}

            <div>
              <button
                disabled={
                  !(schedule.shiftId || schedule.roomId || schedule.doctorId)
                }
                className={
                  schedule.shiftId || schedule.roomId || schedule.doctorId
                    ? "w-[120px] text-center bg-orange-500 text-white p-3 border-2 border-orange-500 duration-200 ease-linear hover:bg-white hover:text-red-500"
                    : "w-[120px] text-center bg-zinc-300 text-white p-3 border-2 border-zinc-300"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setSchedule(scheduleObject);
                }}
              >
                Hủy
              </button>
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {filterDoctorRoom(
              schedule.shiftId,
              schedule.roomId,
              schedule.doctorId,
              schedule.stateId,
              optionSchedule.name,
              listDoctorRooms
            ).length > 0 ? (
              filterDoctorRoom(
                schedule.shiftId,
                schedule.roomId,
                schedule.doctorId,
                schedule.stateId,
                optionSchedule.name,
                listDoctorRooms
              ).map((item) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSchedule({
                      ...schedule,
                      ...handleInserSchedule(item, optionSchedule),
                    });
                  }}
                  className="flex w-full bg-white border-y-2 duration-200 ease-linear hover:scale-[1.03]"
                >
                  <div className="text-center text-[#005121] w-[150px] py-[15px] border-r-2">
                    <p>{item.Shift.Name}</p>
                  </div>
                  <div className="text-center text-[#005121] w-[200px] py-[15px] border-r-2">
                    <p>{item.Room.Name}</p>
                  </div>
                  <div className="text-center text-[#005121] w-[150px] py-[15px] border-r-2">
                    <p>
                      {UTCTimeToString(item.Shift.Start) +
                        " - " +
                        UTCTimeToString(item.Shift.End)}
                    </p>
                  </div>
                  <div className="text-center text-[#005121] w-[150px] py-[15px] border-r-2">
                    <p>{item.Room.Department.Zone}</p>
                  </div>
                  <div className="text-center text-[#005121] flex-grow py-[15px] border-r-2">
                    <p>{item.Employee.Name}</p>
                  </div>
                  <div className="text-center text-[#005121] w-[300px] py-[15px] border-r-2">
                    <p>{item.Room.Department.Name}</p>
                  </div>
                  <div className="text-center text-[#005121] w-[150px] py-[15px] border-r-2">
                    <p>{item.MaxTime + " phút/(BN)"}</p>
                  </div>
                  <div className="text-center text-[#005121] w-[150px] py-[15px] border-r-2">
                    <p>{item.State ? "Mở" : "Đóng"}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex w-full h-full bg-white border-x-2 justify-center items-center">
                {isPending.listDoctorRooms ? (
                  <Loader />
                ) : (
                  <div className="text-zinc-400">
                    <p>Lịch trống!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-[300px] h-full bg-white flex flex-col items-center justify-center gap-5">
          <CheckDefault
            lable={"Thứ 2"}
            className={intDay(schedule.day) === 1 && "bg-yellow-500"}
            object={optionSchedule}
            objectKey={"monday"}
            setObject={(value) => {
              setOptionSchedule({ ...optionSchedule, monday: !value });
              handleCheckUpdateOne(!value, "Monday", "Thứ 2");
            }}
          />
          <CheckDefault
            lable={"Thứ 3"}
            className={
              intDay(schedule.day) === 2 && "bg-yellow-300 border-[#005121]"
            }
            object={optionSchedule}
            objectKey={"tuesday"}
            setObject={(value) => {
              setOptionSchedule({ ...optionSchedule, tuesday: !value });
              handleCheckUpdateOne(!value, "Tuesday", "Thứ 3");
            }}
          />
          <CheckDefault
            lable={"Thứ 4"}
            className={
              intDay(schedule.day) === 3 && "bg-yellow-300 border-[#005121]"
            }
            object={optionSchedule}
            objectKey={"wednesday"}
            setObject={(value) => {
              setOptionSchedule({ ...optionSchedule, wednesday: !value });
              handleCheckUpdateOne(!value, "Wednesday", "Thứ 4");
            }}
          />
          <CheckDefault
            lable={"Thứ 5"}
            className={
              intDay(schedule.day) === 4 && "bg-yellow-300 border-[#005121]"
            }
            object={optionSchedule}
            objectKey={"thursday"}
            setObject={(value) => {
              setOptionSchedule({ ...optionSchedule, thursday: !value });
              handleCheckUpdateOne(!value, "Thursday", "Thứ 5");
            }}
          />
          <CheckDefault
            lable={"Thứ 6"}
            className={
              intDay(schedule.day) === 5 && "bg-yellow-300 border-[#005121]"
            }
            object={optionSchedule}
            objectKey={"friday"}
            setObject={(value) => {
              setOptionSchedule({ ...optionSchedule, friday: !value });
              handleCheckUpdateOne(!value, "Friday", "Thứ 6");
            }}
          />
          <CheckDefault
            lable={"Thứ 7"}
            className={
              intDay(schedule.day) === 6 && "bg-yellow-300 border-[#005121]"
            }
            object={optionSchedule}
            objectKey={"saturday"}
            setObject={(value) => {
              setOptionSchedule({ ...optionSchedule, saturday: !value });
              handleCheckUpdateOne(!value, "Saturday", "Thứ 7");
            }}
          />
          <CheckDefault
            lable={"Chủ nhật"}
            className={
              intDay(schedule.day) === 0 && "bg-yellow-300 border-[#005121]"
            }
            object={optionSchedule}
            objectKey={"sunday"}
            setObject={(value) => {
              setOptionSchedule({ ...optionSchedule, sunday: !value });
              handleCheckUpdateOne(!value, "Sunday", "Chủ nhật");
            }}
          />
        </div>
      </div>
      <div className="flex gap-1 w-full h-[60px] bg-[#00BA4B] overflow-auto ">
        <div className="flex w-[60px] h-full justify-center items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen({ ...isOpen, createTab: true });
            }}
            className="bg-white p-1 rounded-xl"
          >
            <svg
              className="w-[40px] h-[40px] fill-[#005121]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
            </svg>
          </button>
        </div>
        {listSchedules.length > 0 &&
          listSchedules.map((item) => (
            <div
              key={item.Name}
              className="flex h-full justify-center items-center"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (optionSchedule.name !== item.Name) {
                    const scheduleSelect = listSchedules.find(
                      (item1) => item1.Name === item.Name
                    );
                    setOptionSchedule(
                      handleInsertOptionSchedule(scheduleSelect)
                    );
                  }
                }}
                className={
                  "w-[100px] p-2 rounded-xl truncate " +
                  (optionSchedule.name === item.Name
                    ? item.Status
                      ? "bg-[#005121] text-white"
                      : "bg-zinc-300 text-white"
                    : item.Status
                    ? "bg-white text-[#005121]"
                    : "text-zinc-300 bg-white")
                }
              >
                {item.Name}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
