
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
import ImageCell from "@/common/components/table/cell/image";

export interface MicroService extends BasicData<MicroService> 
{
 id:number; 
tenantId:number; 
name:string; 
sort:number; 
logo:string; 
appId:number; 
url:string; 
remark:string; 
createUserName:string; 
createUserId:number; 
modifiedUserId:number; 
modifiedUserName:string; 
gmtCreate:number; 
gmtModified:number; 
deleted:boolean; 
status:string; 

}
export const columns: ColumnDef<MicroService>[] = [
{
 accessorKey: "id",
header: PlainTextHeader({columnTitle: ""} as ColumnOperationProps),
cell: NormalCell("id"),
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
 accessorKey: "name",
header: PlainTextHeader({columnTitle: "微服务名称"} as ColumnOperationProps),
cell: NormalCell("name"),
enableHiding: true
},{
 accessorKey: "sort",
header: PlainTextHeader({columnTitle: "排序"} as ColumnOperationProps),
cell: NormalCell("sort"),
enableHiding: true
},{
 accessorKey: "logo",
header: PlainTextHeader({columnTitle: "logo地址"} as ColumnOperationProps),
cell: ImageCell("logo"),
enableHiding: true
},{
 accessorKey: "appId",
header: PlainTextHeader({columnTitle: "所属APP ID"} as ColumnOperationProps),
cell: NormalCell("appId"),
enableHiding: true
},{
 accessorKey: "url",
header: PlainTextHeader({columnTitle: "微服务URL/路径"} as ColumnOperationProps),
cell: NormalCell("url"),
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