import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function NavTool() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={
        "fixed w-[300px] z-10 h-full pt-[110px] duration-200 ease-in-out " +
        (isOpen ? "-translate-x-0" : "-translate-x-[100%]")
      }
    >
      <div className="flex flex-col w-full h-full bg-slate-400">
        <div>
          <button
            className={
              "w-full flex items-center justify-end px-5 py-3 bg-slate-600 duration-200 ease-linear " +
              (isOpen ? "" : "translate-x-[70px] rounded-r-full")
            }
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <div className="flex-grow text-white text-start">
              <p>CÔNG CỤ</p>
            </div>
            <div className="w-[30px] h-[30px]">
              <svg
                className="w-[30px] h-[30px] fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
              </svg>
            </div>
          </button>
        </div>
        <div>
          <Link
            to="/registernumber"
            onClick={() => {
              setIsOpen(false);
            }}
            className="w-full flex text-slate-600 items-center px-5 py-3 bg-white border-y-2 border-slate-400 duration-200 ease-linear hover:bg-slate-400 hover:text-white hover:border-white"
          >
            <p>ĐĂNG KÝ KHÁM</p>
          </Link>
        </div>
        <div>
          <Link
            to="/appointment"
            onClick={() => {
              setIsOpen(false);
            }}
            className="w-full flex text-slate-600 items-center px-5 py-3 bg-white border-y-2 border-slate-400 duration-200 ease-linear hover:bg-slate-400 hover:text-white hover:border-white"
          >
            <p>HẸN KHÁM</p>
          </Link>
        </div>
        <div>
          <Link
            to="/schedule-doctor"
            onClick={() => {
              setIsOpen(false);
            }}
            className="w-full flex text-slate-600 items-center px-5 py-3 bg-white border-y-2 border-slate-400 duration-200 ease-linear hover:bg-slate-400 hover:text-white hover:border-white"
          >
            <p>LẬP LỊCH PHÒNG</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
