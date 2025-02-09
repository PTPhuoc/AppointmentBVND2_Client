import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Components/Home";
import RegisterNumber from "./Components/RegisterNumber";
import Navbar from "./Components/Navbar";
import ListNumber from "./Components/ListNumber";
import NavTool from "./Components/NavTool";
import SignIn from "./Components/SignIn";
import { userContext } from "./Context/User";
import { useContext } from "react";
import Notification from "./Components/Notification";
import WindowWarning from "./Components/WindowWarning";
import ScheduleDoctor from "./Components/ScheduleDoctor";
import RegisterAppointment from "./Components/RegisterAppointment";
import SelectAppointment from "./Components/SelectAppointment";
import Loader from "./Components/Loader";

function App() {
  const currentPath = useLocation();
  const currentContext = useContext(userContext);
  return (
    <>
      {currentContext.pendingPage.getAccount === "pending" ? (
        <div className="fixed z-20 flex w-full h-full justify-center items-center bg-[rgba(255,255,255,0.7)]">
          <Loader />
        </div>
      ) : (
        currentPath.pathname !== "/signin" && (
          <div className="fixed w-full z-20">
            <Navbar />
          </div>
        )
      )}

      {currentContext.windowWarning.isOpen && (
        <div>
          <WindowWarning />
        </div>
      )}
      {currentContext.notification.isOpen && <Notification />}
      <>
        {currentPath.pathname !== "/signin" && currentContext.Account.id && (
          <NavTool />
        )}
      </>
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
          <Route path="/appointment" element={<RegisterAppointment />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/select-appointment" element={<SelectAppointment />} />
          <Route path="/schedule-doctor" element={<ScheduleDoctor />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
