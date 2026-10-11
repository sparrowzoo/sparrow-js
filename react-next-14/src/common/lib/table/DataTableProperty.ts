import {Column, ColumnDef, TableMeta} from "@tanstack/react-table";
import React, {Dispatch, SetStateAction} from "react";
import {CellContext, Table} from "@tanstack/table-core";
import {VisibilityState} from "@tanstack/table-core/src/features/ColumnVisibility";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result from "@/common/lib/protocol/Result";
import KeyValue from "@/common/lib/protocol/KeyValue";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";

export interface BasicData<TData> {
    id: number | string;
    parentId?: number;
    subRows?: TData[];
    depth?: number;
    hasChildren?: boolean;
}

export default interface DataTableProps<
    TData extends BasicData<TData>
> {
    columns: ColumnDef<TData, string>[];
    result: Result;
    primary?: string;
    tableName?: string;
    i18n: boolean;
    hiddenColumns?: VisibilityState | (() => VisibilityState);
    setData: React.Dispatch<React.SetStateAction<Result> | undefined>;
    SearchComponent?: React.ComponentType<TableOperationProps<TData>>;
    OperationComponent?: React.ComponentType<TableOperationProps<TData>>;
    EditComponent?: React.ComponentType<CellContextProps<TData>>;
    deleteHandler?: (id: IDENTITY) => void;
    initHandler: () => void;
    RowOperationComponents?: RowOperation<TData>[];
    parent?: object,
    defaultPager?: PaginationState;
    loadSubRows?: (row: TData) => Promise<TData[]>;
}

export interface TableOperationProps<TData> {
    table: Table<TData>;
    //回调函数保留在pop 中有使用
    callbackHandler?: () => void;
}

export interface CellContextProps<TData> {
    cellContext: CellContext<TData, string>;
    callbackHandler?: () => void;
}

export type RowOperation<TData> =
    {
        pop?: boolean;
        component: React.ComponentType<CellContextProps<TData>>;
        displayText?: string
    }

export interface MyTableMeta<TData> extends TableMeta<TData> {
    primary: string,
    parent: object,
    tableName: string,
    i18n: boolean,
    setData: React.Dispatch<React.SetStateAction<Result> | undefined>;
    SearchComponent?: React.ComponentType<TableOperationProps<TData>>;
    OperationComponent?: React.ComponentType<TableOperationProps<TData>>;
    EditComponent?: React.ComponentType<CellContextProps<TData>>;
    deleteHandler?: (id: IDENTITY) => void;
    initHandler: () => void;
    searchHandler: (pager: PaginationState | undefined) => void;
    result: Result;
    RowOperationComponents?: RowOperation<TData>[];
    loadSubRowsInto?: (row: TData) => Promise<void>;
    isNodeLoading?: (id: string) => boolean;
    removeExpansionKey: () => void;
}


export interface ColumnOperationProps {
    columnTitle: string;
    showFilter?: boolean;
    showSort?: boolean;
    column?: Column<unknown>
}

export interface EmptyRowProps {
    columnSize: number;
}

export interface SimplePager {
    pageNo?: number
    pageSize?: number
}

export interface SearchInputProps<T> {
    value?: string;
    propertyName: string;
    pageTranslate: (key: string) => string;
    setSearchCondition: Dispatch<SetStateAction<T>>;
    dictionary?: KeyValue[];
}

