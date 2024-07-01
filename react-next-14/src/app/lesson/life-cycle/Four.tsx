import React from "react";
import FiveParent from "@/app/lesson/life-cycle/FiveParent";

export default React.memo(function Four() {
  function fourHandler(e: any) {
    e.stopPropagation();
  }

  console.log("我只会在props或state改变时执行");
  return (
    <div onClick={fourHandler}>
      我是老四
      <FiveParent />
    </div>
  );
});
