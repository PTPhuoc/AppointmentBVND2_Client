import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  patientInfor,
  typeInsurance,
  patientLogic,
  vitalSignsInfor,
  insuranceInfor,
  handleDateInsurance,
  insertDate,
  handleDatePicker,
  genderList,
  Zone,
} from "../Functions/HandleRegisterNumber";
import Ethnicity from "../Json/Ethnicity.json";
import CityList from "../Json/Citys.json";
import DistrictList from "../Json/Districts.json";
import WardList from "../Json/Wards.json";

export default function RegisterNumber() {
  const [patient, setPatient] = useState(patientInfor);
  const [vitalSign, setVitalSign] = useState(vitalSignsInfor);
  const [insurance, setInsurance] = useState(insuranceInfor);
  const [isFocusInput, setIsFocusInput] = useState(patientLogic);
  const [isSelectDate, setIsSelectDate] = useState({
    patient: false,
    toInsurance: false,
    fromInsurance: false,
  });
  const [listLocationPermanent, setListLocationPermanent] = useState(CityList);
  const [listLocationTemporary, setListLocationTemporary] = useState(CityList);

  const handleInputPatient = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleInputVitalSign = (e) => {
    const { name, value } = e.target;
    setVitalSign({ ...vitalSign, [name]: value });
  };

  const handleInputInsurance = (e) => {
    const { name, value } = e.target;
    setInsurance({ ...insurance, [name]: value });
  };

  const handleInputToInsurance = (e) => {
    const { name, value } = e.target;
    setInsurance({ ...insurance, to: { ...insurance.to, [name]: value } });
  };

  const handleInputFromInsurance = (e) => {
    const { name, value } = e.target;
    setInsurance({ ...insurance, from: { ...insurance.from, [name]: value } });
  };

  const inputRefs = useRef({});

  const focusInput = (name) => {
    inputRefs.current[name].click();
    inputRefs.current[name].focus();
  };

  const selectLocationList = (cityCode, districtCode, wardCode) => {
    if (districtCode === 0) {
      return DistrictList.filter((items) => items.cityCode === cityCode);
    } else if (wardCode === 0) {
      return WardList.filter((items) => items.districtCode === districtCode);
    } else {
      return CityList;
    }
  };

  const saveLocation = (
    key,
    city,
    cityCode,
    district,
    districtCode,
    ward,
    wardCode
  ) => {
    if (city) {
      setPatient({
        ...patient,
        [key]: { ...patient[key], city: city, cityCode: cityCode },
      });
    } else if (district) {
      setPatient({
        ...patient,
        [key]: {
          ...patient[key],
          district: district,
          districtCode: districtCode,
        },
      });
    } else {
      setPatient({
        ...patient,
        [key]: { ...patient[key], ward: ward, wardCode: wardCode },
      });
    }
  };

  useEffect(() => {
    const { cityCode, districtCode, wardCode } = patient.location;

    if (cityCode || districtCode || wardCode) {
      // Gọi selectLocationList với các tham số từ state
      const updatedList = selectLocationList(cityCode, districtCode, wardCode);
      setListLocationPermanent(updatedList);
    } else {
      setListLocationPermanent(CityList); // Nếu không có gì, trả về danh sách thành phố
    }
  }, [patient.location]);

  useEffect(() => {
    const { cityCode, districtCode, wardCode } = patient.currentLocation;

    if (cityCode || districtCode || wardCode) {
      // Gọi selectLocationList với các tham số từ state
      const updatedList = selectLocationList(cityCode, districtCode, wardCode);
      setListLocationTemporary(updatedList);
    } else {
      setListLocationTemporary(CityList); // Nếu không có gì, trả về danh sách thành phố
    }
  }, [patient.currentLocation]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        className="w-full h-full justify-center flex flex-wrap py-5 gap-5"
        onClick={() => setIsFocusInput(patientLogic)}
      >
        <div className="flex flex-col items-center w-[45%] min-w-[850px] border-2 border-[#005121] rounded-3xl gap-5 py-5 bg-white">
          <div>
            <p className="text-[#005121] text-[25px]">LÝ LỊCH</p>
          </div>
          <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
          <div className="relative w-[80%]">
            <input
              ref={(el) => (inputRefs.current["name"] = el)}
              name="name"
              value={patient.name}
              onChange={handleInputPatient}
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusName: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
              type="text"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("name");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.name || isFocusInput.focusName
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Tên bệnh nhân</p>
            </div>
          </div>
          <div className="relative flex items-center w-[80%] border-2 border-[#005121] rounded-lg px-5 py-2">
            {isSelectDate.patient && (
              <div className="absolute top-0 translate-y-12 z-[5]">
                <DatePicker
                  onChange={(date) => {
                    setPatient(handleDatePicker(patient, "birth", date));
                    setIsSelectDate({ ...isSelectDate, patient: false });
                  }}
                  inline
                />
              </div>
            )}
            <div className="pr-5">
              <p>Ngày sinh</p>
            </div>
            <div>
              <input
                name="day"
                value={patient.birth.day}
                onBlur={(e) => {
                  setPatient(
                    insertDate(
                      patient,
                      e.target.name,
                      "birth",
                      e.target.value,
                      false
                    )
                  );
                }}
                onChange={handleInputPatient}
                className="w-8 outline-none text-center"
                type="number"
              />
            </div>
            <div>
              <p>/</p>
            </div>
            <div>
              <input
                name="month"
                value={patient.birth.month}
                onBlur={(e) => {
                  setPatient(
                    insertDate(
                      patient,
                      e.target.name,
                      "birth",
                      e.target.value,
                      false
                    )
                  );
                }}
                onChange={handleInputPatient}
                className="w-8 outline-none text-center"
                type="number"
              />
            </div>
            <div>
              <p>/</p>
            </div>
            <div>
              <input
                name="year"
                value={patient.birth.year}
                onBlur={(e) => {
                  setPatient(
                    insertDate(
                      patient,
                      e.target.name,
                      "birth",
                      e.target.value,
                      false
                    )
                  );
                }}
                onChange={handleInputPatient}
                className="w-14 outline-none text-center"
                type="number"
              />
            </div>
            <div className="flex-grow"></div>
            <div className="w-[30px] h-[30px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSelectDate({
                    ...isSelectDate,
                    patient: !isSelectDate.patient,
                  });
                }}
                className="w-[30px] h-[30px]"
              >
                <svg
                  className="w-full h-full fill-slate-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="relative w-[80%] z-[4]">
            <input
              ref={(el) => (inputRefs.current["gender"] = el)}
              name="gender"
              value={patient.gender}
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusGender: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
              type="text"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("gender");
                setIsFocusInput({ ...patientLogic, focusGender: true });
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.gender || isFocusInput.focusGender
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Giới tính</p>
            </div>
            <div
              className={
                "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                (isFocusInput.focusGender ? "max-h-[150px] pt-5" : "max-h-0")
              }
            >
              {genderList.map((el) => (
                <div className="w-full">
                  <button
                    key={el.gender}
                    className="w-full bg-white px-5 py-2 border-y-2 border-white duration-200 ease-in-out hover:bg-slate-400 hover:text-white"
                    onClick={() => {
                      setPatient({
                        ...patient,
                        gender: el.gender,
                      });
                      setIsFocusInput(patientLogic);
                    }}
                  >
                    {el.gender}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-[80%]">
            <input
              ref={(el) => (inputRefs.current["age"] = el)}
              name="age"
              value={patient.age}
              onChange={handleInputPatient}
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusAge: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
              type="number"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("age");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.age || isFocusInput.focusAge
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Tuổi</p>
            </div>
          </div>
          <div className="relative w-[80%] z-[3]">
            <input
              ref={(el) => (inputRefs.current["ethnicity"] = el)}
              name="ethnicity"
              value={patient.ethnicity}
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusEthnicity: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
              type="text"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("ethnicity");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.ethnicity || isFocusInput.focusEthnicity
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Dân tộc</p>
            </div>
            <div
              className={
                "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                (isFocusInput.focusEthnicity ? "max-h-[150px] pt-5" : "max-h-0")
              }
            >
              {Ethnicity.map((el) => (
                <div className="w-full" key={el.number}>
                  <button
                    onClick={() => {
                      setPatient({ ...patient, ethnicity: el.ethnicity });
                    }}
                    className="w-full text-center pl-5 py-2 bg-white duration-200 ease-linear hover:bg-slate-500 hover:text-white"
                  >
                    {el.ethnicity}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-[80%] z-[2]">
            <input
              ref={(el) => (inputRefs.current["location"] = el)}
              name="location"
              value={
                patient.location.city +
                (patient.location.district &&
                  ", " + patient.location.district) +
                (patient.location.ward && ", " + patient.location.ward)
              }
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusLocation: true });
              }}
              className="w-full outline-none pl-5 pr-16 py-2 border-2 border-[#005121] rounded-lg"
              type="text"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("location");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.location.city ||
                patient.location.district ||
                patient.location.ward ||
                isFocusInput.focusLocation
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Địa chỉ thường trú</p>
            </div>
            <div
              className={
                "absolute flex items-center h-full mr-5 top-0 right-0 " +
                (!patient.location.city && "hidden")
              }
            >
              <div className="w-[30px] h-[30px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPatient({
                      ...patient,
                      location: {
                        city: "",
                        cityCode: 0,
                        district: "",
                        districtCode: 0,
                        ward: "",
                        wardCode: 0,
                      },
                    });
                  }}
                  className="w-[30px] h-[30px] bg-white"
                >
                  <svg
                    className="w-[30px] h-[30px] fill-slate-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
            </div>
            <div
              className={
                "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                (isFocusInput.focusLocation && !patient.location.ward
                  ? "max-h-[150px] pt-5"
                  : "max-h-0")
              }
            >
              {listLocationPermanent.map((el) => (
                <div className="w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveLocation(
                        "location",
                        el.city,
                        el.cityCode,
                        el.district,
                        el.districtCode,
                        el.ward,
                        el.wardCode
                      );
                      el.ward &&
                        setIsFocusInput({
                          ...isFocusInput,
                          focusLocation: false,
                        });
                    }}
                    className="w-full text-center pl-5 py-2 bg-white duration-200 ease-linear hover:bg-slate-500 hover:text-white"
                  >
                    {el.city ? el.city : el.district ? el.district : el.ward}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-[80%] z-[1]">
            <input
              ref={(el) => (inputRefs.current["currentLocation"] = el)}
              name="currentLocation"
              value={
                patient.currentLocation.city +
                (patient.currentLocation.district &&
                  ", " + patient.currentLocation.district) +
                (patient.currentLocation.ward &&
                  ", " + patient.currentLocation.ward)
              }
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({
                  ...patientLogic,
                  focusCurrentLocation: true,
                });
              }}
              className="w-full outline-none pl-5 pr-16 py-2 border-2 border-[#005121] rounded-lg"
              type="text"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("currentLocation");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.currentLocation.city ||
                patient.currentLocation.district ||
                patient.currentLocation.ward ||
                isFocusInput.focusCurrentLocation
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Địa chỉ tạm trú</p>
            </div>
            <div
              className={
                "absolute flex items-center h-full mr-5 top-0 right-0 " +
                (!patient.currentLocation.city && "hidden")
              }
            >
              <div className="w-[30px] h-[30px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPatient({
                      ...patient,
                      currentLocation: {
                        city: "",
                        cityCode: 0,
                        district: "",
                        districtCode: 0,
                        ward: "",
                        wardCode: 0,
                      },
                    });
                  }}
                  className="w-[30px] h-[30px] bg-white"
                >
                  <svg
                    className="w-[30px] h-[30px] fill-slate-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
            </div>
            <div
              className={
                "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                (isFocusInput.focusCurrentLocation &&
                !patient.currentLocation.ward
                  ? "max-h-[150px] pt-5"
                  : "max-h-0")
              }
            >
              {listLocationTemporary.map((el) => (
                <div className="w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveLocation(
                        "currentLocation",
                        el.city,
                        el.cityCode,
                        el.district,
                        el.districtCode,
                        el.ward,
                        el.wardCode
                      );
                      el.ward &&
                        setIsFocusInput({
                          ...isFocusInput,
                          focusCurrentLocation: false,
                        });
                    }}
                    className="w-full text-center pl-5 py-2 bg-white duration-200 ease-linear hover:bg-slate-500 hover:text-white"
                  >
                    {el.city ? el.city : el.district ? el.district : el.ward}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-[80%]">
            <input
              ref={(el) => (inputRefs.current["motherName"] = el)}
              name="motherName"
              value={patient.motherName}
              onChange={handleInputPatient}
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusMothername: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
              type="text"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("motherName");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.motherName || isFocusInput.focusMothername
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Tên mẹ giám hộ</p>
            </div>
          </div>
          <div className="relative w-[80%]">
            <input
              ref={(el) => (inputRefs.current["motherPhone"] = el)}
              name="motherPhone"
              value={patient.motherPhone}
              onChange={handleInputPatient}
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusMotherPhone: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
              type="number"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("motherPhone");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.motherPhone || isFocusInput.focusMotherPhone
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">SDT mẹ giám hộ</p>
            </div>
          </div>
          <div className="relative w-[80%]">
            <input
              ref={(el) => (inputRefs.current["fatherName"] = el)}
              name="fatherName"
              value={patient.fatherName}
              onChange={handleInputPatient}
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusFatherName: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
              type="text"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("fatherName");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.fatherName || isFocusInput.focusFatherName
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">Tên cha giám hộ</p>
            </div>
          </div>
          <div className="relative w-[80%]">
            <input
              ref={(el) => (inputRefs.current["fatherPhone"] = el)}
              name="fatherPhone"
              value={patient.fatherPhone}
              onChange={handleInputPatient}
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusFatherPhone: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
              type="number"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("fatherPhone");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.fatherPhone || isFocusInput.focusFatherPhone
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">SDT cha giám hộ</p>
            </div>
          </div>
          <div className="relative w-[80%]">
            <input
              ref={(el) => (inputRefs.current["cccd"] = el)}
              name="cccd"
              value={patient.cccd}
              onChange={handleInputPatient}
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusInput({ ...patientLogic, focusCccd: true });
              }}
              className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
              type="number"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusInput("cccd");
              }}
              className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                patient.cccd || isFocusInput.focusCccd
                  ? "-translate-y-6 text-sm text-[#005121]"
                  : "text-gray-400"
              }`}
            >
              <p className="bg-white px-1">CCCD</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-[45%] min-w-[850px] gap-5">
          <div className="flex flex-col items-center w-full min-w-[850px] border-2 border-[#005121] rounded-3xl gap-5 py-5 bg-white">
            <div>
              <p className="text-[#005121] text-[25px]">BẢO HIỂM Y TẾ</p>
            </div>
            <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
            <div className="relative w-[80%] z-[4]">
              <input
                ref={(el) => (inputRefs.current["typeInsurance"] = el)}
                name="typeInsurance"
                value={insurance.type}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...patientLogic, focusType: true });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
                type="text"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("gender");
                  setIsFocusInput({ ...patientLogic, focusType: true });
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  insurance.type || isFocusInput.focusType
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Nhóm BHYT</p>
              </div>
              <div
                className={
                  "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                  (isFocusInput.focusType ? "max-h-[150px] pt-5" : "max-h-0")
                }
              >
                {typeInsurance.map((el) => (
                  <div className="w-full">
                    <button
                      key={el.id}
                      className="w-full bg-white px-5 py-2 border-y-2 border-white duration-200 ease-in-out hover:bg-slate-400 hover:text-white"
                      onClick={() => {
                        setInsurance({
                          ...insurance,
                          type: el.type,
                        });
                        setIsFocusInput(patientLogic);
                      }}
                    >
                      {el.type}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-[80%]">
              <input
                ref={(el) => (inputRefs.current["code"] = el)}
                name="code"
                value={insurance.code}
                onChange={handleInputInsurance}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...patientLogic, focusCode: true });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
                type="number"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("code");
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  insurance.code || isFocusInput.focusCode
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Mã vạch</p>
              </div>
            </div>
            <div className="relative w-[80%]">
              <input
                ref={(el) => (inputRefs.current["numberCard"] = el)}
                name="numberCard"
                value={insurance.numberCard}
                onChange={handleInputInsurance}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...patientLogic, focusNumberCard: true });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
                type="number"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("numberCard");
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  insurance.numberCard || isFocusInput.focusNumberCard
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Số thẻ </p>
              </div>
            </div>
            <div className="w-[80%] gap-5 flex items-center z-[3]">
              <div className="relative flex items-center w-[50%] border-2 border-[#005121] rounded-lg px-5 py-2">
                {isSelectDate.toInsurance && (
                  <div className="absolute top-0 translate-y-12 z-[2]">
                    <DatePicker
                      onChange={(date) => {
                        setInsurance(
                          handleDateInsurance(insurance, date, "to")
                        );
                        setIsSelectDate({
                          ...isSelectDate,
                          toInsurance: false,
                        });
                      }}
                      inline
                    />
                  </div>
                )}
                <div className="pr-5">
                  <p>Từ</p>
                </div>
                <div>
                  <input
                    name="day"
                    value={insurance.to.day}
                    onBlur={(e) => {
                      setInsurance(
                        insertDate(
                          insurance,
                          e.target.name,
                          "to",
                          e.target.value
                        )
                      );
                    }}
                    onChange={handleInputToInsurance}
                    className="w-8 outline-none text-center"
                    type="number"
                  />
                </div>
                <div>
                  <p>/</p>
                </div>
                <div>
                  <input
                    name="month"
                    value={insurance.to.month}
                    onBlur={(e) => {
                      setInsurance(
                        insertDate(
                          insurance,
                          e.target.name,
                          "to",
                          e.target.value
                        )
                      );
                    }}
                    onChange={handleInputToInsurance}
                    className="w-8 outline-none text-center"
                    type="number"
                  />
                </div>
                <div>
                  <p>/</p>
                </div>
                <div>
                  <input
                    name="year"
                    value={insurance.to.year}
                    onBlur={(e) => {
                      setInsurance(
                        insertDate(
                          insurance,
                          e.target.name,
                          "to",
                          e.target.value
                        )
                      );
                    }}
                    onChange={handleInputToInsurance}
                    className="w-14 outline-none text-center"
                    type="number"
                  />
                </div>
                <div className="flex-grow"></div>
                <div className="w-[30px] h-[30px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSelectDate({
                        ...isSelectDate,
                        toInsurance: !isSelectDate.toInsurance,
                      });
                    }}
                    className="w-[30px] h-[30px]"
                  >
                    <svg
                      className="w-full h-full fill-slate-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-grow relative flex items-center border-2 border-[#005121] rounded-lg px-5 py-2">
                {isSelectDate.fromInsurance && (
                  <div className="absolute top-0 translate-y-12 z-[2]">
                    <DatePicker
                      onChange={(date) => {
                        setInsurance(
                          handleDateInsurance(insurance, date, "from")
                        );
                        setIsSelectDate({
                          ...isSelectDate,
                          fromInsurance: false,
                        });
                      }}
                      inline
                    />
                  </div>
                )}
                <div className="pr-5">
                  <p>Đến</p>
                </div>
                <div>
                  <input
                    name="day"
                    value={insurance.from.day}
                    onBlur={(e) => {
                      setInsurance(
                        insertDate(
                          insurance,
                          e.target.name,
                          "from",
                          e.target.value
                        )
                      );
                    }}
                    onChange={handleInputFromInsurance}
                    className="w-8 outline-none text-center"
                    type="number"
                  />
                </div>
                <div>
                  <p>/</p>
                </div>
                <div>
                  <input
                    name="month"
                    value={insurance.from.month}
                    onBlur={(e) => {
                      setInsurance(
                        insertDate(
                          insurance,
                          e.target.name,
                          "from",
                          e.target.value
                        )
                      );
                    }}
                    onChange={handleInputFromInsurance}
                    className="w-8 outline-none text-center"
                    type="number"
                  />
                </div>
                <div>
                  <p>/</p>
                </div>
                <div>
                  <input
                    name="year"
                    value={insurance.from.year}
                    onBlur={(e) => {
                      setInsurance(
                        insertDate(
                          insurance,
                          e.target.name,
                          "from",
                          e.target.value
                        )
                      );
                    }}
                    onChange={handleInputFromInsurance}
                    className="w-14 outline-none text-center"
                    type="number"
                  />
                </div>
                <div className="flex-grow"></div>
                <div className="w-[30px] h-[30px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSelectDate({
                        ...isSelectDate,
                        fromInsurance: !isSelectDate.fromInsurance,
                      });
                    }}
                    className="w-[30px] h-[30px]"
                  >
                    <svg
                      className="w-full h-full fill-slate-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="relative w-[80%] z-[2]">
              <input
                ref={(el) => (inputRefs.current["zone"] = el)}
                name="zone"
                value={insurance.zone}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...patientLogic, focusZone: true });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
                zone="text"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("gender");
                  setIsFocusInput({ ...patientLogic, focusZone: true });
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  insurance.zone || isFocusInput.focusZone
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Khu vực</p>
              </div>
              <div
                className={
                  "absolute -z-[1] -translate-y-5 w-full overflow-auto bg-slate-300 flex flex-col gap-1 border-2 border-[#005121] hidden-scrollbar rounded-lg duration-200 ease-in-out " +
                  (isFocusInput.focusZone ? "max-h-[150px] pt-5" : "max-h-0")
                }
              >
                {Zone.map((el) => (
                  <div className="w-full">
                    <button
                      key={el.value}
                      className="w-full bg-white px-5 py-2 border-y-2 border-white duration-200 ease-in-out hover:bg-slate-400 hover:text-white"
                      onClick={() => {
                        setInsurance({
                          ...insurance,
                          zone: el.value,
                        });
                        setIsFocusInput(patientLogic);
                      }}
                    >
                      {el.value}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-[80%]">
              <input
                ref={(el) => (inputRefs.current["interest"] = el)}
                name="interest"
                value={vitalSign.interest}
                onChange={handleInputVitalSign}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...patientLogic, focusInterest: true });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
                type="number"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("interest");
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  vitalSign.interest || isFocusInput.focusInterest
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Quyền lợi (%)</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 items-center w-full min-w-[850px] border-2 border-[#005121] rounded-3xl gap-5 py-5 bg-white">
            <div>
              <p className="text-[#005121] text-[25px]">SINH HIỆU</p>
            </div>
            <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
            <div className="relative w-[80%]">
              <input
                ref={(el) => (inputRefs.current["width"] = el)}
                name="width"
                value={vitalSign.width}
                onChange={handleInputVitalSign}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...patientLogic, focusWith: true });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
                type="number"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("width");
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  vitalSign.width || isFocusInput.focusWith
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Chiều cao (cm)</p>
              </div>
            </div>
            <div className="relative w-[80%]">
              <input
                ref={(el) => (inputRefs.current["height"] = el)}
                name="height"
                value={vitalSign.height}
                onChange={handleInputVitalSign}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...patientLogic, focusHeignt: true });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
                type="number"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("height");
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  vitalSign.height || isFocusInput.focusHeignt
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Cân nặng (kg)</p>
              </div>
            </div>
            <div className="relative w-[80%]">
              <input
                ref={(el) => (inputRefs.current["temperature"] = el)}
                name="temperature"
                value={vitalSign.temperature}
                onChange={handleInputVitalSign}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...patientLogic, focusTemperature: true });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
                type="number"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("temperature");
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  vitalSign.temperature || isFocusInput.focusTemperature
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Nhiệt độ</p>
              </div>
            </div>
            <div className="relative w-[80%]">
              <input
                ref={(el) => (inputRefs.current["pluse"] = el)}
                name="pluse"
                value={vitalSign.pluse}
                onChange={handleInputVitalSign}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFocusInput({ ...patientLogic, focusPluse: true });
                }}
                className="w-full outline-none pl-5 py-2 border-2 border-[#005121] rounded-lg"
                type="number"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  focusInput("pluse");
                }}
                className={`absolute top-0 left-0 h-full flex items-center ml-4 duration-200 ease-linear cursor-pointer ${
                  vitalSign.pluse || isFocusInput.focusPluse
                    ? "-translate-y-6 text-sm text-[#005121]"
                    : "text-gray-400"
                }`}
              >
                <p className="bg-white px-1">Mạch/phút</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-[#005121]"></div>
      <div className="flex flex-col items-center w-[45%] min-w-[850px] gap-5 py-5">
        <div>
          <p className="text-[#005121] text-[25px]">ĐIỀU PHỐI</p>
        </div>
        <div className="w-1/3 h-1 bg-[#00BA4B]"></div>
      </div>
    </div>
  );
}
