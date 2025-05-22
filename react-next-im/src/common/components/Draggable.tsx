"use client";
import { DndContext, DragStartEvent, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";

interface DraggableContainerProps {
  position: Position;
  dragged: boolean;
  children: (data: DraggableProps) => React.ReactNode;
  setInitPosition: any;
}

function DraggableContainer(draggableProps: DraggableContainerProps) {
  const draggingRef = React.useRef<HTMLDivElement>(null);
  const [init, setInit] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "box",
    });

  function initPosition() {
    if (!init) {
      const container = document.getElementById("box");
      const rect = container.getBoundingClientRect();
      const position = {
        left: rect.left,
        top: rect.top,
      };
      debugger;
      console.log("dragging init " + JSON.stringify(position));
      setInitPosition(position);
      // container.style.position = "absolute";
      // container.style.left = `${position.left}px`;
      // container.style.top = `${position.top}px`;
      //setInit(true);
    }
  }

  const { children, dragged, position, setInitPosition } = draggableProps;
  let mergedStyles = {};
  if (transform) {
    transform.x += position?.left;
    transform.y += position?.top;
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

  interface DraggableProps {
    onMouseOver: any;
    onMouseOut: any;
    attributes: any[];
    listeners: any[];
  }

  const childDraggableProps: DraggableProps = {
    onMouseOut: () => {},
    onMouseOver: () => {},
    ...attributes,
    ...listeners,
  };
  console.log("dragging init function ....", JSON.stringify(mergedStyles));
  return (
    <div
      onMouseOver={() => {
        if (draggingRef.current) {
          draggingRef.current.style.visibility = "visible";
        }
        initPosition();
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
      {...listeners}
    >
      {children(childDraggableProps)}
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
        {props.children(props)}
      </DraggableContainer>
    </DndContext>
  );
}
