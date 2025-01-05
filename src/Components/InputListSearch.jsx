import React from "react";
import { handleList } from "../Functions/HandleSchedule";

export default function InputListSearch({
  className,
  inputRefs,
  focusRef,
  object,
  keyObject,
  logic,
  keyLogic,
  handleObject,
  setObject,
  handleLogic,
  resetLogic,
  list,
  lable,
}) {
  return (
    <div className={className}>
      <input
        name={keyObject}
        ref={(el) => (inputRefs.current[keyObject] = el)}
        value={object[keyObject]}
        onFocus={() => {
          handleLogic({ ...resetLogic, [keyLogic]: true });
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={handleObject}
        className="w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear border-[#005121] bg-white"
        type="text"
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleLogic({ ...resetLogic, [keyLogic]: true });
          focusRef(keyObject);
        }}
        className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
          object[keyObject] || logic[keyLogic]
            ? "-translate-y-6 text-sm text-[#005121]"
            : "text-gray-400"
        }`}
      >
        <p className="bg-white px-1">{lable}</p>
      </div>
      <div
        className={
          "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
          (logic[keyLogic] ? "max-h-[150px] pt-5" : "max-h-0")
        }
      >
        {handleList(list, object[keyObject]).length > 0 ? (
          handleList(list, object[keyObject]).map((el) => (
            <div className="w-full">
              <button
                onClick={() => {
                  setObject({
                    ...object,
                    [keyObject]: el.Name,
                    [keyObject + "Id"]: el.Id,
                  });
                }}
                className="bg-white w-full py-2 text-[#005121] duration-200 ease-linear hover:bg-[#00BA4B] hover:text-white"
              >
                {el.Name}
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white w-full py-2 text-[#005121] duration-200 ease-linear ">
            <p className="w-full text-center">Trống</p>
          </div>
        )}
      </div>
    </div>
  );
}
