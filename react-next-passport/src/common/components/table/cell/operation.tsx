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
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import Draggable from "@/common/components/Draggable";
import {useTranslations} from "next-intl";
import {CellContextProps, MyTableMeta} from "@/common/lib/table/DataTableProperty";

const OperationCell = ({cellContext}: CellContextProps<any, any>) => {
    const globalTranslate = useTranslations("GlobalForm");
    const table = cellContext?.table;
    const original = cellContext.row.original;
    const meta = table?.options?.meta as MyTableMeta<any, any>;
    const primary = meta.primary;
    const EditComponent = meta.EditComponent;
    const width = meta.editorWidth;
    const className = "sm:max-w-fit w-fit";

    const deleteHandler = meta.deleteHandler;
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
                            <DialogTitle>
                                <DialogTrigger asChild>
                                    <Button onClick={(e) => {
                                        e.stopPropagation();
                                    }} variant="outline">{globalTranslate("edit")}</Button>
                                </DialogTrigger>
                            </DialogTitle>
                            <Draggable>
                                <DialogContent onClick={(e) => {
                                    e.stopPropagation();
                                }
                                } className={className}>
                                    <EditComponent cellContext={cellContext}></EditComponent>
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
