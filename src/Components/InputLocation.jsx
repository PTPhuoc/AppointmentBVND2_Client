import React, { useEffect, useRef, useState } from "react";
import listCity from "../Json/Citys.json";
import listDistrict from "../Json/Districts.json";
import listWard from "../Json/Wards.json";
import { handleListLocation } from "../Functions/HandleSelectList";

export default function InputLocation({
  className,
  object,
  clearInput,
  lable,
  insertList,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (object.city || object.district || object.ward) {
      if (object.city && object.district && object.ward) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  }, [object]);
  return (
    <div className={"relative h-[50px] " + className}>
      <input
        className="outline-none w-full h-full p-3 border-2 border-[#005121] rounded-xl"
        ref={inputRef}
        type="text"
        value={
          object.city +
          (object.city && ", ") +
          object.district +
          (object.district && ", ") +
          object.ward
        }
        onClick={() => {
          setIsOpen(true);
        }}
        onBlur={() => {
          if (!object.city && !object.district && !object.ward) {
            setIsOpen(false);
          }
        }}
      />
      <div
        className={
          "absolute top-0 left-3 mt-[10px] bg-white cursor-pointer duration-200 ease-in-out " +
          (isOpen || object.city || object.district || object.ward
            ? "-translate-y-5 text-sm"
            : "-translate-y-0")
        }
        onClick={() => {
          setIsOpen(true);
          inputRef.current.focus();
        }}
      >
        <p>{lable}</p>
      </div>
      <div
        className={
          "absolute top-0 w-full flex flex-col gap-1 bg-slate-500 z-[-1] pt-12 rounded-xl border-[#005121] overflow-auto duration-200 ease-linear " +
          (isOpen && !(object.city && object.district && object.ward)
            ? "max-h-[300px] border-2 scrollbarList"
            : "max-h-0 border-0 hidden-scrollbar")
        }
      >
        {handleListLocation(listCity, listDistrict, listWard, object).map(
          (item) => (
            <div>
              <button
                className="w-full h-[50px] text-center text-[#00BA4B] p-3 bg-white duration-200 ease-linear hover:text-white hover:bg-[#00BA4B] "
                onClick={() => {
                  insertList(item);
                }}
              >
                {item.city
                  ? item.city
                  : item.district
                  ? item.district
                  : item.ward}
              </button>
            </div>
          )
        )}
      </div>
      <div
        className={
          "absolute flex items-center h-full mr-5 top-0 right-0 " +
          (!object.city && "hidden")
        }
      >
        <div className="w-[30px] h-[30px]">
          <button
            onClick={() => {
              const clearValue = {
                city: "",
                cityCode: 0,
                district: "",
                districtCode: 0,
                ward: "",
                wardCode: 0,
              };
              clearInput(clearValue);
            }}
            className="w-[30px] h-[30px] bg-white"
          >
            <svg
              className="w-[30px] h-[30px] fill-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
