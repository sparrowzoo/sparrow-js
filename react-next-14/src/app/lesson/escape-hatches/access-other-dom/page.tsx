"use client";
import { forwardRef, useRef } from "react";

const ForwardInput = forwardRef((props, ref: any) => {
  return <input {...props} ref={ref} />;
});
ForwardInput.displayName = "自定义Name";

function MyInput(props: any) {
  return <input value={"Function Component"} {...props} />;
}

export default function Page() {
  //定义要控制的标签
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <ForwardInput ref={inputRef} />
      <input value={"Html Origin"} ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </>
  );
}
