import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  handleDatePicker,
  handleDateInsurance,
  insertDate,
} from "../Functions/HandleRegisterNumber";

export default function InputDate({
  className,
  lable,
  overYear,
  object,
  keyObject,
  setObject,
  logic,
  keyLogic,
  handleLogic,
  lableRequire,
  inputRequire,
}) {
  const handleInsert = (e) => {
    const { name, value } = e.target;
    setObject({
      ...object,
      [keyObject]: { ...object[keyObject], [name]: value },
    });
  };
  return (
    <div className={className}>
      {logic[keyLogic] && (
        <div className="absolute top-0 translate-y-12">
          <DatePicker
            onChange={(date) => {
              setObject(
                overYear
                  ? handleDateInsurance(object, date, keyObject)
                  : handleDatePicker(object, keyObject, date)
              );
              handleLogic({ ...logic, [keyLogic]: false });
            }}
            inline
          />
        </div>
      )}
      {inputRequire && (
        <div className="absolute top-0 right-0 mr-3 -translate-y-4 bg-red-500 text-white px-1  rounded-md">
          <p className="text-[15px]">{lableRequire}</p>
        </div>
      )}
      <div className="pr-5">
        <p>{lable}</p>
      </div>
      <div>
        <input
          name="day"
          value={object[keyObject].day}
          onBlur={(e) => {
            setObject(
              insertDate(
                object,
                e.target.name,
                keyObject,
                e.target.value,
                overYear
              )
            );
          }}
          onChange={handleInsert}
          className="w-8 outline-none text-center"
          type="number"
        />
      </div>
      <div>
        <p>/</p>
      </div>
      <div>
        <input
          name="month"
          value={object[keyObject].month}
          onBlur={(e) => {
            setObject(
              insertDate(
                object,
                e.target.name,
                keyObject,
                e.target.value,
                overYear
              )
            );
          }}
          onChange={handleInsert}
          className="w-8 outline-none text-center"
          type="number"
        />
      </div>
      <div>
        <p>/</p>
      </div>
      <div>
        <input
          name="year"
          value={object[keyObject].year}
          onBlur={(e) => {
            setObject(
              insertDate(
                object,
                e.target.name,
                keyObject,
                e.target.value,
                overYear
              )
            );
          }}
          onChange={handleInsert}
          className="w-14 outline-none text-center"
          type="number"
        />
      </div>
      <div className="flex-grow"></div>
      <div className="w-[30px] h-[30px]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLogic({
              [keyLogic]: !logic[keyLogic],
            });
          }}
          className="w-[30px] h-[30px]"
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
  );
}
