import {ColumnDef} from "@tanstack/react-table";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import CheckBoxCell from "@/common/components/table/cell/check-box";
import NormalCell from "@/common/components/table/cell/normal";
import CheckboxHeader from "@/common/components/table/header/check-box";
import UnixTimestampCell from "@/common/components/table/cell/unix-timestamp";
import ColumnFilter from "@/common/components/table/header/column-filter";
import PlainTextHeader from "@/common/components/table/header/plain-text";

export interface Position extends BasicData<Position> 
{
 id:number; 
tenantId:number; 
organizationId:number; 
code:string; 
name:string; 
sort:number; 
createUserName:string; 
createUserId:number; 
modifiedUserId:number; 
modifiedUserName:string; 
gmtCreate:number; 
gmtModified:number; 
status:string; 

}
export const columns: ColumnDef<Position>[] = [
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
 accessorKey: "tenantId",
header: PlainTextHeader({columnTitle: "租户ID"} as ColumnOperationProps),
cell: NormalCell("tenantId"),
enableHiding: true
},{
 accessorKey: "organizationId",
header: PlainTextHeader({columnTitle: "所属部门ID"} as ColumnOperationProps),
cell: NormalCell("organizationId"),
enableHiding: true
},{
 accessorKey: "code",
header: PlainTextHeader({columnTitle: "岗位编码"} as ColumnOperationProps),
cell: NormalCell("code"),
enableHiding: true
},{
 accessorKey: "name",
header: PlainTextHeader({columnTitle: "岗位名称"} as ColumnOperationProps),
cell: NormalCell("name"),
enableHiding: true
},{
 accessorKey: "sort",
header: PlainTextHeader({columnTitle: "排序"} as ColumnOperationProps),
cell: NormalCell("sort"),
enableHiding: true
},{
 id: "actions",
header: PlainTextHeader({columnTitle: "操作"} as ColumnOperationProps),
cell:'Actions',
enableHiding: false
},{
 id: "filter-column",
header: ColumnFilter(),
cell:"",
enableHiding: false
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
 accessorKey: "status",
header: PlainTextHeader({columnTitle: "状态"} as ColumnOperationProps),
cell: NormalCell("status"),
enableHiding: true
}
];