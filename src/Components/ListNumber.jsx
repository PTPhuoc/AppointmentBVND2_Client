import React, { useEffect, useState } from "react";
import InputShow from "./InputShow";
import {
  handleSearchNumber,
  numberObject,
} from "../Functions/HandleListNumber";
import InputDateEdit from "./InputDateEdit";
import InputEdit from "./InputEdit";
import Loader from "./Loader";
import axios from "axios";
import { stringUTCTime } from "../Functions/HandleDate";

export default function ListNumber() {
  const [optionAppointment, setOptionAppointment] = useState(numberObject);
  const [listAppointment, setListAppointment] = useState([]);
  const [isPending, setIsPending] = useState({
    listAppointment: true,
  });

  const getAppointment = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/appointment/get-appointment", {
        params: {
          date: new Date(
            optionAppointment.date.year,
            optionAppointment.date.month - 1,
            optionAppointment.date.day
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

  useEffect(() => {
    getAppointment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionAppointment.date]);

  return (
    <div className="flex flex-col gap-5 justify-center items-center w-full my-5">
      <div className="flex w-[90%] justify-between">
        <div className="flex flex-col w-[50%] gap-5 justify-center">
          <div className="flex gap-5 justify-center">
            <InputShow
              lable={"Tuần"}
              object={optionAppointment}
              objectKey={"week"}
              className={"flex-grow-[1]"}
            />
            <InputShow
              className={"flex-grow-[1]"}
              lable={"Thứ"}
              object={optionAppointment}
              objectKey={"day"}
            />
            <InputDateEdit
              className={"flex-grow-[4] z-[8]"}
              object={optionAppointment.date}
              lable={"Ngày"}
              insertDate={(date) => {
                setOptionAppointment({
                  ...optionAppointment,
                  date: {
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                  },
                });
              }}
              insertObject={(date) => {
                setOptionAppointment({
                  ...optionAppointment,
                  date: {
                    ...date,
                  },
                });
              }}
              setObject={(e) => {
                setOptionAppointment({
                  ...optionAppointment,
                  date: {
                    ...optionAppointment.date,
                    [e.target.name]: e.target.value,
                  },
                });
              }}
            />
          </div>
          <InputEdit
            lable={"Tìm kiếm theo mã/tên bệnh nhân"}
            object={optionAppointment}
            objectKey={"search"}
            setObject={(value) =>
              setOptionAppointment({ ...optionAppointment, search: value })
            }
            typeInput={"text"}
          />
        </div>
        <div className="flex flex-col w-[50%]  gap-5 justify-center items-end">
          <div className="flex gap-5 ">
            <button
              onClick={() =>
                setOptionAppointment({
                  ...optionAppointment,
                  register: !optionAppointment.register,
                  cancel: false,
                })
              }
              className={
                "px-8 py-2 w-[200px] rounded-xl border-2 border-[#005121] duration-200 ease-linear " +
                (optionAppointment.register
                  ? "bg-white text-[#005121]"
                  : "bg-[#005121] text-white")
              }
            >
              Đã đăng ký
            </button>
            <button
              onClick={() =>
                setOptionAppointment({
                  ...optionAppointment,
                  cancel: !optionAppointment.cancel,
                  register: false,
                })
              }
              className={
                "px-8 py-2 w-[200px] rounded-xl border-2 border-[#005121] duration-200 ease-linear " +
                (optionAppointment.cancel
                  ? "bg-white text-[#005121]"
                  : "bg-[#005121] text-white")
              }
            >
              Đã hủy
            </button>
          </div>
          <div className="flex gap-5 ">
            <button
              onClick={() =>
                setOptionAppointment({
                  ...optionAppointment,
                  normal: !optionAppointment.normal,
                  priority: false,
                })
              }
              className={
                "px-8 py-2 w-[200px] rounded-xl border-2 border-[#005121] duration-200 ease-linear " +
                (optionAppointment.normal
                  ? "bg-white text-[#005121]"
                  : "bg-[#005121] text-white")
              }
            >
              Khám thường
            </button>
            <button
              onClick={() =>
                setOptionAppointment({
                  ...optionAppointment,
                  priority: !optionAppointment.register,
                  normal: false,
                })
              }
              className={
                "px-8 py-2 w-[200px] rounded-xl border-2 border-[#005121] duration-200 ease-linear " +
                (optionAppointment.priority
                  ? "bg-white text-[#005121]"
                  : "bg-[#005121] text-white")
              }
            >
              Khám ưu tiên
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[90%] h-[600px] bg-slate-200">
        <div className="flex items-center w-full bg-[#00BA4B]">
          <div className="w-[150px] text-center text-white py-[15px] border-r-2">
            <p>Mã hẹn</p>
          </div>
          <div className="w-[200px] text-center text-white py-[15px] border-r-2">
            <p>Số khám</p>
          </div>
          <div className="w-[150px] text-center text-white py-[15px] border-r-2">
            <p>Thời gian</p>
          </div>
          <div className="flex-grow text-center text-white py-[15px] border-r-2">
            <p>Tên bệnh nhân</p>
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
        </div>
        <div className="flex flex-col w-full flex-1 overflow-auto scrollbarList">
          {handleSearchNumber(optionAppointment, listAppointment).length > 0 ? (
            handleSearchNumber(optionAppointment, listAppointment).map(
              (item) => (
                <div className="flex items-center w-full border-b-2 bg-white">
                  <div className="w-[150px] text-center text-[#00BA4B] py-[15px] border-r-2">
                    <p>{item.Id}</p>
                  </div>
                  <div className="w-[200px] text-center text-[#00BA4B] py-[15px] border-r-2">
                    <p>
                      {item.Number +
                        " - " +
                        (item.Priority ? "Khám ưu tiên" : "Khám thường")}
                    </p>
                  </div>
                  <div className="w-[150px] text-center text-[#00BA4B] py-[15px] border-r-2">
                    <p>{stringUTCTime(new Date(item.Time))}</p>
                  </div>
                  <div className="flex-grow text-center text-[#00BA4B] py-[15px] border-r-2">
                    <p>{item.Patient.Name}</p>
                  </div>

                  <div className="w-[350px] text-center text-[#00BA4B] py-[15px] border-r-2">
                    <p>{item.Employee.Name}</p>
                  </div>
                  <div className="w-[100px] text-center text-[#00BA4B] py-[15px] border-r-2">
                    <p>
                      {item.DoctorRoom
                        ? item.DoctorRoom.Room.Name
                        : "Chưa chọn"}
                    </p>
                  </div>
                  <div className="w-[150px] text-center text-[#00BA4B] py-[15px] border-r-2">
                    <p>{item.State}</p>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="flex flex-1 flex-grow justify-center items-center">
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
