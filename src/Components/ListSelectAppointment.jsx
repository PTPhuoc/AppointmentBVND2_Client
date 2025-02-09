import React from "react";
import {
  compareUTCTime,
  compareUTCTimeNoEqual,
  compareUTCTimeVsLocalTime,
  converUTCDate,
  handleSlot,
} from "../Functions/HandleDate";
import { isSameDay } from "date-fns";

export default function ListSelectAppointment({
  listHours,
  listDoctorRooms,
  listAppointments,
  appointment,
  handleClick,
}) {
  const handleDate = (timeStart) => {
    if (
      isSameDay(
        new Date(),
        new Date(
          appointment.date.year,
          appointment.date.month - 1,
          appointment.date.day
        )
      )
    ) {
      if (compareUTCTimeVsLocalTime(new Date(timeStart), new Date())) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const hasSelect = (timeStart, timeEnd) => {
    if (appointment.time) {
      if (
        compareUTCTimeNoEqual(new Date(timeEnd), new Date(appointment.time)) &&
        compareUTCTime(new Date(appointment.time), new Date(timeStart))
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  return (
    <>
      {listDoctorRooms.length > 0 &&
        listDoctorRooms.map((item) => {
          return (
            <div className="flex gap-1">
              {listHours.length > 0 &&
                listHours.map((item1) => {
                  if (
                    compareUTCTime(
                      new Date(item.Shift.End),
                      new Date(item1.End)
                    ) &&
                    compareUTCTime(
                      new Date(item1.Start),
                      new Date(item.Shift.Start)
                    )
                  ) {
                    const slot = handleSlot(
                      converUTCDate(item1.Start),
                      converUTCDate(item1.End),
                      item.MaxTime
                    );
                    let available = 0;
                    if (listAppointments.length > 0) {
                      available = listAppointments.filter(
                        (item2) =>
                          compareUTCTimeNoEqual(
                            new Date(item1.End),
                            new Date(item2.Time)
                          ) &&
                          compareUTCTime(
                            new Date(item2.Time),
                            new Date(item1.Start)
                          ) &&
                          item2.State === "Đã đăng ký" &&
                          item2.DoctorRoom.Id === item.Id
                      ).length;
                    }
                    return (
                      <button
                        disabled={
                          handleDate(item1.Start) &&
                          hasSelect(item1.Start, item1.End) &&
                          appointment.doctorRoomId === item.Id
                        }
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleClick(item, item1, available);
                        }}
                        className={
                          appointment.doctorRoomId === item.Id &&
                          appointment.time &&
                          hasSelect(item1.Start, item1.End)
                            ? "w-[300px] min-w-[300px] py-4 text-center bg-orange-500 text-white border-2 border-orange-500 rounded-xl"
                            : !handleDate(item1.Start)
                            ? "text-center bg-white text-slate-300 w-[300px] min-w-[300px] py-4 border-2 border-slate-300 rounded-xl"
                            : "w-[300px] min-w-[300px] py-4 text-center bg-[#00BA4B] text-white border-2 border-[#00BA4B] rounded-xl duration-200 ease-linear hover:bg-white hover:text-[#00BA4B]"
                        }
                      >
                        {item.Employee.Name}
                        <br />
                        Phòng: {item.Room.Name}
                        <br />
                        {available}/{slot}
                      </button>
                    );
                  } else {
                    return <div className="w-[300px] min-w-[300px] py-4"></div>;
                  }
                })}
            </div>
          );
        })}
    </>
  );
}
