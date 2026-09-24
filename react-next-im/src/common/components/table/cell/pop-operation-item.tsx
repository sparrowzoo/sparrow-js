import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {useState} from "react";
import {CellContext} from "@tanstack/table-core";
import {CellContextProps, MyTableMeta} from "@/common/lib/table/DataTableProperty";

interface PopItemProps<TData> {
    cellContext: CellContext<TData, string>;
    ItemComponent?: React.ComponentType<CellContextProps<TData>>
    displayText: string
}

export default function PopItem<TData>({cellContext, ItemComponent, displayText}: PopItemProps<TData>) {
    const [open, setOpen] = useState(false)
    const meta = cellContext.table.options.meta as MyTableMeta<TData>;

    const callback = () => {
        meta.initHandler();
        setOpen(false);
    }
    if (!ItemComponent) {
        return <></>
    }
    return <DropdownMenuItem>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={(e) => {
                    e.stopPropagation();
                }}>{displayText}</Button>
            </DialogTrigger>


            <DialogContent onClick={(e) => {
                e.stopPropagation();
            }
            } className={"sm:max-w-fit w-fit p-2 m-0 h-fit"}>
                <ItemComponent callbackHandler={callback} cellContext={cellContext}></ItemComponent>
            </DialogContent>
        </Dialog>
    </DropdownMenuItem>
}
