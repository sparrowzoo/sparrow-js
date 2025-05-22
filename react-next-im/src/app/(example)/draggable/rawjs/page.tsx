"use client";

import React, { useRef, useCallback } from "react";

let isMoving = false;
const gap = {
  x: 0,
  y: 0,
};

function RawJSDrag(props: {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const { style = {}, children = null } = props;

  const baseStyle: React.CSSProperties = {
    ...style,
    position: "absolute",
    minWidth: "100px",
    minHeight: "100px",
    cursor: "move",
    padding: "10px",
    borderRadius: "4px",
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  };

  const moveWrapperRef = useRef<HTMLDivElement | null>(null);

  const calcMousePosition = useCallback(
    (e: MouseEvent) => {
      const container = document.body as HTMLElement;
      const { x, y } = container.getBoundingClientRect();
      const left = e.clientX - gap.x - x;
      const top = e.clientY - gap.y - y + container.scrollTop;
      return { left, top };
    },
    [gap]
  );

  const handleMove = useCallback(
    (e: MouseEvent) => {
      const currentElement = moveWrapperRef.current;
      isMoving = true;
      const { left, top } = calcMousePosition(e);
      if (currentElement) {
        currentElement.style.top = top + "px";
        currentElement.style.left = left + "px";
      }
    },
    [moveWrapperRef.current, calcMousePosition]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      document.removeEventListener("mousemove", handleMove);
      if (isMoving) {
        isMoving = false;
      }
      document.removeEventListener("mouseup", handleMouseUp);
    },
    [isMoving, handleMove, calcMousePosition]
  );

  const startMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentElement = moveWrapperRef.current;
    if (currentElement) {
      const { left, top } = currentElement.getBoundingClientRect();
      gap.x = e.clientX - left;
      gap.y = e.clientY - top;
    }

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div ref={moveWrapperRef} onMouseDown={startMove} style={baseStyle}>
      {children}
    </div>
  );
}

export default function Page(props) {
  return (
    <RawJSDrag
      style={{
        left: 100,
        top: 100,
      }}
    >
      <div>可以随意拖动我</div>
      {/* 这个children的位置 可以传入 任意的想要被拖动的组件 */}
    </RawJSDrag>
  );
}
