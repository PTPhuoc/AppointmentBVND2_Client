import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../Context/User";

export default function Navbar() {
  const handleUser = useContext(userContext);
  const [isOption, setIsOption] = useState(false);

  const navigate = useNavigate()

  const signOut = () => {
    window.localStorage.setItem("Name", "")
    handleUser.getAccount()
    handleUser.setWindowWarning({
      ...handleUser.windowWarning,
      for: "",
      handle: "pending",
    });
    navigate("/")
  }

  const warningSignOut = () => {
    handleUser.setWindowWarning({
      ...handleUser.windowWarning,
      for: "SignOut",
      isOpen: true,
      content: "Bạn có chắc muốn Đăng Xuất",
      handle: "pending",
    });
  }

  useEffect(() => {
      if (handleUser.windowWarning.handle === "Success") {
        if (handleUser.windowWarning.for === "SignOut") {
          signOut()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleUser.windowWarning.handle]);

  return (
    <div className="w-full flex h-[110px] items-stretch border-b-2 border-black justify-between pr-10 text-[#00AE48] font-bold bg-white">
      <div className="h-full w-[400px] overflow-hidden rounded-tr-full rounded-br-full">
        <Link to="/" className="flex items-center gap-5 bg-[#B4FFD2] h-full">
          <div>
            <img className="w-[100px]" src="/Image/BVND2logo.png" alt="BVND2" />
          </div>
          <div>
            <p>BỆNH VIỆN NHI ĐỒNG 2</p>
          </div>
        </Link>
      </div>
      <div className="flex gap-10 items-center">
        <div>
          <Link to="/">Trang Chủ</Link>
        </div>
        <div>
          <Link to="/listnumber">Danh Sách Khám Bệnh</Link>
        </div>
        {handleUser.Account.id ? (
          <div
            onClick={() => setIsOption(!isOption)}
            className="relative w-[150px] text-center p-3 bg-[#00AE48] rounded-3xl text-white cursor-pointer"
          >
            <p>{handleUser.Account.name}</p>
            <div
              className={
                "absolute flex flex-col gap-1 w-full bg-slate-300 left-0 translate-y-4 rounded-3xl overflow-hidden " +
                (isOption ? "max-h-[200px]" : "max-h-0")
              }
            >
              <div className="w-full">
                <button onClick={() => warningSignOut()} className="w-full p-3 bg-white text-slate-500 border-2 border-slate-500 rounded-3xl duration-200 ease-linear hover:bg-slate-500 hover:text-white">
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Link to="/signin">Đăng Nhập</Link>
          </div>
        )}
      </div>
    </div>
  );
}
