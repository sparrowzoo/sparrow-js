'use client'
import * as React from "react"

import {Button} from "@/components/ui/button"
import {Drawer, DrawerContent, DrawerTrigger,} from "@/components/ui/drawer"

export default function Page() {

    return (
        <div>
            <Drawer direction={"right"}>
                <DrawerTrigger asChild>
                    <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent
                    className=" bg-white inset-[unset] flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0">
                    <div>content</div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
