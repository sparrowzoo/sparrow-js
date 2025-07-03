import {ColumnDef} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import NormalCell from "@/common/components/table/cell/normal";
import PlainTextHeader from "@/common/components/table/header/plain-text";

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
        accessorKey: "tableClassName",
        header: PlainTextHeader({columnTitle: "类名"} as ColumnOperationProps),
        cell: NormalCell("tableClassName"),
        enableHiding: true
    }, {
        accessorKey: "propertyName",
        header: PlainTextHeader({columnTitle: "属性名"} as ColumnOperationProps),
        cell: NormalCell("propertyName"),
        enableHiding: true
    }, {
        accessorKey: "chineseName",
        header: PlainTextHeader({columnTitle: "中文名"} as ColumnOperationProps),
        cell: NormalCell("chineseName"),
        enableHiding: true
    }, {
        accessorKey: "subsidiaryColumns",
        header: PlainTextHeader({columnTitle: "附加列"} as ColumnOperationProps),
        cell: NormalCell("subsidiaryColumns"),
        enableHiding: true
    }, {
        accessorKey: "javaType",
        header: PlainTextHeader({columnTitle: "java类型"} as ColumnOperationProps),
        cell: NormalCell("javaType"),
        enableHiding: true
    }, {
        accessorKey: "enableHidden",
        header: PlainTextHeader({columnTitle: "是否隐藏"} as ColumnOperationProps),
        cell: NormalCell("enableHidden"),
        enableHiding: true
    }, {
        accessorKey: "defaultHidden",
        header: PlainTextHeader({columnTitle: "默认隐藏"} as ColumnOperationProps),
        cell: NormalCell("defaultHidden"),
        enableHiding: true
    }, {
        accessorKey: "showInEdit",
        header: PlainTextHeader({columnTitle: "是否显示在编辑页面"} as ColumnOperationProps),
        cell: NormalCell("showInEdit"),
        enableHiding: true
    }, {
        accessorKey: "showInList",
        header: PlainTextHeader({columnTitle: "是否显示在列表页面"} as ColumnOperationProps),
        cell: NormalCell("showInList"),
        enableHiding: true
    }, {
        accessorKey: "showInSearch",
        header: PlainTextHeader({columnTitle: "是否显示在搜索页面"} as ColumnOperationProps),
        cell: NormalCell("showInSearch"),
        enableHiding: true
    }, {
        accessorKey: "allowNull",
        header: PlainTextHeader({columnTitle: "是否允许为空"} as ColumnOperationProps),
        cell: NormalCell("allowNull"),
        enableHiding: true
    }, {
        accessorKey: "placeholder",
        header: PlainTextHeader({columnTitle: "提示信息"} as ColumnOperationProps),
        cell: NormalCell("placeholder"),
        enableHiding: true
    }, {
        accessorKey: "defaultValue",
        header: PlainTextHeader({columnTitle: "默认值"} as ColumnOperationProps),
        cell: NormalCell("defaultValue"),
        enableHiding: true
    }, {
        accessorKey: "searchType",
        header: PlainTextHeader({columnTitle: "查询方式"} as ColumnOperationProps),
        cell: NormalCell("searchType"),
        enableHiding: true
    }, {
        accessorKey: "validateType",
        header: PlainTextHeader({columnTitle: "验证类型"} as ColumnOperationProps),
        cell: NormalCell("validateType"),
        enableHiding: true
    }, {
        accessorKey: "validator",
        header: PlainTextHeader({columnTitle: "验证器"} as ColumnOperationProps),
        cell: NormalCell("validator"),
        enableHiding: true
    }, {
        accessorKey: "dataSourceType",
        header: PlainTextHeader({columnTitle: "数据源类型"} as ColumnOperationProps),
        cell: NormalCell("dataSourceType"),
        enableHiding: true
    }, {
        accessorKey: "dataSourceParams",
        header: PlainTextHeader({columnTitle: "数据源参数"} as ColumnOperationProps),
        cell: NormalCell("dataSourceParams"),
        enableHiding: true
    }, {
        accessorKey: "columnType",
        header: PlainTextHeader({columnTitle: "列类型"} as ColumnOperationProps),
        cell: NormalCell("columnType"),
        enableHiding: true
    }, {
        accessorKey: "headerType",
        header: PlainTextHeader({columnTitle: "表头类型"} as ColumnOperationProps),
        cell: NormalCell("headerType"),
        enableHiding: true
    }, {
        accessorKey: "cellType",
        header: PlainTextHeader({columnTitle: "单元格类型"} as ColumnOperationProps),
        cell: NormalCell("cellType"),
        enableHiding: true
    }, {
        accessorKey: "controlType",
        header: PlainTextHeader({columnTitle: "控件类型"} as ColumnOperationProps),
        cell: NormalCell("controlType"),
        enableHiding: true
    }, {
        accessorKey: "sort",
        header: PlainTextHeader({columnTitle: "排序"} as ColumnOperationProps),
        cell: NormalCell("sort"),
        enableHiding: true
    }, {
        accessorKey: "readOnly",
        header: PlainTextHeader({columnTitle: "是否只读"} as ColumnOperationProps),
        cell: NormalCell("readOnly"),
        enableHiding: true
    }
];
