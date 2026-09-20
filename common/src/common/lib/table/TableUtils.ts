import {Table} from "@tanstack/table-core";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result from "@/common/lib/protocol/Result";
import {Status} from "@/common/lib/protocol/Status";

type RowRecord = Record<string, unknown>;

class TableUtils {

    static getSelectedIds = <TData,>(table: Table<TData>) => {
        // @ts-expect-error primary is not declared on TableMeta
        const primary = table.options.meta.primary;
        const ids: IDENTITY[] = [];
        table.getSelectedRowModel().rows.forEach(row => {
            const original = row.original as unknown as RowRecord;
            ids.push(original[primary] as IDENTITY);
        });
        return ids;
    }

    static getSelectedFields = <TData,>(table: Table<TData>, field: string) => {
        const values: unknown[] = [];
        table.getSelectedRowModel().rows.forEach(row => {
            const original = row.original as unknown as RowRecord;
            values.push(original[field]);
        });
        return values;
    }


    static getOriginalData = <TData,>(table: Table<TData>) => {
        const originalData: RowRecord[] = [];
        table.getRowModel().rows.forEach(row => {
            originalData.push(row.original as unknown as RowRecord);
        });
        return originalData;
    }

    static cloneResult = (result: Result) => {
        return {
            ...result
        } as Result;
    }

    static removeRowByPrimary = <TData,>(ids: IDENTITY[], table: Table<TData>) => {
        // @ts-expect-error primary is not declared on TableMeta
        const primary = table.options.meta.primary;
        const originalData: RowRecord[] = [];
        table.getRowModel().rows.forEach(row => {
            const original = row.original as unknown as RowRecord;
            if (ids.indexOf(original[primary] as IDENTITY) >= 0) {
                return;
            }
            originalData.push(original);
        });
        return originalData;
    }

    static batchEnable = <TData,>(ids: IDENTITY[], table: Table<TData>, statusField: string) => {
        return TableUtils.changeStatusByPrimary(ids, table, statusField, "ENABLE");
    }

    static batchDisable = <TData,>(ids: IDENTITY[], table: Table<TData>, statusField: string) => {
        return TableUtils.changeStatusByPrimary(ids, table, statusField, "DISABLE");
    }

    private static changeStatusByPrimary = <TData,>(ids: IDENTITY[], table: Table<TData>, statusField: string, status: Status) => {
        // @ts-expect-error primary is not declared on TableMeta
        const primary = table.options.meta.primary;
        const originalData: RowRecord[] = [];
        table.getRowModel().rows.forEach(row => {
            const original = row.original as unknown as RowRecord;
            if (ids.indexOf(original[primary] as IDENTITY) >= 0) {
                original[statusField] = status;
            }
            originalData.push(original);
        });
        return originalData;
    }
}

export default TableUtils;
