import React, { useState } from "react";
import FourParent from "@/app/lesson/life-cycle/Four";
import ThemeProvider from "@/app/lesson/life-cycle/SparrowThemePrivider";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ThirdParent() {
  const [third, setThird] = useState("third");
  console.log("third");

  function thirdHandler(e: any) {
    e.stopPropagation();
    setThird("我是老三" + Math.random());
  }

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <div onClick={thirdHandler}>
      Third parent {third}
      <FourParent />
      <ThemeProvider theme={"dark"}>
        <div>hello</div>
      </ThemeProvider>
    </div>
  );
}
