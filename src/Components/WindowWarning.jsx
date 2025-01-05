import React, { useContext } from "react";
import { userContext } from "../Context/User";

export default function WindowWarning() {
  const currentContext = useContext(userContext);
  return (
    <div className="fixed z-50 w-full h-screen flex justify-center items-center bg-[rgba(255,255,255,0.7)] ">
      <div className="w-1/2 h-1/2 bg-slate-200 flex flex-col items-center border-2 border-zinc-500 overflow-hidden rounded-3xl">
        <div className="flex w-full bg-white p-5 gap-5 items-center border-b-2 border-black">
          <div className="w-[30px] h-[30px]">
            <svg
              className="w-[30px] h-[30px] fill-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
            </svg>
          </div>
          <div>
            <p className="font-extrabold">Cảnh báo</p>
          </div>
        </div>
        <div className="flex w-full flex-1 justify-center items-center bg-white">
          <div>
            <p className="text-center">{currentContext.windowWarning.content}</p>
          </div>
        </div>
        <div className="flex p-5 gap-5 justify-center">
          <div>
            <button
              onClick={() => {
                currentContext.setWindowWarning({
                  ...currentContext.windowWarning,
                  handle: "Success",
                  isOpen: false,
                });
              }}
              className="px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
            >
              Xác nhận
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                currentContext.setWindowWarning({
                  ...currentContext.windowWarning,
                  handle: "Fault",
                  isOpen: false,
                });
              }}
              className="px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
