import {Table} from "@tanstack/table-core";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result from "@/common/lib/protocol/Result";

class TableUtils {

    static getSelectedIds = (table: Table<any>) => {
        // @ts-ignore
        const primary = table.options.meta.primary;
        const ids: IDENTITY[] = [];
        table.getSelectedRowModel().rows.forEach(row => {
            ids.push(row.original[primary] as IDENTITY);
        });
        return ids;
    }

    static getSelectedFields = (table: Table<any>, field: string) => {
        // @ts-ignore
        const values: any[] = [];
        table.getSelectedRowModel().rows.forEach(row => {
            values.push(row.original[field]);
        });
        return values;
    }


    static getOriginalData = (table: Table<any>) => {
        const originalData: any[] = [];
        table.getRowModel().rows.forEach(row => {
            originalData.push(row.original);
        });
        return originalData;
    }

    static cloneResult= (result:Result<any>) => {
        return {
            ...result
        }as Result<any>;
    }

    static removeRowByPrimary = (ids: IDENTITY[], table: Table<any>) => {
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

    static batchEnable= (ids: IDENTITY[], table: Table<any>,statusField:string) => {
        return TableUtils.changeStatusByPrimary(ids, table,statusField, true);
    }

    static batchDisable= (ids: IDENTITY[], table: Table<any>,statusField:string) => {
        return TableUtils.changeStatusByPrimary(ids, table,statusField, false);
    }

   private static changeStatusByPrimary = (ids: IDENTITY[], table: Table<any>,statusField:string, status: boolean) => {
        // @ts-ignore
        const primary = table.options.meta.primary;
        const originalData: any[] = [];
        table.getRowModel().rows.forEach(row => {
            if (ids.indexOf(row.original[primary]) >= 0) {
                row.original[statusField]=status;
            }
            originalData.push(row.original);
        });
        return originalData;
    }
}

export default TableUtils;
