"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarMenu, SidebarProvider } from "@/components/ui/sidebar";
import Draggable from "@/common/components/Draggable";

function DraggableItem() {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <Draggable asChild={true}>
        <PopoverContent>
          <div className="bg-gray-200 p-4 w-[200px] h-[200px]">hello</div>
        </PopoverContent>
      </Draggable>
    </Popover>
  );
}

function Talk() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <Draggable asChild={true}>
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
      </Draggable>
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
