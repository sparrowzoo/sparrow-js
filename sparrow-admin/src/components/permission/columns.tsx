
import {ColumnDef, filterFns} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import CheckBoxCell from "@/common/components/table/cell/check-box";
import TreeCell from "@/common/components/table/cell/tree";
import NormalCell from "@/common/components/table/cell/normal";
import CheckboxHeader from "@/common/components/table/header/check-box";
import UnixTimestampCell from "@/common/components/table/cell/unix-timestamp";
import OperationCell from "@/common/components/table/cell/operation";
import ColumnFilter from "@/common/components/table/header/column-filter";
import PlainTextHeader from "@/common/components/table/header/plain-text";

export interface Permission extends BasicData<Permission> 
{
 id:number; 
tenantId:number; 
permissionCode:string; 
permissionName:string; 
permissionType:number; 
appId:number; 
microServiceId:number; 
parentId:number; 
operation:string; 
object:string; 
url:string; 
method:string; 
icon:string; 
target:string; 
sort:number; 
createUserName:string; 
createUserId:number; 
modifiedUserId:number; 
modifiedUserName:string; 
gmtCreate:number; 
gmtModified:number; 
deleted:boolean; 
status:string; 

}
export const columns: ColumnDef<Permission>[] = [
{
 accessorKey: "id",
header: PlainTextHeader({columnTitle: ""} as ColumnOperationProps),
cell: TreeCell("id"),
enableHiding: true
},{
 id: "select",
header: CheckboxHeader,
cell:CheckBoxCell,
enableHiding: false
},{
 accessorKey: "tenantId",
header: PlainTextHeader({columnTitle: "租户ID"} as ColumnOperationProps),
cell: NormalCell("tenantId"),
enableHiding: true
},{
 accessorKey: "permissionCode",
header: PlainTextHeader({columnTitle: "权限编码"} as ColumnOperationProps),
cell: NormalCell("permissionCode"),
enableHiding: true
},{
 accessorKey: "permissionName",
header: PlainTextHeader({columnTitle: "权限/菜单名称"} as ColumnOperationProps),
cell: NormalCell("permissionName"),
enableHiding: true
},{
 accessorKey: "permissionType",
header: PlainTextHeader({columnTitle: "类型"} as ColumnOperationProps),
cell: NormalCell("permissionType"),
enableHiding: true
},{
 accessorKey: "appId",
header: PlainTextHeader({columnTitle: "APP ID"} as ColumnOperationProps),
cell: NormalCell("appId"),
enableHiding: true
},{
 accessorKey: "microServiceId",
header: PlainTextHeader({columnTitle: "所属微服务ID"} as ColumnOperationProps),
cell: NormalCell("microServiceId"),
enableHiding: true
},{
 accessorKey: "parentId",
header: PlainTextHeader({columnTitle: "父节点ID"} as ColumnOperationProps),
cell: NormalCell("parentId"),
enableHiding: true
},{
 accessorKey: "operation",
header: PlainTextHeader({columnTitle: "操作"} as ColumnOperationProps),
cell: NormalCell("operation"),
enableHiding: true
},{
 accessorKey: "object",
header: PlainTextHeader({columnTitle: "对象/资源域"} as ColumnOperationProps),
cell: NormalCell("object"),
enableHiding: true
},{
 accessorKey: "url",
header: PlainTextHeader({columnTitle: "菜单/页面跳转地址"} as ColumnOperationProps),
cell: NormalCell("url"),
enableHiding: true
},{
 accessorKey: "method",
header: PlainTextHeader({columnTitle: "HTTP方法"} as ColumnOperationProps),
cell: NormalCell("method"),
enableHiding: true
},{
 accessorKey: "icon",
header: PlainTextHeader({columnTitle: "菜单图标"} as ColumnOperationProps),
cell: NormalCell("icon"),
enableHiding: true
},{
 accessorKey: "target",
header: PlainTextHeader({columnTitle: "Target"} as ColumnOperationProps),
cell: NormalCell("target"),
enableHiding: true
},{
 accessorKey: "sort",
header: PlainTextHeader({columnTitle: "排序"} as ColumnOperationProps),
cell: NormalCell("sort"),
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
header: PlainTextHeader({columnTitle: "状态"} as ColumnOperationProps),
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