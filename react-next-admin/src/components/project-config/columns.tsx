
import {ColumnDef, filterFns} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import CheckBoxCell from "@/common/components/table/cell/check-box";
import NormalCell from "@/common/components/table/cell/normal";
import CheckboxHeader from "@/common/components/table/header/check-box";
import OperationCell from "@/common/components/table/cell/operation";
import ColumnFilter from "@/common/components/table/header/column-filter";
import PlainTextHeader from "@/common/components/table/header/plain-text";

export interface ProjectConfig extends BasicData<ProjectConfig> 
{
 id:number; 
name:string; 
frontendName:string; 
chineseName:string; 
i18n:boolean; 
description:string; 
modulePrefix:string; 
architectures:string; 
config:string; 
wrapWithParent:boolean; 
scaffold:string; 
createUserName:string; 
createUserId:number; 
modifiedUserId:number; 
modifiedUserName:string; 
gmtCreate:number; 
gmtModified:number; 
deleted:boolean; 
status:string; 

}
export const columns: ColumnDef<ProjectConfig>[] = [
{
accessorKey: "id",
header: PlainTextHeader({columnTitle: "ID"} as ColumnOperationProps),
cell: NormalCell("id"),
enableHiding: true
},{
id: "select",
header: CheckboxHeader,
cell: CheckBoxCell,
enableHiding: false
},{
accessorKey: "name",
header: PlainTextHeader({columnTitle: "项目名称"} as ColumnOperationProps),
cell: NormalCell("name"),
enableHiding: true
},{
accessorKey: "frontendName",
header: PlainTextHeader({columnTitle: "前端项目名称"} as ColumnOperationProps),
cell: NormalCell("frontendName"),
enableHiding: true
},{
accessorKey: "chineseName",
header: PlainTextHeader({columnTitle: "项目中文名称"} as ColumnOperationProps),
cell: NormalCell("chineseName"),
enableHiding: true
},{
accessorKey: "i18n",
header: PlainTextHeader({columnTitle: "是否支持国际化"} as ColumnOperationProps),
cell: NormalCell("i18n"),
enableHiding: true
},{
accessorKey: "modulePrefix",
header: PlainTextHeader({columnTitle: "模块前缀"} as ColumnOperationProps),
cell: NormalCell("modulePrefix"),
enableHiding: true
},{
accessorKey: "architectures",
header: PlainTextHeader({columnTitle: "代码架构"} as ColumnOperationProps),
cell: NormalCell("architectures"),
enableHiding: true
},{
accessorKey: "wrapWithParent",
header: PlainTextHeader({columnTitle: "是否使用父module"} as ColumnOperationProps),
cell: NormalCell("wrapWithParent"),
enableHiding: true
},{
accessorKey: "scaffold",
header: PlainTextHeader({columnTitle: "脚手架"} as ColumnOperationProps),
cell: NormalCell("scaffold"),
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
cell: NormalCell("gmtCreate"),
enableHiding: true
},{
accessorKey: "gmtModified",
header: PlainTextHeader({columnTitle: "更新时间"} as ColumnOperationProps),
cell: NormalCell("gmtModified"),
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