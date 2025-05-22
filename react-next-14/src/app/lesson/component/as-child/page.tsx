"use client";
import React from "react";
import ChildComponent from "@/app/lesson/component/as-child/Child";

export default function ParentComponent() {
  return (
    <ChildComponent
      asChild
      className="parent-class"
      onClick={() => console.log("click")}
      data-testid="parent"
    >
      <button>点击我</button>
    </ChildComponent>
  );
}
