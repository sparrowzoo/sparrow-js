import {TableCell} from "@/components/ui/table";
import {flexRender} from "@tanstack/react-table";
import {RowOperationProps} from "@/common/lib/table/DataTableProperty";
import OperationCell from "@/common/components/table/cell/operation";

export default function CellRenderer({cell, primary,tableName, EditComponent,deleteHandler}: RowOperationProps) {
    if (cell.column.columnDef.cell == "Actions") {
        return <TableCell key={cell.id}>
            <OperationCell deleteHandler={deleteHandler}  tableName={tableName} primary={primary} EditComponent={EditComponent} cell={cell}/>
        </TableCell>
    }
    return <TableCell key={cell.id}>
        {flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
        )}
    </TableCell>
}
