import {ColumnDef, filterFns} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";


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
source:string; 
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
