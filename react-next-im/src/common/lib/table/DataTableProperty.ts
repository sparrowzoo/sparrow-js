import {Column, ColumnDef, TableMeta} from "@tanstack/react-table";
import React, {Dispatch, SetStateAction} from "react";
import {CellContext, Table} from "@tanstack/table-core";
import {VisibilityState} from "@tanstack/table-core/src/features/ColumnVisibility";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import KeyValue from "@/common/lib/protocol/KeyValue";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";

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
    defaultPager?: PaginationState;
}

export interface TableOperationProps<TData> {
    table: Table<TData>;
    callbackHandler?: () => void;
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
    searchHandler: (pager: PaginationState | undefined) => void;
    result: Result<PagerResult<TData>>;
    RowOperationComponents?: React.ComponentType<CellContextProps<TData>>[];
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

