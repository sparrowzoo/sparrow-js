import React from "react";

export default function Son() {
  function onSonClick() {}

  return (
    <div>
      <input type={"button"} onClick={onSonClick} value={"儿子+1"} />
    </div>
  );
}
