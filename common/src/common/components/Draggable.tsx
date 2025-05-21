"use client";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useState } from "react";
import { Move } from "lucide-react";

interface DraggableContainerProps {
  x: number;
  y: number;
  dragging: boolean;
  children: React.ReactNode;
}

let initPosition = {};

function DraggableContainer(draggableProps: DraggableContainerProps) {
  const draggingRef = React.useRef<HTMLDivElement>(null);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "box",
  });
  useEffect(() => {}, []);
  const { children, dragging, x, y } = draggableProps;
  let mergedStyles = {};
  if (transform) {
    transform.x += x;
    transform.y += y;
    mergedStyles = {
      transform: CSS.Transform.toString(transform),
    };
  } else {
    mergedStyles = {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
    };
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
  const [dragging, setDragging] = useState(false);
  return (
    <DndContext
      onDragStart={() => {
        console.log("drag start");
      }}
      onDragEnd={(e) => {
        setFixedPosition((prev) => {
          return { left: prev.left + e.delta.x, top: prev.top + e.delta.y };
        });
      }}
    >
      <DraggableContainer
        x={fixedPosition.left}
        y={fixedPosition.top}
        dragging={dragging}
      >
        {props.children}
      </DraggableContainer>
    </DndContext>
  );
}
