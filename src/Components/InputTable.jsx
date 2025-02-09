import React from "react";

export default function InputTable({
  className,
  object,
  objectKey,
  setObject,
  lable,
  typeValue
}) {
  return (
    <div className={"relative " + className}>
      <input
        className="outline-none w-full h-full pl-3 py-4"
        placeholder={lable}
        type={typeValue}
        value={object[objectKey]}
        onChange={(e) => setObject(e.target.value)}
      />
    </div>
  );
}
