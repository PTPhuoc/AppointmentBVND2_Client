import React, { useRef, useState } from "react";

export default function InputEdit({
  className,
  object,
  objectKey,
  setObject,
  typeInput,
  lable,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  return (
    <div className={"relative " + className}>
      <input
        className="w-full h-full outline-none border-2 border-[#005121] rounded-xl p-3"
        ref={inputRef}
        type={typeInput}
        name={objectKey}
        value={object[objectKey]}
        onChange={(e) => setObject(e.target.value)}
        onClick={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      <div
        className={
          "absolute top-0 left-3 mt-[10px] bg-white duration-200 ease-in-out " +
          (object[objectKey] || isOpen
            ? "-translate-y-5 text-sm"
            : "translate-y-0")
        }
        onClick={() => {
          setIsOpen(true);
          inputRef.current.focus();
        }}
      >
        <p>{lable}</p>
      </div>
    </div>
  );
}
