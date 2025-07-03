import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import * as React from "react";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {RowOperationProps} from "@/common/lib/table/DataTableProperty";
import Draggable from "@/common/components/Draggable";
import {useTranslations} from "next-intl";

const OperationCell = ({EditComponent, cell, deleteHandler}: RowOperationProps<any, any>) => {
    const globalTranslate = useTranslations("GlobalForm");
    const original = cell.getContext().row.original;
    const primary = cell.getContext()?.table?.options?.meta?.primary;

    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel></DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {EditComponent &&
                    <DropdownMenuItem>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button onClick={(e) => {
                                    e.stopPropagation();
                                }} variant="outline">{globalTranslate("edit")}</Button>
                            </DialogTrigger>
                            <Draggable>
                                <DialogContent onClick={(e) => {
                                    e.stopPropagation();
                                }
                                } className="w-[800px] sm:max-w-[625px]">
                                    <EditComponent cell={cell}
                                                   id={original[primary]}></EditComponent>
                                </DialogContent>
                            </Draggable>
                        </Dialog>
                    </DropdownMenuItem>
                }
                <DropdownMenuItem>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        deleteHandler(original[primary]);
                    }} variant="outline">{globalTranslate("delete")}</Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
export default OperationCell;
