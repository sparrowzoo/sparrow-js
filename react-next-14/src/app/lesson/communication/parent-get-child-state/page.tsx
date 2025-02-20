"use client";
import React, { MutableRefObject, useRef, useState } from "react";
// @ts-ignore
import Markdown from "react-markdown";
// @ts-ignore
import md from "./readme.md";
import { CommunicationApi } from "@/app/lesson/communication/parent-get-child-state/CommunicationApi";
import LocationChild from "@/app/lesson/communication/parent-get-child-state/Child";
import ForwardChildController from "@/app/lesson/communication/parent-get-child-state/ChildCtroller";

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

type ButtonType = React.ElementRef<"button">;

function RefChildComponent() {
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  //然后将 ref 对象作为 ref 属性传递给想要操作的 DOM 节点的 JSX：
  const buttonRef: MutableRefObject<ButtonType | null> = useRef(null);
  return (
    <>
      <button
        ref={buttonRef} // ref is used to get the bounding client rect of the button
        onPointerEnter={() => {
          console.log(buttonRef);
          buttonRef.current;
          const rect = buttonRef.current?.getBoundingClientRect();
          setTargetRect({
            left: rect ? rect.left : 0,
            top: rect ? rect.top : 0,
            right: rect ? rect.right : 0,
            bottom: rect ? rect.bottom : 0,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      >
        这里是按钮
      </button>
      <br />
      {targetRect?.top}
      {targetRect?.left}
      {targetRect?.right}
      {targetRect?.bottom}
    </>
  );
}

// 父组件
const ParentComponent = () => {
  //const childRef=userRef(null);
  const childRef: React.MutableRefObject<CommunicationApi | null> =
    useRef<CommunicationApi>(null);

  const ref = useRef(null);
  const handleButtonClick = () => {
    if (childRef.current) {
      // 判断子组件是否挂载
      console.log(childRef.current); // 打印子组件的ref
      console.log(childRef.current.getChildState()); // 调用子组件的方法
    }

    if (ref.current) {
      const current:any=ref.current;
      console.log(current.innerHTML);
    }
  };

  return (
    <div>
      <Markdown>{md}</Markdown>
      {"然后将 ref 对象作为 ref 属性传递给想要操作的 DOM 节点的 JSX 元素" +
        "https://stackoverflow.com/questions/74989176/type-mutablerefobjectundefined-is-not-assignable-to-type-legacyrefhtmldive"}
      <LocationChild ref={childRef} data={"Hello World"} />
      <ForwardChildController ref={ref} data={"i.m from parent"} />
      <br />
      <RefChildComponent />
      <button onClick={handleButtonClick}>
        Get Child State Debug 后看console
      </button>
    </div>
  );
};
ParentComponent.displayName = "ParentComponent";
export default ParentComponent;
