import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Input} from "@/components/ui/input";
import * as React from "react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";


function InnerColumnOperation({showFilter, showSort, columnTitle, column}: ColumnOperationProps) {
    if (showFilter) {
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
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem><Input
                        placeholder="Filter emails..."
                        value={(column?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            column?.setFilterValue(event.target.value)
                        }
                        onClick={(event) => event.stopPropagation()}
                        className="max-w-sm"
                    /></DropdownMenuItem>
                    {showSort && <DropdownMenuItem><Button
                        variant="ghost"
                        onClick={(e) => {
                            column.toggleSorting(column.getIsSorted() === "asc");
                            e.stopPropagation();
                        }}
                    >
                        <ArrowUpDown/>
                    </Button></DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
    if (showSort) {
        return <Button
            variant="ghost"
            onClick={(e) => {
                column.toggleSorting(column.getIsSorted() === "asc");
                e.stopPropagation();
            }}
        >
            <ArrowUpDown/>
        </Button>
    }
    return <></>
}

export default function ColumnOperation(props: ColumnOperationProps) {
    return <div className={"flex flex-row justify-start items-center"}>
        {props.columnTitle && <div className="text-gray-500 text-sm">{props.columnTitle}</div>}
        <InnerColumnOperation {...props} />
    </div>
}
