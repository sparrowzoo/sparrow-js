import {TableCell, TableRow} from "@/components/ui/table";
import * as React from "react";
import {EmptyRowProps} from "@/common/lib/table/DataTableProperty";

export function EmptyRow<TData, TValue>({
                                            columnSize,
                                        }: EmptyRowProps) {
    return (
        <TableRow>
            <TableCell colSpan={columnSize} className="h-24 text-center">
                No results.
            </TableCell>
        </TableRow>
    );
}
