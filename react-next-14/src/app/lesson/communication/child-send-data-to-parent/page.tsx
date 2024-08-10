"use client";
import { ChangeEventHandler, useState } from "react";

function ChildComponent({
  sentContent,
}: {
  sentContent: ChangeEventHandler<HTMLInputElement>;
}) {
  return <input onChange={sentContent} />;
}

export default function Page() {
  const [data, setData] = useState("");

  function contentChange(e: any) {
    setData("i. from parent  " + e.target.value);
  }

  function clickHandle() {
    alert(data);
  }

  function sentContent(e: any) {
    setData("i. from child  " + e.target.value);
  }

  return (
    <>
      <input defaultValue={"please input data"} onChange={contentChange} />
      <ChildComponent sentContent={sentContent} />
      <button onClick={clickHandle}>get data</button>
    </>
  );
}
