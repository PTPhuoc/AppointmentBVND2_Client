import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../Context/User";

export default function Navbar() {
  const handleUser = useContext(userContext);
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
          <div className="p-3 bg-[#00AE48] rounded-3xl text-white">
            <p>{handleUser.Account.name}</p>
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
