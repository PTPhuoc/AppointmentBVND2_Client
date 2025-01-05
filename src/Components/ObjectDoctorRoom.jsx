import React from "react";
import { formatDate, stringDay } from "../Functions/HandleSchedule";

export default function ObjectDoctorRoom({
  object,
  onObject,
  setObject,
  form,
  setForm,
}) {
  const stringState = (value) => {
    return value ? "Mở" : "Đóng";
  };

  const addValue = () => {
    const selectDate = new Date(object.Date);
    setObject({
      ...onObject,
      id: object.Id,
      week: object.week,
      day: stringDay(object.Day),
      date: {
        day: selectDate.getDate(),
        month: selectDate.getMonth() + 1,
        year: selectDate.getFullYear(),
      },
      room: object.Room.Name,
      roomId: object.Room.Id,
      shift: object.Shift.Name,
      shiftId: object.Shift.Id,
      department: object.Room.Department.Name,
      departmentId: object.Room.Department.Id,
      doctor: object.Employee.Name,
      doctorId: object.Employee.Id,
      state: stringState(object.State),
      stateId: object.State,
    });
    setForm({ ...form, createSchedule: true, updateSchedule: true });
  };

  return (
    <div onClick={() => addValue()} className="w-full flex items-center justify-center min-w-[1500px] duration-200 ease-out cursor-pointer hover:scale-[1.02]">
      <div className="w-[5%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
        <p>{object.Week}</p>
      </div>
      <div className="w-[8%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
        <p>{stringDay(object.Day)}</p>
      </div>
      <div className="w-[10%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
        <p>{formatDate(object.Date)}</p>
      </div>
      <div className="w-[10%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
        <p>{object.Room.Department.Zone}</p>
      </div>
      <div className="w-[15%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
        <p>{object.Room.Name}</p>
      </div>
      <div className="w-[5%] p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
        <p>{object.Shift.Name}</p>
      </div>
      <div className="w-[15%] p-3 bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
        <p className="w-full truncate">{object.Room.Department.Name}</p>
      </div>
      <div className="flex-grow p-3  bg-white text-[#005121] border-r-2 border-[#00BA4B] text-center">
        <p>{object.Employee.Name}</p>
      </div>
      <div className="w-[10%] p-3 bg-white text-[#005121] text-center">
        <p>{stringState(object.State)}</p>
      </div>
    </div>
  );
}
