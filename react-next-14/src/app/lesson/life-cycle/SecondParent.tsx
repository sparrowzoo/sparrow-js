import React, { useState } from "react";
import ThirdParent from "@/app/lesson/life-cycle/ThirdParent";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function SecondParent() {
  const [second, setSecond] = useState("second");

  function secondHandler(e: any) {
    e.stopPropagation();

    setSecond("我是老二" + Math.random());
  }

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  console.log("second parent");
  return (
    <div onClick={secondHandler}>
      Second Parent 我有useMediaQuery 会影响下边的孩子 {second}
      <ThirdParent />
    </div>
  );
}
