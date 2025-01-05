import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../Context/User";
import CryptoJS from 'crypto-js';

export default function SignIn() {
  const handleUser = useContext(userContext);
  const [user, setUser] = useState({ name: "", password: "" });
  const [isSignIn, setIsSignIn] = useState(false);
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const navigate = useNavigate();

  const hashString = (value) => {
    const encrypted = CryptoJS.AES.encrypt(value, process.env.REACT_APP_KEY_HASH).toString();
    return encrypted
  }

  const handleSignIn = (e) => {
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_API_URL + "/account/sign-in", { ...user })
      .then( (rs) => {
        if (rs.data.Status === "Success") {
          handleUser.setAccount(rs.data.Account);
          const hashName = hashString(rs.data.Account.name)
          window.localStorage.setItem("Name", hashName);
          navigate("/");
        }else{
          setIsSignIn(true)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (isSignIn) {
      setTimeout(() => {
        setIsSignIn(false);
      }, 5000);
    }
  }, [isSignIn]);

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex items-stretch">
        <div>
          <form
          method="post"
            onSubmit={handleSignIn}
            className="flex flex-col h-full items-center justify-center gap-5 px-16 bg-[#00B54B] rounded-l-3xl"
          >
            <div>
              <p className="text-[40px] text-white font-bold">ĐĂNG NHẬP</p>
            </div>
            <div className="w-full h-1 bg-white"></div>
            <div className="relative">
              {isSignIn && (
                <div className="absolute w-full top-0 -translate-y-10 p-1 text-center rounded-xl bg-rose-500 text-white">
                  <p>Tên tài khoản hoặc mật khẩu bị sai!</p>
                </div>
              )}
              <input
                name="name"
                value={user.name}
                onChange={handleInput}
                className="w-[300px] outline-none pl-5 py-2 rounded-lg"
                type="text"
                placeholder="Tên đăng nhập"
              />
            </div>
            <div>
              <input
                name="password"
                value={user.password}
                onChange={handleInput}
                className="w-[300px] outline-none pl-5 py-2 rounded-lg"
                type="password"
                placeholder="Mật khẩu"
              />
            </div>
            <div>
              <button
                type="submit"
                className="px-5 py-3 bg-[#005121] text-white border-2 border-[#005121] rounded-xl duration-200 ease-in hover:bg-white hover:text-[#005121]"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
        <div className="bg-[#00B54B] rounded-r-full">
          <div className="bg-white rounded-full">
            <img className="w-[400px]" src="/Image/BVND2logo.png" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
