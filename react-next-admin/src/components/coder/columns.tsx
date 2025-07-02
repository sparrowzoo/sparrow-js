import {ColumnDef} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import NormalCell from "@/common/components/table/cell/normal";
import PlainTextHeader from "@/common/components/table/header/plain-text";

export interface ColumnConfig extends BasicData<ColumnConfig> {
 tableClassName?: string;
 propertyName?: string;
 chineseName?: string;
 subsidiaryColumns?: string;
 javaType?: string;
 enableHidden?: boolean;
 defaultHidden?: boolean;
 showInEdit?: boolean;
 showInList?: boolean;
 showInSearch?: boolean;
 allowNull?: boolean;
 placeholder?: string;
 defaultValue?: string;
 /** 查询方式 */
 searchType?: number;
 validateType?: string;
 validator?: string; // 需替换为具体的Validator类型
 dataSourceType?: number;
 dataSourceParams?: string;
 columnType?: number;
 headerType?: number;
 cellType?: number;
 controlType?: number;
 sort?: number;
 readOnly?: boolean;
}


export const columns: ColumnDef<ColumnConfig>[] = [
{
  accessorKey: "id",
  header: PlainTextHeader({ columnTitle: "ID" } as ColumnOperationProps),
  cell: NormalCell("id"),
  enableHiding: true
 },
 {
  accessorKey: "propertyName",
  header: PlainTextHeader({ columnTitle: "属性名" } as ColumnOperationProps),
  cell: NormalCell("propertyName"),
 },
 {
  accessorKey: "chineseName",
  header: PlainTextHeader({ columnTitle: "中文名" } as ColumnOperationProps),
  cell: NormalCell("chineseName"),
 },
 {
  accessorKey: "javaType",
  header: SelectHeader({
   columnTitle: "字段类型",
   options: ["String", "Integer", "Boolean", "Date"]
  } as ColumnOperationProps),
  cell: TagCell("javaType"),
  columnType: 2,
  sort: 3
 },
 {
  accessorKey: "defaultValue",
  header: PlainTextHeader({ columnTitle: "默认值" } as ColumnOperationProps),
  cell: EditableCell("defaultValue"),
  showInEdit: true,
  sort: 4
 },
 {
  accessorKey: "readOnly",
  header: SwitchHeader({ columnTitle: "只读" } as ColumnOperationProps),
  cell: BooleanCell("readOnly"),
  controlType: 3,
  sort: 5
 },
 {
  accessorKey: "actions",
  header: "",
  cell: ActionCell([
   {
    icon: "edit",
    handler: (row) => handleEdit(row.original)
   },
   {
    icon: "delete",
    handler: (row) => handleDelete(row.original.id)
   }
  ]),
  enableSorting: false
 }
];