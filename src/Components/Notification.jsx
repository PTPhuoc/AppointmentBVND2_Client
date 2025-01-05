import React, { useContext, useEffect } from "react";
import { userContext } from "../Context/User";

export default function Notification() {
  const currentContext = useContext(userContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentContext.notification.option === "N") {
        currentContext.setNotification({
          ...currentContext.notification,
          isOpen: false,
          handle: "pending",
          for: ""
        });
      }
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContext.notification]);
  return (
    <div className="fixed flex items-center top-0 right-0 z-10 w-[350px] h-[100px] bg-white mt-[115px] border-y-2 border-l-2 border-[#005121] rounded-l-full">
      <div className=" h-[30px] px-3">
        <svg
          className="w-[30px] h-[30px] fill-[#00BA4B]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z" />
        </svg>
      </div>
      <div className="flex-grow text-center">
        {currentContext.notification.content}
      </div>
      {(currentContext.notification.option === "YorN" ||
        currentContext.notification.option === "Y") && (
        <div className="h-full">
          <button
            onClick={() => {
              currentContext.setNotification({
                ...currentContext.notification,
                isOpen: false,
                handle: "Success",
              });
            }}
            className="h-full px-2 bg-[#00BA4B] border-2 border-[#00BA4B] fill-white duration-200 ease-out hover:bg-white hover:fill-[#00BA4B]"
          >
            <div className="w-[30px] h-[30px]">
              <svg
                className="w-[30px] h-[30px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
              </svg>
            </div>
          </button>
        </div>
      )}
      {(currentContext.notification.option === "YorN" ||
        currentContext.notification.option === "N") && (
        <div className="h-full">
          <button
            onClick={() => {
              currentContext.setNotification({
                ...currentContext.notification,
                isOpen: false,
                handle: "fault",
              });
            }}
            className="h-full px-2 bg-red-400 border-red-400 border-2 fill-white duration-200 ease-out hover:bg-white hover:fill-red-400"
          >
            <div className="w-[30px] h-[30px]">
              <svg
                className="w-[30px] h-[30px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
