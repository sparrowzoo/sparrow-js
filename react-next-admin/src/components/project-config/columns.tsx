import {ColumnDef, filterFns} from "@tanstack/react-table";
import * as React from "react";
import {BasicData, ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import CheckBoxCell from "@/common/components/table/cell/check-box";
import NormalCell from "@/common/components/table/cell/normal-cell";
import {NormalHeader} from "@/common/components/table/header/normal-header";
import TreeCell from "@/common/components/table/cell/tree";
import {EmptyHeader} from "@/common/components/table/header/empty";
import CheckboxHeader from "@/common/components/table/header/check-box";
import CurrencyCell from "@/common/components/table/cell/currency";
import ColumnFilter from "@/common/components/table/column-filter";

export interface ProjectConfig extends BasicData<ProjectConfig> {
    id: number;
    name: string;
    frontendName: string;
    chineseName: string;
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
        id: "expander",
        enableHiding: false,
        header: EmptyHeader,
        cell: TreeCell("status")
    },
    {
        id: "select",
        header: CheckboxHeader,
        cell: CheckBoxCell,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: NormalHeader({
            showSort: true,
            showFilter: true,
            columnTitle: "Status"
        } as ColumnOperationProps),
        cell: NormalCell("status"),
    },
    {
        accessorKey: "email",
        header: NormalHeader({
            showSort: false,
            showFilter: false,
            columnTitle: "Email"
        } as ColumnOperationProps),
        cell: NormalCell("email"),
        enableHiding: false,
    },
    {
        accessorKey: "amount",
        header: NormalHeader({columnTitle: "Amount", showSort: true} as ColumnOperationProps),
        cell: CurrencyCell("amount", "currency"),
        filterFn: filterFns.includesString,
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false
    },
    {
        id: "filter-column",
        enableHiding: false,
        header: () => {
            return <ColumnFilter table={table}/>;
        }
    }
];
