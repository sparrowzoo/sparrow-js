import {ColumnDef, filterFns} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import CheckBoxCell from "@/common/components/table/cell/check-box";
import EmptyHeader from "@/common/components/table/header/empty";
import NormalCell from "@/common/components/table/cell/normal";
import CheckboxHeader from "@/common/components/table/header/check-box";
import NormalHeader from "@/common/components/table/header/normal";
import ColumnFilter from "@/common/components/table/header/column-filter";
import OperationCell from "@/common/components/table/cell/operation";
import PlainTextHeader from "@/common/components/table/header/plain-text";

export interface ProjectConfig extends BasicData<ProjectConfig> {
    id: number;
    name: string;
    frontendName: string;
    chineseName: string;
    i18n: boolean;
    description: string;
    modulePrefix: string;
    scanPackage: string;
    architectures: string;
    config: string;
    wrapWithParent: boolean;
    scaffold: string;
    createUserName: string;
    createUserId: number;
    modifiedUserId: number;
    modifiedUserName: string;
    gmtCreate: number;
    gmtModified: number;
    deleted: boolean;
    status: string;

}

export const columns: ColumnDef<ProjectConfig>[] = [
{
accessorKey: "id",
header: PlainTextHeader({columnTitle: "", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("id"),
enableHiding: false
},{
accessorKey: "name",
header: PlainTextHeader({columnTitle: "项目名称", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("name"),
enableHiding: false
},{
id: "select",
header: CheckboxHeader,
cell: CheckBoxCell,
enableHiding: false
},{
accessorKey: "frontendName",
header: PlainTextHeader({columnTitle: "前端项目名称", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("frontendName"),
enableHiding: false
},{
accessorKey: "chineseName",
header: PlainTextHeader({columnTitle: "项目中文名称", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("chineseName"),
enableHiding: false
},{
accessorKey: "i18n",
header: PlainTextHeader({columnTitle: "是否支持国际化", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("i18n"),
enableHiding: false
},{
accessorKey: "description",
header: PlainTextHeader({columnTitle: "项目描述", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("description"),
enableHiding: false
},{
accessorKey: "modulePrefix",
header: PlainTextHeader({columnTitle: "模块前缀", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("modulePrefix"),
enableHiding: false
},{
accessorKey: "scanPackage",
header: PlainTextHeader({columnTitle: "扫描的包路径", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("scanPackage"),
enableHiding: false
},{
accessorKey: "architectures",
header: PlainTextHeader({columnTitle: "代码架构", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("architectures"),
enableHiding: false
},{
accessorKey: "config",
header: PlainTextHeader({columnTitle: "脚手架配置", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("config"),
enableHiding: false
},{
accessorKey: "wrapWithParent",
header: PlainTextHeader({columnTitle: "是否使用父module", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("wrapWithParent"),
enableHiding: false
},{
accessorKey: "scaffold",
header: PlainTextHeader({columnTitle: "脚手架", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("scaffold"),
enableHiding: false
},{
accessorKey: "createUserName",
header: PlainTextHeader({columnTitle: "创建人", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("createUserName"),
enableHiding: false
},{
accessorKey: "createUserId",
header: PlainTextHeader({columnTitle: "创建人ID", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("createUserId"),
enableHiding: false
},{
accessorKey: "modifiedUserId",
header: PlainTextHeader({columnTitle: "更新人ID", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("modifiedUserId"),
enableHiding: false
},{
accessorKey: "modifiedUserName",
header: PlainTextHeader({columnTitle: "更新人", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("modifiedUserName"),
enableHiding: false
},{
accessorKey: "gmtCreate",
header: PlainTextHeader({columnTitle: "创建时间", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("gmtCreate"),
enableHiding: false
},{
accessorKey: "gmtModified",
header: PlainTextHeader({columnTitle: "更新时间", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("gmtModified"),
enableHiding: false
},{
accessorKey: "deleted",
header: PlainTextHeader({columnTitle: "是否删除", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("deleted"),
enableHiding: false
},{
accessorKey: "status",
header: PlainTextHeader({columnTitle: "STATUS", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell: NormalCell("status"),
enableHiding: false
},{
id: "actions",
header: PlainTextHeader({columnTitle: "操作", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
cell:"Actions",
enableHiding: false
},{
id: "filter-column",
header: EmptyHeader,
cell:'',
enableHiding: false
}
    {
        id: "select",
        header: CheckboxHeader,
        cell: CheckBoxCell,
        enableHiding: false
    }, {
        accessorKey: "name",
        header: NormalHeader({
            showSort: true,
            showFilter: true,
            columnTitle: "项目名称",
            i18nPrefix: "ProjectConfig",
        } as ColumnOperationProps),
        filterFn: filterFns.includesString,
        cell: NormalCell("name"),
        enableHiding: true
    }, {
        accessorKey: "frontendName",
        header: NormalHeader({
            showSort: true,
            showFilter: false,
            columnTitle: "前端项目名称",
            i18nPrefix: "ProjectConfig",
        } as ColumnOperationProps),
        filterFn: filterFns.includesString,
        cell: NormalCell("frontendName"),
        enableHiding: true
    }, {
        accessorKey: "chineseName",
        header: NormalHeader({
            showSort: false,
            showFilter: false,
            columnTitle: "项目中文名",
            i18nPrefix: "ProjectConfig",
        } as ColumnOperationProps),
        cell: NormalCell("chineseName"),
        enableHiding: true
    }, {
        accessorKey: "description",
        header: NormalHeader({
            showSort: false,
            showFilter: false,
            columnTitle: "项目描述",
            i18nPrefix: "ProjectConfig",
        } as ColumnOperationProps),
        cell: NormalCell("description"),
        enableHiding: true
    }, {
        accessorKey: "modulePrefix",
        header: NormalHeader({
            showSort: false,
            showFilter: false,
            columnTitle: "模块前缀",
            i18nPrefix: "ProjectConfig",
        } as ColumnOperationProps),
        cell: NormalCell("modulePrefix"),
        enableHiding: true
    }, {
        accessorKey: "scanPackage",
        header: NormalHeader({
            showSort: false,
            showFilter: false,
            columnTitle: "扫描的包路径",
            i18nPrefix: "ProjectConfig",
        } as ColumnOperationProps),
        cell: NormalCell("scanPackage"),
        enableHiding: true
    }, {
        accessorKey: "architectures",
        header: NormalHeader({
            showSort: false,
            showFilter: false,
            columnTitle: "代码架构",
            i18nPrefix: "ProjectConfig",
        } as ColumnOperationProps),
        cell: NormalCell("architectures"),
        enableHiding: true
    }, {
        accessorKey: "config",
        header: NormalHeader({
            showSort: false,
            showFilter: false,
            columnTitle: "脚手架配置",
            i18nPrefix: "ProjectConfig",
        } as ColumnOperationProps),
        cell: NormalCell("config"),
        enableHiding: true
    }, {
        accessorKey: "wrapWithParent",
        header: PlainTextHeader({columnTitle: "是否使用父module", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
        cell: NormalCell("wrapWithParent"),
        enableHiding: false
    }, {
        accessorKey: "scaffold",
        header: PlainTextHeader({columnTitle: "脚手架", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
        cell: NormalCell("scaffold"),
        enableHiding: false
    }, {
        id: "actions",
        header: PlainTextHeader({columnTitle: "操作", i18nPrefix: "ProjectConfig"} as ColumnOperationProps),
        cell: "Actions",
        enableHiding: false
    }, {
        id: "filter-column",
        header: ColumnFilter,
        cell: "",
        enableHiding: false
    }
];