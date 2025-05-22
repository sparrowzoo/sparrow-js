"use client";
import React, { useState } from "react";
import {
  DndContext,
  DragStartEvent,
  MouseSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Position = { left: number; top: number } | null;

export default function Draggable() {
  const [fixedPosition, setFixedPosition] = useState<Position>({
    left: 100,
    top: 100,
  });
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 }, // 移动5px才触发拖拽
    })
  );

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "box",
    });
  let mergedStyles = {};
  if (transform) {
    console.log("dragging init function ....", JSON.stringify(transform));

    //表示挪动了多少距离
    //结合transform case 示例更好理解
    if (fixedPosition) {
      transform.x += fixedPosition?.left;
      transform.y += fixedPosition?.top;
    }
    mergedStyles = {
      transform: CSS.Transform.toString(transform),
      position: "transform",
    };
  } else {
    if (fixedPosition) {
      mergedStyles = {
        position: "fixed",
        left: `${fixedPosition.left}px`,
        top: `${fixedPosition.top}px`,
      };
    }
  }

  return (
    <DndContext
      sensors={sensors}
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
      <div>
        <div
          className={"w-fit h-fit fixed left-0 top-0"}
          id={"box"}
          ref={setNodeRef}
          style={{
            cursor: "grab",
            ...mergedStyles,
          }}
          {...attributes}
        >
          <h1 {...listeners}>未封装示例 Draggable</h1>
        </div>
      </div>
    </DndContext>
  );
}
