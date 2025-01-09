import React from "react";

export default function InputDefault({
  className,
  lable,
  type,
  name,
  inputRefs,
  handleRef,
  object,
  handleObject,
  logic,
  keyLogic,
  handleLogic,
  objectLogic,
  lableRequire,
  inputRequire,
}) {
  return (
    <div className={className}>
      <input
        ref={(el) => (inputRefs.current[name] = el)}
        name={name}
        value={object[name]}
        onChange={handleObject}
        onClick={(e) => {
          e.stopPropagation();
          handleLogic({ ...objectLogic, [keyLogic]: true });
        }}
        className={
          "w-full outline-none pl-5 py-2 border-2 rounded-lg duration-200 ease-linear " +
          (inputRequire ? "border-red-400" : "border-[#005121]")
        }
        type={type}
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleRef(name);
        }}
        className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
          object[name] || logic[keyLogic]
            ? "-translate-y-6 text-sm text-[#005121]"
            : "text-gray-400"
        }`}
      >
        <p className="bg-white px-1">{lable}</p>
      </div>
      {inputRequire && (
        <div className="absolute top-0 right-0 mr-3 -translate-y-4 bg-red-500 text-white px-1 rounded-md">
          <p className="text-[15px]">{lableRequire}</p>
        </div>
      )}
    </div>
  );
}
