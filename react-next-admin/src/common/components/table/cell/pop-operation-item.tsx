import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import Draggable from "@/common/components/Draggable";
import * as React from "react";
import {CellContext} from "@tanstack/table-core";
import {CellContextProps} from "@/common/lib/table/DataTableProperty";

interface PopItemProps {
    cellContext: CellContext<any, any>;
    ItemComponent?: React.ComponentType<CellContextProps<any>>
    displayText: string
}

export default function PopItem({cellContext, ItemComponent, displayText}: PopItemProps) {
    if (!ItemComponent) {
        return <></>
    }
    return <DropdownMenuItem>
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={(e) => {
                    e.stopPropagation();
                }}>{displayText}</Button>
            </DialogTrigger>

            <Draggable>
                <DialogContent onClick={(e) => {
                    e.stopPropagation();
                }
                } className={"sm:max-w-fit w-fit p-0 m-0 h-fit"}>
                    <ItemComponent cellContext={cellContext}></ItemComponent>
                </DialogContent>
            </Draggable>
        </Dialog>
    </DropdownMenuItem>
}
