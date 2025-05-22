"use client";
import React from "react";
import Draggable from "@/common/components/Draggable"
export default function Page() {


    return (
       <Draggable  asChild={true}>
           <div>Drag me</div>
       </Draggable>
    );
}
