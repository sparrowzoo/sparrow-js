"use client";
import { DndContext, DragStartEvent, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useState } from "react";
import { Move } from "lucide-react";

interface DraggableContainerProps {
  position: Position;
  dragged: boolean;
  children: React.ReactNode;
  setInitPosition: any;
}

function DraggableContainer(draggableProps: DraggableContainerProps) {
  const draggingRef = React.useRef<HTMLDivElement>(null);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "box",
  });
  const [localPosition, setLocalPosition] = useState<Position>(null);
  useEffect(() => {
    if (draggingRef.current) {
      const position = {
        left: draggingRef.current.offsetLeft,
        top: draggingRef.current.offsetTop,
      };
      setLocalPosition(position);
      console.log("dragging " + JSON.stringify(position));
      setInitPosition(position);
    }
  }, []);
  const { children, dragged, position, setInitPosition } = draggableProps;
  let mergedStyles = {};
  if (transform) {
    transform.x += position ? position.left : (localPosition?.left as number);
    transform.y += position ? position.top : (localPosition?.top as number);
    mergedStyles = {
      transform: CSS.Transform.toString(transform),
    };
  } else {
    if (dragged && position) {
      mergedStyles = {
        position: "fixed",
        left: `${position.left}px`,
        top: `${position.top}px`,
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
      {JSON.stringify(mergedStyles)}
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

type Position = { left: number; top: number } | null;

export default function Draggable(props: DraggableProps) {
  const [fixedPosition, setFixedPosition] = useState<Position>(null);
  const [initPosition, setInitPosition] = useState<Position>(null);

  const [dragged, setDragged] = useState(false);

  return (
    <DndContext
      onDragStart={(e: DragStartEvent) => {
        console.log("drag start " + JSON.stringify(fixedPosition));
      }}
      onDragEnd={(e) => {
        setFixedPosition((prev) => {
          const left = prev?.left ? prev.left : initPosition?.left;
          const top = prev?.top ? prev.top : initPosition?.top;
          if (left && top) {
            return { left: left + e.delta.x, top: top + e.delta.y };
          }
          return null;
        });
        setDragged(true);
      }}
    >
      <DraggableContainer
        position={fixedPosition}
        setInitPosition={setInitPosition}
        dragged={dragged}
      >
        {props.children}
      </DraggableContainer>
    </DndContext>
  );
}
