import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Components/Home";
import RegisterNumber from "./Components/RegisterNumber";
import Navbar from "./Components/Navbar";
import ListNumber from "./Components/ListNumber";
import NavTool from "./Components/NavTool";
import Appointment from "./Components/Appointment";
import SignIn from "./Components/SignIn";
import { userContext } from "./Context/User";
import { useContext } from "react";
import Notification from "./Components/Notification";
import Schedule from "./Components/Schedule";
import WindowWarning from "./Components/WindowWarning";
import SelectSchedule from "./Components/SelectSchedule";

function App() {
  const currentPath = useLocation();
  const currentContext = useContext(userContext);
  return (
    <>
      {currentPath.pathname !== "/signin" && (
        <div className="fixed w-full z-20">
          <Navbar />
        </div>
      )}

      {currentContext.windowWarning.isOpen && (
        <div>
          <WindowWarning />
        </div>
      )}
      {currentContext.notification.isOpen && <Notification />}
      <>{currentPath.pathname !== "/signin" && <NavTool />}</>
      <div
        className={
          "w-full h-full " +
          (currentPath.pathname !== "/signin" && "pt-[110px]")
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registernumber" element={<RegisterNumber />} />
          <Route path="/listnumber" element={<ListNumber />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/select-schedule" element={<SelectSchedule />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
