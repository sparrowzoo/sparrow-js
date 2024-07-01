"use client";
import React, { forwardRef, useRef } from "react";
import ChildComponent from "@/app/lesson/communication/parent-get-child-state/Child";
import Markdown from "react-markdown";
// @ts-ignore
import md from "./readme.md";

const ChildComponentForward = forwardRef(ChildComponent);

export interface ForwardMethod {
  getChildState: () => string;
}

// 父组件
const ParentComponent = () => {
  const childRef = useRef<ForwardMethod>();
  const handleButtonClick = () => {
    if (childRef.current) {
      console.log(childRef.current);
      //@ignore
      console.log(childRef.current.getChildState());
      // 获取子组件的状态值
    }
  };

  return (
    <div>
      <Markdown>{md}</Markdown>
      <ChildComponentForward ref={childRef} />
      <button onClick={handleButtonClick}>Get Child State</button>
    </div>
  );
};

export default ParentComponent;
