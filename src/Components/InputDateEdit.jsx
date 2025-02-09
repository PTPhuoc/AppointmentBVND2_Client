import React, { useState } from "react";
import DatePicker from "react-datepicker";

export default function InputDateEdit({
  className,
  object,
  setObject,
  insertDate,
  lable,
  insertObject
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSetDate = (day, month, year) => {
    const dateSelect = new Date(year, month, day);
    return {
      day: dateSelect.getDate(),
      month: dateSelect.getMonth() + 1,
      year: dateSelect.getFullYear(),
    };
  };
  return (
    <div
      className={
        "relative flex h-[50px] justify-between items-center border-2 border-[#005121] p-3 rounded-xl " +
        className
      }
    >
      <div
        className={
          "absolute top-0 left-0 translate-y-12 " + (!isOpen && "hidden")
        }
      >
        <DatePicker
          onChange={(date) => {
            insertDate(date);
          }}
          inline={isOpen}
        />
      </div>
      <div className="flex">
        <div className="mr-3">
          <p>{lable}</p>
        </div>
        <div>
          <input
            type="number"
            className="w-8 outline-none text-center"
            value={object.day}
            onBlur={() => {
              insertObject(handleSetDate(object.day, object.month - 1, object.year));
            }}
            name="day"
            onChange={(e) => setObject(e)}
          />
        </div>
        <div>/</div>
        <div>
          <input
            type="number"
            className="w-8 outline-none text-center"
            value={object.month}
            name="month"
            onBlur={() => {
              insertObject(handleSetDate(object.day, object.month - 1, object.year));
            }}
            onChange={(e) => setObject(e)}
          />
        </div>
        <div>/</div>
        <div>
          <input
            type="number"
            className="w-12 outline-none text-center"
            value={object.year}
            name="year"
            onBlur={() => {
              insertObject(handleSetDate(object.day, object.month - 1, object.year));
            }}
            onChange={(e) => setObject(e)}
          />
        </div>
      </div>
      <div>
        <div className="w-[30px] h-[30px]">
          <button
            className="w-[30px] h-[30px]"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <svg
              className="w-full h-full fill-slate-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
