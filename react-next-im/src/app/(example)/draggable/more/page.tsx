"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Draggable from "@/common/components/Draggable";
import { Sidebar, SidebarMenu, SidebarProvider } from "@/components/ui/sidebar";

function DraggableItem() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Draggable>
          <div className="bg-gray-200 p-4 w-[200px] h-[200px]">hello</div>
        </Draggable>
      </PopoverContent>
    </Popover>
  );
}

function Talk() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>

      <PopoverContent>
        <SidebarProvider className={"min-h-full h-full w-auto"}>
          <Sidebar className={"relative min-h-full h-full"}>
            <SidebarMenu>
              <DraggableItem />
              <DraggableItem />
              <DraggableItem />
            </SidebarMenu>
          </Sidebar>
        </SidebarProvider>
      </PopoverContent>
    </Popover>
  );
}

export default function App() {
  return (
    <>
      <div className="fixed  right-100 bottom-0">
        <Talk />
      </div>
    </>
  );
}
