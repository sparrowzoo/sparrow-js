import {Column, ColumnDef, TableMeta} from "@tanstack/react-table";
import React from "react";
import {CellContext, Table} from "@tanstack/table-core";
import {VisibilityState} from "@tanstack/table-core/src/features/ColumnVisibility";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result, {PagerResult} from "@/common/lib/protocol/Result";

export interface BasicData<TData> {
    id: number | string;
    parentId?: number;
    subRows?: TData[];
    depth?: number;
}

export default interface DataTableProps<
    TData extends BasicData<TData>
> {
    columns: ColumnDef<TData, string>[];
    result: Result<PagerResult<TData>>;
    primary?: string;
    tableName?: string;
    i18n: boolean;
    hiddenColumns?: VisibilityState | (() => VisibilityState);
    setData: React.Dispatch<React.SetStateAction<Result<PagerResult<TData>>> | undefined>;
    SearchComponent?: React.ComponentType<TableOperationProps<TData>>;
    OperationComponent?: React.ComponentType<TableOperationProps<TData>>;
    EditComponent?: React.ComponentType<CellContextProps<TData>>;
    deleteHandler?: (id: IDENTITY) => void;
    initHandler: () => void;
    RowOperationComponents?: React.ComponentType<CellContextProps<TData>>[];
    parent?: {},
    defaultPager?: SimplePager;
}

export interface TableOperationProps<TData> {
    table: Table<TData>;
}

export interface CellContextProps<TData> {
    cellContext: CellContext<TData, string>;
    callbackHandler?: () => void;
}

export interface MyTableMeta<TData> extends TableMeta<TData> {
    primary: string,
    parent: {},
    tableName: string,
    i18n: boolean,
    setData: React.Dispatch<React.SetStateAction<Result<PagerResult<TData>>> | undefined>;
    SearchComponent?: React.ComponentType<TableOperationProps<TData>>;
    OperationComponent?: React.ComponentType<TableOperationProps<TData>>;
    EditComponent?: React.ComponentType<CellContextProps<TData>>;
    deleteHandler?: (id: IDENTITY) => void;
    initHandler: () => void;
    searchHandler: (pager: SimplePager) => void;
    result: Result<PagerResult<TData>>;
    RowOperationComponents?: React.ComponentType<CellContextProps<TData>>[];
    pager: SimplePager;
    setPager: React.Dispatch<React.SetStateAction<SimplePager> | undefined>;
}


export interface ColumnOperationProps {
    columnTitle: string;
    showFilter?: boolean;
    showSort?: boolean;
    column?: Column<any>
}

export interface EmptyRowProps {
    columnSize: number;
}

export interface DialogCloseProps {
    callbackHandler: () => void;
}

export interface SimplePager {
    pageNo?: number
    pageSize?: number
}

