"use client";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

function StandaloneDraggable() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "standalone-box",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "fixed",
        left: transform?.x,
        top: transform?.y,
        transform: CSS.Translate.toString(transform),
        cursor: "grab",
        backgroundColor: "lightblue",
        padding: "20px",
      }}
      {...attributes}
    >
      <div>
        <h1 {...listeners}>Drag me</h1>
        <input
          className="border-1 border-gray-300 rounded-md px-2 py-1 w-full"
          type="text"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        />
        <button onClick={() => console.log("clicked")}>Drag me</button>
      </div>
    </div>
  );
}

export default function DraggablePage() {
  return (
    <DndContext onDragStart={() => console.log("drag start")}>
      <StandaloneDraggable />
    </DndContext>
  );
}
