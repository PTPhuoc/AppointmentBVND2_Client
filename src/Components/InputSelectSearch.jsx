import React, { useRef, useState } from "react";
import { handleList } from "../Functions/HandleSelectList";

export default function InputSelectSearch({
  className,
  list,
  listKey,
  object,
  objectKey,
  setObject,
  lable,
  showList,
  insertList,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  return (
    <div className={"relative h-[50px] " + className}>
      <input
        className="outline-none w-full h-full p-3 border-2 border-[#005121] rounded-xl"
        ref={inputRef}
        type="text"
        value={object[objectKey]}
        onChange={(e) => setObject(e.target.value)}
        onClick={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      <div
        className={
          "absolute top-0 left-3 mt-[10px] bg-white cursor-pointer duration-200 ease-in-out " +
          (isOpen || object[objectKey]
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
          (isOpen
            ? "max-h-[300px] border-2 scrollbarList"
            : "max-h-0 border-0 hidden-scrollbar")
        }
      >
        {handleList(list, object[objectKey], listKey).length > 0 ? (
          handleList(list, object[objectKey], listKey).map((item) => (
            <div>
              <button
                className="w-full h-[50px] text-center text-[#00BA4B] p-3 bg-white duration-200 ease-linear hover:text-white hover:bg-[#00BA4B] "
                onMouseDown={(e) => {
                  e.stopPropagation();
                  insertList(item);
                }}
              >
                {showList(item)}
              </button>
            </div>
          ))
        ) : (
          <div className="w-full h-[50px] text-center text-[#00BA4B] p-3 bg-white">
            <p>Trống</p>
          </div>
        )}
      </div>
    </div>
  );
}
