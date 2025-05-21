"use client";
import React from "react";
import Draggable from "@/common/components/Draggable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <Popover>
      <PopoverTrigger asChild className={"fixed z-10 top-100 right-100"}>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 border-0 shadow-none">
        <Draggable>
          <div className="bg-white p-4 rounded-md w-[500px]">
            <div>
              <span>position: absolute;</span>
              <span>transform: translate(100px, 200px);</span>
              <span>转换为fixed定位 </span>
              <span>left: calc(100px + 原left值);</span>
              <span>top: calc(200px + 原top值); transform: none</span>
            </div>
            <input
              className="border-1 border-gray-300 rounded-md px-2 py-1 w-full"
              type="text"
            />
            <button onClick={() => console.log("clicked")}>Drag me</button>
          </div>
        </Draggable>
      </PopoverContent>
    </Popover>
  );
}
