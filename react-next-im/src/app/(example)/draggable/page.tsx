"use client";
import React, { useState } from "react";
import { DndContext, DragStartEvent, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableContainerProps {
  position: Position;
  children: React.ReactNode;
}

function DraggableContainer(draggableProps: DraggableContainerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "box",
    });

  const { position, children } = draggableProps;
  let mergedStyles = {};
  if (transform) {
    console.log("dragging init function ....", JSON.stringify(transform));

    //表示挪动了多少距离
    //结合transform case 示例更好理解
    if (position) {
      transform.x += position?.left;
      transform.y += position?.top;
    }
    mergedStyles = {
      transform: CSS.Transform.toString(transform),
      position: "transform",
    };
  } else {
    if (position) {
      mergedStyles = {
        position: "fixed",
        left: `${position.left}px`,
        top: `${position.top}px`,
      };
    }
  }

  return (
    <div
      className={"w-fit h-fit fixed left-0 top-0"}
      id={"box"}
      ref={setNodeRef}
      style={{
        cursor: "grab",
        ...mergedStyles,
      }}
      {...listeners}
    >
      <h1>未封装示例 Draggable</h1>
      {children}
    </div>
  );
}

type Position = { left: number; top: number } | null;

export default function Draggable() {
  const [fixedPosition, setFixedPosition] = useState<Position>({
    left: 100,
    top: 100,
  });

  return (
    <DndContext
      onDragStart={(e: DragStartEvent) => {
        console.log("dragging start " + JSON.stringify(fixedPosition));
      }}
      onDragEnd={(e) => {
        setFixedPosition((prev) => {
          const left = prev?.left;
          const top = prev?.top;
          if (left && top) {
            return { left: left + e.delta.x, top: top + e.delta.y };
          }
          return { left: e.delta.x, top: e.delta.y };
        });
      }}
    >
      <div
        className={
          "w-[500px] h-[500px] bg-gray-200 fixed z-10 top-[100px] left-[100px]"
        }
      >
        <DraggableContainer position={fixedPosition}>Hello</DraggableContainer>
      </div>
    </DndContext>
  );
}
