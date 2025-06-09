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

const OperationCell = ({primary, EditComponent, cell}: RowOperationProps) => {
    const original = cell.getContext().row.original;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(original[primary || "id"])}
                >
                    Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                {EditComponent &&
                    <DropdownMenuItem>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button onClick={(e) => {
                                    e.stopPropagation();
                                }} variant="outline">新增</Button>
                            </DialogTrigger>
                            <Draggable>
                                <DialogContent onClick={(e) => {
                                    e.stopPropagation();
                                }
                                } className="w-[800px] sm:max-w-[625px]">
                                    <EditComponent cellContext={cell.getContext()}
                                                   id={original[primary]}></EditComponent>
                                </DialogContent>
                            </Draggable>
                        </Dialog>
                    </DropdownMenuItem>
                }
                <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
export default OperationCell;
