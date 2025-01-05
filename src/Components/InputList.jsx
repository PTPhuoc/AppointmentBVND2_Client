import React from "react";

export default function InputList({
  className,
  lable,
  inputRefs,
  handleRef,
  object,
  keyObject,
  setObject,
  logic,
  keyLogic,
  handleLogic,
  objectLogic,
  listSelect,
  lableRequire,
  inputRequire,
}) {
  return (
    <div className={className}>
      <input
        ref={(el) => (inputRefs.current[keyObject] = el)}
        name={keyObject}
        value={object[keyObject]}
        onClick={(e) => {
          e.stopPropagation();
          handleLogic({ ...objectLogic, [keyLogic]: true });
        }}
        className={
            "w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear " +
            (inputRequire ? "border-red-400" : "border-[#005121]")
          }
        type="text"
      />
      {inputRequire && (
        <div className="absolute top-0 right-0 mr-3 -translate-y-4 bg-red-500 text-white px-1  rounded-md">
          <p className="text-[15px]">{lableRequire}</p>
        </div>
      )}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleRef("gender");
          handleLogic({ ...objectLogic, [keyLogic]: true });
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
        {listSelect.map((el) => (
          <div className="w-full">
            <button
              key={el.id}
              className="w-full bg-white px-5 py-2 border-y-2 border-white duration-200 ease-in-out hover:bg-slate-400 hover:text-white"
              onClick={() => {
                setObject({
                  ...object,
                  [keyObject]: el[keyObject],
                });
                handleLogic(objectLogic);
              }}
            >
              {el[keyObject]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
