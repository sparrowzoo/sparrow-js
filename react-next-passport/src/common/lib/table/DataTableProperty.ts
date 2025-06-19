import {Cell, CellContext, ColumnDef} from "@tanstack/react-table";
import React from "react";
import {Table} from "@tanstack/table-core";

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
    setData?: React.Dispatch<React.SetStateAction<TData[]>>;
    filterColumn?: boolean;
    SearchComponent?: React.ComponentType<TableOperationProps<TData>>;
    OperationComponent?: React.ComponentType<any>;
    EditComponent?: React.ComponentType<RowEditProps>;

}

export interface TableOperationProps<TData> {
    table: Table<TData>;
    setData: React.Dispatch<React.SetStateAction<TData[]>>;
}

export interface EmptyRowProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}


export interface ColumnOperationProps {
    columnTitle: string;
    column: any;
    showFilter?: boolean;
    showSort?: boolean;
}

export interface RowEditProps {
    id: string | number;
    cellContext: CellContext<any, any>;
}

export interface RowOperationProps {
    EditComponent?: React.ComponentType<RowEditProps>;
    primary: string;
    cell: Cell<any, any>
}

export type IDENTITY = string | number;
