"use client";
import { DndContext, DragStartEvent, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";
import { Move } from "lucide-react";

interface DraggableContainerProps {
  x: number;
  y: number;
  dragged: boolean;
  children: React.ReactNode;
  setFixedPosition: any;
}

function DraggableContainer(draggableProps: DraggableContainerProps) {
  const draggingRef = React.useRef<HTMLDivElement>(null);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "box",
  });
  const { children, dragged, x, y, setFixedPosition } = draggableProps;
  let mergedStyles = {};
  if (transform) {
    transform.x += x;
    transform.y += y;
    mergedStyles = {
      transform: CSS.Transform.toString(transform),
    };
  } else {
    if (dragged) {
      mergedStyles = {
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
      };
    }
  }

  return (
    <div
      onMouseOver={() => {
        if (draggingRef.current) {
          draggingRef.current.style.visibility = "visible";
        }
      }}
      onMouseOut={() => {
        if (draggingRef.current) {
          draggingRef.current.style.visibility = "hidden";
        }
      }}
      className={"w-fit h-fit"}
      id={"box"}
      ref={setNodeRef}
      style={{
        cursor: "grab",
        ...mergedStyles,
      }}
      {...attributes}
    >
      {JSON.stringify(mergedStyles)} {x}
      {y}
      <div ref={draggingRef} className={"invisible"} {...listeners}>
        <Move />
        drag me
      </div>
      {children}
    </div>
  );
}

interface DraggableProps {
  children: React.ReactNode;
}

export default function Draggable(props: DraggableProps) {
  const [fixedPosition, setFixedPosition] = useState({ left: 0, top: 0 });
  const [dragged, setDragged] = useState(false);

  return (
    <DndContext
      onDragStart={(e: DragStartEvent) => {
        console.log("drag start " + JSON.stringify(fixedPosition));
      }}
      onDragEnd={(e) => {
        setFixedPosition((prev) => {
          return { left: prev.left + e.delta.x, top: prev.top + e.delta.y };
        });
        setDragged(true);
      }}
    >
      <DraggableContainer
        x={fixedPosition.left}
        y={fixedPosition.top}
        setFixedPosition={setFixedPosition}
        dragged={dragged}
      >
        {props.children}
      </DraggableContainer>
    </DndContext>
  );
}
