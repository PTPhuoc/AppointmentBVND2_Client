import React from "react";

export default function CheckDefault({
  className,
  object,
  objectKey,
  lable,
  setObject,
}) {
  return (
    <div
      className={
        "flex justify-between border-2 rounded-xl overflow-hidden " +
        (className ? className : "border-[#005121]")
      }
    >
      <div className="flex justify-center items-center w-[120px]">
        <p>{lable}</p>
      </div>
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setObject(object[objectKey]);
          }}
          className={
            "flex h-full justify-center items-center p-3 rounded-lg duration-200 fill-white border-2 ease-linear " +
            (object[objectKey]
              ? "bg-[#00BA4B] hover:bg-white hover:fill-[#00BA4B] border-[#00BA4B]"
              : "bg-red-500 hover:bg-white hover:fill-red-500 border-red-500")
          }
        >
          <div>
            {object[objectKey] ? (
              <svg
                className="w-[40px] h-[40px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
              </svg>
            ) : (
              <svg
                className="w-[40px] h-[40px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
