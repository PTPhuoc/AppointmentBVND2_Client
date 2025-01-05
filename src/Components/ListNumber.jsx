import React, { useEffect, useRef, useState } from "react";
import { getWeek } from "date-fns";
import { formatDate, stringDay } from "../Functions/HandleSchedule";
import axios from "axios";
import InputDate from "./InputDate";
import InputListSearch from "./InputListSearch";
import {
  searchObject,
  focusInput,
  handleSearch,
} from "../Functions/HandleListNumber";
import Loader from "./Loader";
import { covertTime } from "../Functions/HandleAppointment";

export default function ListNumber() {
  const currentDate = new Date();
  const [listAppointment, setListAppointment] = useState([]);
  const [listConsultation, setListConsultation] = useState([]);
  const [isWait, setIsWait] = useState({
    listAppointment: true,
  });
  const [appointment, setAppointment] = useState({
    week: getWeek(currentDate),
    day: stringDay(currentDate.getDay()),
    date: {
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    },
    option: {
      register: false,
      notRegister: false,
      cancel: false,
    },
  });
  const [isSelectDate, setIsSelectDate] = useState({ appointment: false });
  const [search, setSearch] = useState(searchObject);
  const [focusSearch, setFocusSearch] = useState(focusInput);

  const inputRefs = useRef([]);

  const focusRef = (value) => {
    inputRefs.current[value].focus();
    inputRefs.current[value].click();
  };

  const changeInput = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const getConsulation = () => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/consultation-hours/get-consultation-hours"
      )
      .then((rs) => {
        if (rs.data.Status === "Success") {
          setListConsultation(rs.data.ConsultationHours);
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

  useEffect(() => {
    getConsulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAppointment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment.date]);

  return (
    <div
      onClick={() => {
        setFocusSearch(focusInput);
      }}
      className="flex flex-col w-full h-full items-center justify-center p-3 gap-5"
    >
      <div className="flex flex-wrap w-full justify-center gap-5">
        <div className="w-[1200px] flex flex-wrap items-center justify-center gap-5">
          <div className="relative w-[200px]">
            <input
              className="w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear border-[#005121]"
              value={appointment.week}
            />
            <div
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                appointment.week
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
              value={appointment.day}
            />
            <div
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                appointment.day
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
            object={appointment}
            keyObject={"date"}
            setObject={setAppointment}
            logic={isSelectDate}
            keyLogic={"appointment"}
            handleLogic={setIsSelectDate}
            lableRequire={""}
            inputRequire={false}
          />
          <InputListSearch
            className={"relative z-[9] w-[200px]"}
            inputRefs={inputRefs}
            focusRef={focusRef}
            object={search}
            keyObject={"shift"}
            logic={focusSearch}
            keyLogic={"shift"}
            handleObject={changeInput}
            setObject={setSearch}
            handleLogic={setFocusSearch}
            list={listConsultation}
            lable={"Giờ khám"}
          />
        </div>
        <div className="w-[500px] flex items-center justify-center gap-5">
          <div>
            <button
              onClick={() => {
                setAppointment({
                  ...appointment,
                  option: {
                    register: !appointment.option.register,
                    cancel: false,
                    notRegister: false,
                  },
                });
              }}
              className={
                appointment.option.register
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
                setAppointment({
                  ...appointment,
                  option: {
                    register: false,
                    cancel: false,
                    notRegister: !appointment.option.notRegister,
                  },
                });
              }}
              className={
                appointment.option.notRegister
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
                setAppointment({
                  ...appointment,
                  option: {
                    register: false,
                    cancel: !appointment.option.cancel,
                    notRegister: false,
                  },
                });
              }}
              className={
                appointment.option.cancel
                  ? "px-5 py-3 bg-white text-[#005121] border-2 border-[#005121] rounded-xl duration-200 ease-in"
                  : "px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in"
              }
            >
              Đã hủy
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="relative w-[40%] min-w-[500px]">
          <input
            className="w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear border-[#005121]"
            value={search.search}
            name="search"
            ref={(el) => (inputRefs.current["search"] = el)}
            onChange={changeInput}
            onClick={(e) => {
              e.stopPropagation();
              setFocusSearch({ ...focusInput, search: true });
            }}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              setFocusSearch({ ...focusInput, search: true });
              focusRef("search");
            }}
            className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
              focusSearch.search || search.search
                ? "-translate-y-6 text-sm text-[#005121]"
                : "text-gray-400"
            }`}
          >
            <p className="bg-white px-1">Tìm kiếm theo tên bác sĩ/dịch vụ</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-[95%] min-w-[850px] h-[600px] bg-slate-300 text-white gap-1">
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
          <div className="w-[10%] py-3 text-center border-r-2 border-white">
            <p>Ngày</p>
          </div>
          <div className="w-[10%] py-3 text-center border-r-2 border-white">
            <p>Giờ</p>
          </div>
          <div className="w-[7%] py-3 text-center border-r-2 border-white">
            <p>Phòng</p>
          </div>
          <div className="w-[10%] py-3 text-center">
            <p>Trạng thái</p>
          </div>
        </div>
        {isWait.listAppointment ? (
          <div className="flex w-full h-full justify-center items-center border-2 border-slate-300 bg-white">
            <Loader></Loader>
          </div>
        ) : listAppointment.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center border-2 border-slate-300 bg-white text-slate-400 text-center font-bold">
            <p>Lịch hôm nay trống</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-1 items-center min-w-[1500px] scrollbarList overflow-y-auto overflow-x-hidden">
            {handleSearch(
              listAppointment,
              search.search,
              search.shift,
              appointment.option
            ).map((el) => (
              <div className="flex w-full justify-stretch bg-white text-black">
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
                <div className="w-[10%] py-3 text-center border-r-2 border-black">
                  {formatDate(el.Date)}
                </div>
                <div className="w-[10%] py-3 text-center border-r-2 border-black">
                  <p>{el.Time ? " - " + covertTime(el.Time) : "Chưa chọn"}</p>
                </div>
                <div className="w-[7%] py-3 text-center border-r-2 border-black">
                  <p>{el.DoctorRoom ? el.DoctorRoom.Room.Name : "Chưa chọn"}</p>
                </div>
                <div className="w-[10%] py-3 text-center border-r-2 border-white">
                  {el.State}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
