import React, { useState } from "react";
import FourParent from "@/app/lesson/life-cycle/Four";
import ThemeProvider from "@/app/lesson/life-cycle/SparrowThemePrivider";

export default function ThirdParent() {
  const [third, setThird] = useState("third");
  console.log("third");

  function thirdHandler(e: any) {
    e.stopPropagation();
    setThird("我是老三" + Math.random());
  }

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
