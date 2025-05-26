"use client";
import React from "react";
import Draggable from "@/common/components/Draggable";

export default function Page() {
  return (
    <Draggable asChild={true}>
      <div className={" bg-blue-50 w-[200px]"}>
        <h1>Draggable</h1>
        <p className={"w-[300px]"}>
          在React DnD框架中，对话框内按钮事件失效通常与事件冒泡、
          拖拽传感器配置或组件层级有关。
          使用DnD-Kit时，拖拽事件可能优先于点击事件触发。
          可通过设置activationConstraint参数， 让拖拽仅在移动一定距离后触发：
          useSensors
        </p>
        <input className={"w-full p-2 border border-gray-300"} type="text" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("button click");
          }}
        >
          按钮
        </button>
      </div>
    </Draggable>
  );
}
