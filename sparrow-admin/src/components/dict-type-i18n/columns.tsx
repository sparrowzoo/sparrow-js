import {ColumnDef} from "@tanstack/react-table";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import CheckBoxCell from "@/common/components/table/cell/check-box";
import NormalCell from "@/common/components/table/cell/normal";
import CheckboxHeader from "@/common/components/table/header/check-box";
import UnixTimestampCell from "@/common/components/table/cell/unix-timestamp";
import ColumnFilter from "@/common/components/table/header/column-filter";
import PlainTextHeader from "@/common/components/table/header/plain-text";

export interface DictTypeI18n extends BasicData<DictTypeI18n> 
{
 id:number; 
dictTypeId:number; 
locale:string; 
typeName:string; 
createUserName:string; 
createUserId:number; 
modifiedUserId:number; 
modifiedUserName:string; 
gmtCreate:number; 
gmtModified:number; 
status:string; 

}
export const columns: ColumnDef<DictTypeI18n>[] = [
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
 accessorKey: "dictTypeId",
header: PlainTextHeader({columnTitle: "字典类型"} as ColumnOperationProps),
cell: NormalCell("dictTypeId"),
enableHiding: true
},{
 accessorKey: "locale",
header: PlainTextHeader({columnTitle: "语言标识"} as ColumnOperationProps),
cell: NormalCell("locale"),
enableHiding: true
},{
 accessorKey: "typeName",
header: PlainTextHeader({columnTitle: "国际化名称"} as ColumnOperationProps),
cell: NormalCell("typeName"),
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