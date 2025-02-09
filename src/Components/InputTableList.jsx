import React, { useRef, useState } from "react";
import { handleList } from "../Functions/HandleSelectList";

export default function InputTableList({
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
    <div className={"relative " + className}>
      <input
        className="outline-none w-full h-full pl-3 py-4"
        placeholder={lable}
        ref={inputRef}
        type="text"
        value={object[objectKey]}
        onChange={(e) => setObject(e.target.value)}
        onClick={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />

      <div
        className={
          "absolute top-0 w-full flex flex-col gap-1 bg-slate-200 z-[-1] pt-[55px] overflow-auto duration-200 ease-linear hidden-scrollbar " +
          (isOpen ? "max-h-[200px] border-2" : "max-h-0 border-0")
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
