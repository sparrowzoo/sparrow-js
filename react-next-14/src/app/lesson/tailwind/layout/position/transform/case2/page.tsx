import React from "react";

export default function Page() {
  return (
    <div className="w-[500px] h-[500px] bg-gray-200 fixed z-10 top-[100px] left-[100px]">
      <div className="w-[400px] h-[400px] bg-blue-50 fixed z-10 top-[200px] left-[200px]">
        <div
          className=" bg-red-500 w-fit h-fit text-white border-2 border-gray-300 rounded-md"
          id="box"
          style={{
            cursor: "grab",
            transform: "translate(0px, 100px)",
          }}
        >
          相对最近层的fixed元素
        </div>
      </div>
    </div>
  );
}
