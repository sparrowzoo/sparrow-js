import {Table} from "@tanstack/table-core";
import {IDENTITY} from "@/common/lib/table/DataTableProperty";

export function getSelectedIds(table: Table<any>) {
    // @ts-ignore
    const primary = table.options.meta.primary;
    const ids: IDENTITY[] = [];
    table.getSelectedRowModel().rows.forEach(row => {
        ids.push(row.original[primary] as IDENTITY);
    });
    return ids;
}

export function getOriginalData(table: Table<any>) {
    const originalData: any[] = [];
    table.getRowModel().rows.forEach(row => {
        originalData.push(row.original);
    });
    return originalData;
}

export function removeRowByPrimary(ids: IDENTITY[], table: Table<any>) {
    // @ts-ignore
    const primary = table.options.meta.primary;
    const originalData: any[] = [];
    table.getRowModel().rows.forEach(row => {
        if (ids.indexOf(row.original[primary]) >= 0) {
            return;
        }
        originalData.push(row.original);
    });
    return originalData;
}
