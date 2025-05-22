"use client";
import { DndContext, DragStartEvent, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";

interface DraggableContainerProps {
  position: Position;
  children: React.ReactNode;
}

function DraggableContainer(draggableProps: DraggableContainerProps) {
  const draggingRef = React.useRef<HTMLDivElement>(null);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "box",
    });

  const { children, position } = draggableProps;
  let mergedStyles = {};
  if (transform) {
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

  console.log("dragging init function ....", JSON.stringify(mergedStyles));
  return (
    <div
      className={"w-fit h-fit"}
      id={"box"}
      ref={setNodeRef}
      style={{
        cursor: "grab",
        ...mergedStyles,
      }}
      {...attributes}
    >
      {children}
    </div>
  );
}

interface DraggableProps {
  children: React.ReactNode;
}

type Position = { left: number; top: number } | null;

export default function Draggable(props: DraggableProps) {
  const [fixedPosition, setFixedPosition] = useState<Position>({
    left: 0,
    top: 0,
  });
  const [dragged, setDragged] = useState(false);

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
        setDragged(true);
      }}
    >
      <DraggableContainer
        position={fixedPosition}
        setInitPosition={setFixedPosition}
        dragged={dragged}
      >
        {props.children}
      </DraggableContainer>
    </DndContext>
  );
}
