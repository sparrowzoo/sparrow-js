import {ColumnDef, filterFns} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import CheckBoxCell from "@/common/components/table/cell/check-box";
import NormalCell from "@/common/components/table/cell/normal";
import CheckboxHeader from "@/common/components/table/header/check-box";
import NormalHeader from "@/common/components/table/header/normal";
import ColumnFilter from "@/common/components/table/header/column-filter";
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