import React from "react";

export default function InputShow({ className, object, objectKey, lable }) {
  return (
    <div className={"relative " + className}>
      <input
        className="w-full h-full outline-none border-2 border-[#005121] rounded-xl p-3"
        type="text"
        value={object[objectKey] ? object[objectKey] : null}
      />
      <div
        className={
          "absolute top-0 left-3 mt-[10px] bg-white duration-200 ease-in-out " +
          (object[objectKey] ? "-translate-y-5 text-sm" : "translate-y-0")
        }
      >
        <p>{lable}</p>
      </div>
    </div>
  );
}
