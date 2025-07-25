import {ColumnDef} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import NormalCell from "@/common/components/table/cell/normal";
import PlainTextHeader from "@/common/components/table/header/plain-text";
import InputCell from "@/common/components/table/cell/input-cell";
import SortableCell from "@/common/components/table/cell/sortable";
import SelectCell from "@/common/components/table/cell/select-cell";

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
        accessorKey: "sort",
        header: PlainTextHeader({columnTitle: "序号"} as ColumnOperationProps),
        cell: SortableCell("sort"),
        enableHiding: true
    },
    {
        accessorKey: "propertyName",
        header: PlainTextHeader({columnTitle: "名称"} as ColumnOperationProps),
        cell: NormalCell("propertyName"),
        enableHiding: true
    }, {
        accessorKey: "chineseName",
        header: PlainTextHeader({columnTitle: "中文名"} as ColumnOperationProps),
        cell: InputCell("chineseName", "text", 20),
        enableHiding: true
    }, {
        accessorKey: "javaType",
        header: PlainTextHeader({columnTitle: "类型"} as ColumnOperationProps),
        cell: NormalCell("javaType"),
        enableHiding: true
    }, {
        accessorKey: "enableHidden",
        header: PlainTextHeader({columnTitle: "可隐藏"} as ColumnOperationProps),
        cell: InputCell("enableHidden", "checkbox"),
        enableHiding: true
    }, {
        accessorKey: "defaultHidden",
        header: PlainTextHeader({columnTitle: "默认隐藏"} as ColumnOperationProps),
        cell: InputCell("defaultHidden", "checkbox"),
        enableHiding: true
    }, {
        accessorKey: "showInEdit",
        header: PlainTextHeader({columnTitle: "编辑"} as ColumnOperationProps),
        cell: InputCell("showInEdit", "checkbox"),
        enableHiding: true
    }, {
        accessorKey: "showInList",
        header: PlainTextHeader({columnTitle: "列表"} as ColumnOperationProps),
        cell: InputCell("showInList", "checkbox"),
        enableHiding: true
    }, {
        accessorKey: "showInSearch",
        header: PlainTextHeader({columnTitle: "搜索"} as ColumnOperationProps),
        cell: InputCell("showInSearch", "checkbox"),
        enableHiding: true
    }, {
        accessorKey: "allowNull",
        header: PlainTextHeader({columnTitle: "可为空"} as ColumnOperationProps),
        cell: InputCell("allowNull", "checkbox"),
        enableHiding: true
    }, {
        accessorKey: "placeholder",
        header: PlainTextHeader({columnTitle: "Placeholder"} as ColumnOperationProps),
        cell: InputCell("placeholder", "text", 16),
        enableHiding: true
    }, {
        accessorKey: "searchType",
        header: PlainTextHeader({columnTitle: "查询方式"} as ColumnOperationProps),
        cell: SelectCell("searchType", true),
        enableHiding: true
    }, {
        accessorKey: "validateType",
        header: PlainTextHeader({columnTitle: "验证类型"} as ColumnOperationProps),
        cell: SelectCell("validateType", true),
        enableHiding: true
    }, {
        accessorKey: "datasourceType",
        header: PlainTextHeader({columnTitle: "数据源类型"} as ColumnOperationProps),
        cell: SelectCell("datasourceType", true),
        enableHiding: true
    }, {
        accessorKey: "dataSourceParams",
        header: PlainTextHeader({columnTitle: "数据源参数"} as ColumnOperationProps),
        cell: InputCell("dataSourceParams", "text", 16),
        enableHiding: true
    }, {
        accessorKey: "columnType",
        header: PlainTextHeader({columnTitle: "列类型"} as ColumnOperationProps),
        cell: SelectCell("columnType", true),
        enableHiding: true
    }, {
        accessorKey: "headerType",
        header: PlainTextHeader({columnTitle: "表头"} as ColumnOperationProps),
        cell: SelectCell("headerType", true),
        enableHiding: true
    }, {
        accessorKey: "cellType",
        header: PlainTextHeader({columnTitle: "单元格"} as ColumnOperationProps),
        cell: SelectCell("cellType", true),
        enableHiding: true
    }, {
        accessorKey: "controlType",
        header: PlainTextHeader({columnTitle: "控件"} as ColumnOperationProps),
        cell: SelectCell("controlType", true),
        enableHiding: true
    }
];
