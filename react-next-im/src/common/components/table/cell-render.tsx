import {TableCell} from "@/components/ui/table";
import {flexRender} from "@tanstack/react-table";
import {BasicData, CellContextProps} from "@/common/lib/table/DataTableProperty";
import OperationCell from "@/common/components/table/cell/operation";

export default function CellRenderer<TData extends BasicData<TData>>({cellContext}: CellContextProps<TData>) {
    const cell = cellContext.cell;
    if (cell.column.columnDef.cell == "Actions") {
        return <TableCell key={cell.id}>
            <OperationCell cellContext={cellContext}/>
        </TableCell>
    }
    return <TableCell key={cell.id}>
        {flexRender(
            cell.column.columnDef.cell,
            cellContext
        )}
    </TableCell>
}
