
import {ColumnDef, filterFns} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import CheckBoxCell from "@/common/components/table/cell/check-box";
import NormalCell from "@/common/components/table/cell/normal";
import CheckboxHeader from "@/common/components/table/header/check-box";
import UnixTimestampCell from "@/common/components/table/cell/unix-timestamp";
import OperationCell from "@/common/components/table/cell/operation";
import ColumnFilter from "@/common/components/table/header/column-filter";
import PlainTextHeader from "@/common/components/table/header/plain-text";

export interface TableConfig extends BasicData<TableConfig> 
{
 id:number; 
projectId:number; 
primaryKey:string; 
tableName:string; 
className:string; 
description:string; 
locked:boolean; 
checkable:number; 
rowMenu:number; 
columnFilter:number; 
statusCommand:boolean; 
columnConfigs:string; 
source:number; 
sourceCode:string; 
createUserName:string; 
createUserId:number; 
modifiedUserId:number; 
modifiedUserName:string; 
gmtCreate:number; 
gmtModified:number; 
deleted:boolean; 
status:string; 

}
export const columns: ColumnDef<TableConfig>[] = [
{
accessorKey: "id",
header: PlainTextHeader({columnTitle: "ID"} as ColumnOperationProps),
cell: NormalCell("id"),
enableHiding: true
},{
id: "select",
header: CheckboxHeader,
cell:CheckBoxCell,
enableHiding: false
},{
accessorKey: "projectId",
header: PlainTextHeader({columnTitle: "项目ID"} as ColumnOperationProps),
cell: NormalCell("projectId"),
enableHiding: true
},{
accessorKey: "primaryKey",
header: PlainTextHeader({columnTitle: "主键"} as ColumnOperationProps),
cell: NormalCell("primaryKey"),
enableHiding: true
},{
accessorKey: "tableName",
header: PlainTextHeader({columnTitle: "表名"} as ColumnOperationProps),
cell: NormalCell("tableName"),
enableHiding: true
},{
accessorKey: "className",
header: PlainTextHeader({columnTitle: "类名"} as ColumnOperationProps),
cell: NormalCell("className"),
enableHiding: true
},{
accessorKey: "description",
header: PlainTextHeader({columnTitle: "描述"} as ColumnOperationProps),
cell: NormalCell("description"),
enableHiding: true
},{
accessorKey: "locked",
header: PlainTextHeader({columnTitle: "是否锁定"} as ColumnOperationProps),
cell: NormalCell("locked"),
enableHiding: true
},{
accessorKey: "checkable",
header: PlainTextHeader({columnTitle: "选择"} as ColumnOperationProps),
cell: NormalCell("checkable"),
enableHiding: true
},{
accessorKey: "rowMenu",
header: PlainTextHeader({columnTitle: "行菜单"} as ColumnOperationProps),
cell: NormalCell("rowMenu"),
enableHiding: true
},{
accessorKey: "columnFilter",
header: PlainTextHeader({columnTitle: "列过滤器"} as ColumnOperationProps),
cell: NormalCell("columnFilter"),
enableHiding: true
},{
accessorKey: "statusCommand",
header: PlainTextHeader({columnTitle: "是否显示状态命令"} as ColumnOperationProps),
cell: NormalCell("statusCommand"),
enableHiding: true
},{
accessorKey: "source",
header: PlainTextHeader({columnTitle: "类来源"} as ColumnOperationProps),
cell: NormalCell("source"),
enableHiding: true
},{
accessorKey: "createUserName",
header: PlainTextHeader({columnTitle: "创建人"} as ColumnOperationProps),
cell: NormalCell("createUserName"),
enableHiding: true
},{
accessorKey: "createUserId",
header: PlainTextHeader({columnTitle: "创建人ID"} as ColumnOperationProps),
cell: NormalCell("createUserId"),
enableHiding: true
},{
accessorKey: "modifiedUserId",
header: PlainTextHeader({columnTitle: "更新人ID"} as ColumnOperationProps),
cell: NormalCell("modifiedUserId"),
enableHiding: true
},{
accessorKey: "modifiedUserName",
header: PlainTextHeader({columnTitle: "更新人"} as ColumnOperationProps),
cell: NormalCell("modifiedUserName"),
enableHiding: true
},{
accessorKey: "gmtCreate",
header: PlainTextHeader({columnTitle: "创建时间"} as ColumnOperationProps),
cell: UnixTimestampCell("gmtCreate"),
enableHiding: true
},{
accessorKey: "gmtModified",
header: PlainTextHeader({columnTitle: "更新时间"} as ColumnOperationProps),
cell: UnixTimestampCell("gmtModified"),
enableHiding: true
},{
accessorKey: "deleted",
header: PlainTextHeader({columnTitle: "是否删除"} as ColumnOperationProps),
cell: NormalCell("deleted"),
enableHiding: true
},{
accessorKey: "status",
header: PlainTextHeader({columnTitle: "STATUS"} as ColumnOperationProps),
cell: NormalCell("status"),
enableHiding: true
},{
id: "actions",
header: PlainTextHeader({columnTitle: "操作"} as ColumnOperationProps),
cell:"Actions",
enableHiding: false
},{
id: "filter-column",
header: ColumnFilter(),
cell:"",
enableHiding: false
}
];