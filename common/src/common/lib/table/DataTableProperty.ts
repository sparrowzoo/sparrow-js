import {Cell, ColumnDef} from "@tanstack/react-table";
import React from "react";
import {Table} from "@tanstack/table-core";
import {VisibilityState} from "@tanstack/table-core/src/features/ColumnVisibility";

export interface BasicData<TData> {
    id: number | string;
    parentId?: number;
    subRows?: TData[];
    depth?: number;
}

export default interface DataTableProps<
    TData extends BasicData<TData>,
    TValue
> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    primary?: string;
    tableName?: string;
    i18n: boolean;
    hiddenColumns?: VisibilityState | (() => VisibilityState);
    setData?: React.Dispatch<React.SetStateAction<TData[]>>;
    SearchComponent?: React.ComponentType<TableOperationProps<TData>>;
    OperationComponent?: React.ComponentType<TableOperationProps<TData>>;
    EditComponent?: React.ComponentType<RowEditProps<TData, TValue>>;
    deleteHandler: (id: IDENTITY) => void;
}

export interface TableOperationProps<TData> {
    table: Table<TData>;
    setData: React.Dispatch<React.SetStateAction<TData[]>>;
}


export interface ColumnOperationProps {
    columnTitle: string;
    showFilter?: boolean;
    showSort?: boolean;
}

export interface RowEditProps<TData, TValue> {
    id: string | number;
    cell: Cell<TData, TValue>,
}

export interface RowOperationProps<TData, TValue> {
    EditComponent?: React.ComponentType<RowEditProps<TData, TValue>>;
    cell: Cell<TData, TValue>,
    deleteHandler?: (id: IDENTITY) => void;
}

export type IDENTITY = string | number;
