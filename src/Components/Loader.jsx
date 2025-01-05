import React from "react";

export default function Loader() {
  return (
    <div className="loader">
      <div className="absolute w-full h-full flex justify-center items-center z-[1]">
        <div>
          <img
            className="w-[50px] h-[50px] object-fill bg-white rounded-full"
            src="/Image/BVND2logo.png"
            alt="logo"
          />
        </div>
      </div>
    </div>
  );
}
