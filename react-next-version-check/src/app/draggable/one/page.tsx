"use client";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function StandaloneDraggable() {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "standalone-box",
  });

  const handleDragEnd = ({ delta }) => {
    if (delta) setPos((prev) => ({ x: prev.x + delta.x, y: prev.y + delta.y }));
  };

  return (
    <DndContext
      onDragStart={() => {
        console.log("drag start");
      }}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={setNodeRef}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          transform: CSS.Translate.toString(transform),
          cursor: "grab",
          backgroundColor: "lightblue",
          padding: "20px",
        }}
        {...listeners}
        {...attributes}
      >
        直接拖拽元素（无需子组件封装）
      </div>
    </DndContext>
  );
}
