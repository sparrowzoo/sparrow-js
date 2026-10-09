"use client";
import React, { useState } from "react";
import {
  DndContext,
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
  const { position, children } = draggableProps;

  const localTransform: Transform = transform
    ? {
        x: transform.x + position.left,
        y: transform.y + position.top,
        scaleX: 1,
        scaleY: 1,
      }
    : {
        x: position.left,
        y: position.top,
        scaleX: 1,
        scaleY: 1,
      };

  return (
    <AsChild
      asChild={true}
      ref={setNodeRef}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        transform: CSS.Transform.toString(localTransform),
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
      onDragEnd={(e) => {
        setPosition((prev) => ({
          left: prev.left + e.delta.x,
          top: prev.top + e.delta.y,
        }));
      }}
    >
      <DraggableContainer asChild={draggableProps.asChild} position={position}>
        {draggableProps.children}
      </DraggableContainer>
    </DndContext>
  );
}
