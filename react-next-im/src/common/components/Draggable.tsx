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
  useEffect(() => {
    if (draggingRef.current) {
      const position = {
        left: draggingRef.current.offsetLeft,
        top: draggingRef.current.offsetTop,
      };
      console.log("dragging " + JSON.stringify(position));
      //setInitPosition(position);
    }
  }, []);
  const { children, dragged, position, setInitPosition } = draggableProps;
  let mergedStyles = {};
  if (transform) {
    if (position) {
      transform.x += position?.left;
      transform.y += position?.top;
    }
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
  const [fixedPosition, setFixedPosition] = useState<Position>({
    left: 0,
    top: 1000,
  });
  const [dragged, setDragged] = useState(false);

  return (
    <DndContext
      onDragStart={(e: DragStartEvent) => {
        console.log("drag start " + JSON.stringify(fixedPosition));
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
