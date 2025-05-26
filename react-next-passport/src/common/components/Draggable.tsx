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
import { CSS, Transform } from "@dnd-kit/utilities";
import AsChild from "@/common/components/AsChild";

type DraggableContainerProps = {
  position: Position;
  asChild?: boolean;
  children?: React.ReactNode;
};

function DraggableContainer(draggableProps: DraggableContainerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "box",
    });
  const { position, children, asChild, ...props } = draggableProps;
  let mergedStyles = {};
  let localTransform: Transform | null;
  if (!transform) {
    //说明初始化或者拖拽结束
    localTransform = {
      x: position.left,
      y: position.top,
      scaleX: 1,
      scaleY: 1,
    };
  } else {
    //表示拖拽中....
    //表示挪动了多少距离
    //结合transform case 示例更好理解
    localTransform = {
      x: transform.x + position.left,
      y: transform.y + position.top,
      scaleX: 1,
      scaleY: 1,
    };
  }
  mergedStyles = {
    transform: CSS.Transform.toString(localTransform),
  };

  return (
    <AsChild
      asChild={true}
      style={{
        cursor: "grab",
        ...mergedStyles,
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </AsChild>
  );
}

type Position = { left: number; top: number };

type DraggableProps = {
  asChild?: boolean;
  children?: React.ReactNode;
};
export default function Draggable(draggableProps: DraggableProps) {
  const [position, setPosition] = useState<Position>({
    left: 0,
    top: 0,
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
        console.log("dragging start " + JSON.stringify(position));
      }}
      onDragEnd={(e) => {
        setPosition((prev) => {
          const left = prev?.left;
          const top = prev?.top;
          if (left && top) {
            return { left: left + e.delta.x, top: top + e.delta.y };
          }
          return { left: e.delta.x, top: e.delta.y };
        });
      }}
    >
      <DraggableContainer asChild={draggableProps.asChild} position={position}>
        {draggableProps.children}
      </DraggableContainer>
    </DndContext>
  );
}
