"use client";
import React from "react";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Sidebar, SidebarMenu, SidebarProvider} from "@/components/ui/sidebar";

function DraggableItem() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="bg-gray-200 p-4 w-[200px] h-[200px]">hello</div>
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
                            <DraggableItem/>
                            <DraggableItem/>
                            <DraggableItem/>
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
            <h1>这里和shandcn 组件有冲突 父组件fixed transform 会影响子组件fixed 定位</h1>
            <div style={{height: "100vh", width: "100vw", position: "fixed", top: 636, left: 516, zIndex: -1}}>222</div>
            <div className="fixed  right-100 bottom-0">
                <Talk/>
            </div>
        </>
    );
}
