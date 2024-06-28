import React, { useState } from "react";
import ThirdParent from "@/app/lesson/life-cycle/ThirdParent";

export default function SecondParent() {
  const [second, setSecond] = useState("second");

  function secondHandler(e: any) {
    e.stopPropagation();

    setSecond("我是老二" + Math.random());
  }

  console.log("second parent");
  return (
    <div onClick={secondHandler}>
      Second Parent {second}
      <ThirdParent />
    </div>
  );
}
