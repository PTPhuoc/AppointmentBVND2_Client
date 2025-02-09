import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

export const userContext = createContext();

export default function User({ element }) {
  const [Account, setAccount] = useState({
    id: "",
    name: "",
    role: "",
  });
  const [notification, setNotification] = useState({
    for: "",
    content: "",
    isOpen: false,
    handle: "pending",
    option: "YorN",
  });
  const [windowWarning, setWindowWarning] = useState({
    for: "",
    content: "",
    isOpen: false,
    handle: "pending",
  });

  const [pendingPage, setPendingPage] = useState({
    getAccount: "pending",
  });

  const dehash = (value) => {
    const decrypted = CryptoJS.AES.decrypt(
      value,
      process.env.REACT_APP_KEY_HASH
    ).toString(CryptoJS.enc.Utf8);
    return decrypted;
  };

  const getAccount = () => {
    const hashName = window.localStorage.getItem("Name");
    if (hashName) {
      const Name = dehash(hashName);
      axios
        .post(process.env.REACT_APP_API_URL + "/account/get-infor-user", {
          name: Name,
        })
        .then((rs) => {
          if (rs.data.Status === "Success") {
            setAccount({ ...rs.data.Account });
          } else if (rs.data.Status === "Server Error") {
            setAccount({ id: "", name: "", role: "" });
            console.log(rs.data.Message);
          } else {
            setAccount({ id: "", name: "", role: "" });
          }
          setPendingPage({ ...pendingPage, getAccount: "Success" });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setAccount({ id: "", name: "", role: "" });
      setPendingPage({ ...pendingPage, getAccount: "Success" });
    }
  };

  useEffect(() => {
    if (!Account.id) {
      getAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <userContext.Provider
      value={{
        getAccount,
        Account,
        setAccount,
        notification,
        setNotification,
        windowWarning,
        setWindowWarning,
        pendingPage,
        setPendingPage,
      }}
    >
      {element}
    </userContext.Provider>
  );
}
