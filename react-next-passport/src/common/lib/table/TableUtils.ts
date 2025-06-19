import {Table} from "@tanstack/table-core";
import {IDENTITY} from "@/common/lib/table/DataTableProperty";

export function getSelectedIds(table: Table<any>, primary: string = "id") {
    const ids: IDENTITY[] = [];
    table.getSelectedRowModel().rows.forEach(row => {
        ids.push(row.original[primary] as IDENTITY);
    });
    return ids;
}
