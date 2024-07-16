'use client'
import * as React from "react"

import {Button} from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export default function Page() {

    return (
        <Drawer direction={"right"}>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent className=" inset-[unset] bg-white  flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0">
               <div>content</div>
            </DrawerContent>
        </Drawer>
    )
}
