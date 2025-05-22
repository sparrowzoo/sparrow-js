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
      {...attributes}
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
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 }, // 移动5px才触发拖拽
    })
  );

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
      <div className={"w-[500px] h-[500px] fixed top-[100px] left-[100px]"}>
        <DraggableContainer position={fixedPosition}>
          <div className={" bg-blue-50 w-[200px]"}>
            <h1>Draggable</h1>
            <p>
              在React
              DnD框架中，对话框内按钮事件失效通常与事件冒泡、拖拽传感器配置或组件层级有关。
              使用DnD-Kit时，拖拽事件可能优先于点击事件触发。可通过设置activationConstraint参数，让拖拽仅在移动一定距离后触发：
              useSensors
            </p>
            <input
              className={"w-full p-2 border border-gray-300"}
              type="text"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("button click");
              }}
            >
              按钮
            </button>
          </div>
        </DraggableContainer>
      </div>
    </DndContext>
  );
}
