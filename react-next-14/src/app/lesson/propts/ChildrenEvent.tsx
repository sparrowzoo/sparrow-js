import React, { useState } from "react";

function Children({ getFromChild }: { getFromChild: any }) {
  return (
    <input
      type="text"
      onChange={(e) => {
        getFromChild(e.target.value);
      }}
    ></input>
  );
}

export default function ChildrenEvent() {
  const [answer, setAnswer] = useState("");

  function getFromChild(msg: string) {
    setAnswer(msg);
  }

  return (
    <>
      <div>来自子组件：{answer}</div>
      <Children getFromChild={getFromChild} />;
    </>
  );
}
