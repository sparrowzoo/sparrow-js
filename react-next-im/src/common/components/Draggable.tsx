"use client";
import React, {cloneElement, useState} from "react";
import {
  DndContext,
  DragStartEvent,
  MouseSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import AsChild from "@/common/components/AsChild";

type DraggableContainerProps= {
  position: Position;
  asChild?: boolean;
  children?: React.ReactNode;
}

function DraggableContainer(draggableProps: DraggableContainerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: "box",
      });

  debugger;
  const { position, children,asChild,...props } = draggableProps;
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


  return (<AsChild asChild={true} className={"w-fit h-fit fixed left-0 top-0"}
                   id={"box"}
                   style={{
                     cursor: "grab",
                     ...mergedStyles,
                   }}
                   {...listeners}
                   {...attributes}>{children}</AsChild>
  );
}

type Position = { left: number; top: number } | null;

type DraggableProps= {
  asChild?: boolean;
  children?: React.ReactNode;
}
export default function Draggable(draggableProps: DraggableProps) {
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
          <DraggableContainer asChild={draggableProps.asChild} position={fixedPosition}>
            {draggableProps.children}
          </DraggableContainer>
      </DndContext>
  );
}
