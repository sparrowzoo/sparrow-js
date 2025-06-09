import {TableCell} from "@/components/ui/table";
import {flexRender} from "@tanstack/react-table";
import {RowOperationProps} from "@/common/lib/table/DataTableProperty";
import OperationCell from "@/common/components/table/cell/operation";

export default function CellRenderer({cell, primary, EditComponent}: RowOperationProps) {
    if (cell.column.columnDef.id == "actions") {
        return <TableCell key={cell.id}>
            <OperationCell primary={primary} EditComponent={EditComponent} cell={cell}/>
        </TableCell>
    }
    return <TableCell key={cell.id}>
        {flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
        )}
    </TableCell>
}
