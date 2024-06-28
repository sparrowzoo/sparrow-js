import { useState } from "react";

export default function FileParent() {
  const [five, setFive] = useState("five");

  function fiveHandler(e: any) {
    e.stopPropagation();

    setFive("我是老五" + Math.random());
  }

  console.log("five parent");
  return <div onClick={fiveHandler}>Five parent {five}</div>;
}
