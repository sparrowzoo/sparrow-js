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
import {useTranslations} from "next-intl";
import {CellContextProps, MyTableMeta} from "@/common/lib/table/DataTableProperty";
import PopItem from "@/common/components/table/cell/pop-operation-item";


const OperationCell = ({cellContext}: CellContextProps<any>) => {
    const globalTranslate = useTranslations("GlobalForm");
    const table = cellContext?.table;
    const original = cellContext.row.original;
    const meta = table?.options?.meta as MyTableMeta<any>;
    const primary = meta.primary;
    const EditComponent = meta.EditComponent;
    const RowOperationComponents = meta.RowOperationComponents;
    const deleteHandler = meta.deleteHandler;
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel></DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <PopItem ItemComponent={EditComponent} cellContext={cellContext} displayText={globalTranslate("edit")}/>
                <DropdownMenuItem>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        deleteHandler(original[primary]);
                    }}>{globalTranslate("delete")}</Button>
                </DropdownMenuItem>
                {RowOperationComponents?.map((Item, index) => {
                    return <DropdownMenuItem key={index}>
                        <Item key={index} cellContext={cellContext}/>
                    </DropdownMenuItem>
                })
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
export default OperationCell;
