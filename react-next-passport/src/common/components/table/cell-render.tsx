import {TableCell} from "@/components/ui/table";
import {flexRender} from "@tanstack/react-table";
import {BasicData, RowOperationProps} from "@/common/lib/table/DataTableProperty";
import OperationCell from "@/common/components/table/cell/operation";

export default function CellRenderer<TData extends BasicData<TData>, TValue>({
                                                                                 cell,
                                                                                 EditComponent,
                                                                                 deleteHandler
                                                                             }: RowOperationProps<TData, TValue>) {

    if (cell.column.columnDef.cell == "Actions") {
        return <TableCell key={cell.id}>
            <OperationCell deleteHandler={deleteHandler} EditComponent={EditComponent} cell={cell}/>
        </TableCell>
    }
    return <TableCell key={cell.id}>
        {flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
        )}
    </TableCell>
}
