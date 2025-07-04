import {ColumnDef} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import NormalCell from "@/common/components/table/cell/normal";
import PlainTextHeader from "@/common/components/table/header/plain-text";
import InputCell from "@/common/components/table/cell/input-cell";
import SortableCell from "@/common/components/table/cell/sortable";

export interface ColumnConfig extends BasicData<ColumnConfig> {
    tableClassName: string;
    propertyName: string;
    chineseName: string;
    subsidiaryColumns: string;
    javaType: string;
    enableHidden: boolean;
    defaultHidden: boolean;
    showInEdit: boolean;
    showInList: boolean;
    showInSearch: boolean;
    allowNull: boolean;
    placeholder: string;
    defaultValue: string;
    searchType: number;
    validateType: string;
    validator: any;
    dataSourceType: number;
    dataSourceParams: string;
    columnType: number;
    headerType: number;
    cellType: number;
    controlType: number;
    sort: number;
    readOnly: boolean;
}

export const columns: ColumnDef<ColumnConfig>[] = [
    {
        accessorKey: "propertyName",
        header: PlainTextHeader({columnTitle: "属性名"} as ColumnOperationProps),
        cell: NormalCell("propertyName"),
        enableHiding: true
    }, {
        accessorKey: "chineseName",
        header: PlainTextHeader({columnTitle: "中文名"} as ColumnOperationProps),
        cell: InputCell("chineseName", "text"),
        enableHiding: true
    }, {
        accessorKey: "subsidiaryColumns",
        header: PlainTextHeader({columnTitle: "附加列"} as ColumnOperationProps),
        cell: InputCell("subsidiaryColumns", "text"),
        enableHiding: true
    }, {
        accessorKey: "javaType",
        header: PlainTextHeader({columnTitle: "java类型"} as ColumnOperationProps),
        cell: NormalCell("javaType"),
        enableHiding: true
    }, {
        accessorKey: "sort",
        header: PlainTextHeader({columnTitle: "排序"} as ColumnOperationProps),
        cell: SortableCell("sort"),
        enableHiding: true
    }, {
        accessorKey: "readOnly",
        header: PlainTextHeader({columnTitle: "是否只读"} as ColumnOperationProps),
        cell: NormalCell("readOnly"),
        enableHiding: true
    }
];
