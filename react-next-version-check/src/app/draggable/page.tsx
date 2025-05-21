"use client";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface FixedPos {
  x: number;
  y: number;
}

function DraggablePage(fixedPos: FixedPos) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "box",
  });

  let mergedStyles = {};
  if (fixedPos.x || transform?.x) {
    mergedStyles = {
      transform: CSS.Transform.toString(transform),
      left: fixedPos.x,
      top: fixedPos.y,
    };
  }

  return (
    <div
      id={"box"}
      ref={setNodeRef}
      style={{
        zIndex: 999,
        cursor: "grab",
        touchAction: "none",
        position: "fixed",
        ...mergedStyles,
      }}
      {...listeners}
      {...attributes}
    >
      HELLO
    </div>
  );
}

export default function App() {
  const [fixedPos, setFixedPos] = useState({ x: 0, y: 0 });

  return (
    <DndContext
      onDragStart={() => {
        console.log("drag start");
      }}
      onDragEnd={(e) => {
        console.log(JSON.stringify(e));
        setFixedPos((prev) => ({
          x: prev.x + e.delta.x,
          y: prev.y + e.delta.y,
        }));
      }}
    >
      <DraggablePage x={fixedPos.x} y={fixedPos.y} />
    </DndContext>
  );
}
