overwrite
import {ColumnDef, filterFns} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import NormalCell from "@/common/components/table/cell/normal";
import NormalHeader from "@/common/components/table/header/normal";
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
accessorKey: "name",
header: NormalHeader({
            showSort: true,
            showFilter: true,
            columnTitle: "项目名称",
        } as ColumnOperationProps),
filterFn: filterFns.includesString,
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
enableHiding: false
},{
accessorKey: "wrapWithParent",
header: PlainTextHeader({columnTitle: "是否使用父module"} as ColumnOperationProps),
cell: NormalCell("wrapWithParent"),
enableHiding: false
}
];