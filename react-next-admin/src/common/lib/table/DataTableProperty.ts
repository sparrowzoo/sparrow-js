import {ColumnDef} from "@tanstack/react-table";
import React from "react";
import {Table} from "@tanstack/table-core";
import {Payment} from "@/components/menu/columns";

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
    filterColumn?: boolean;
    SearchComponent?: React.ComponentType<SearchProps<TData>>;
    OperationComponent?: React.ComponentType<any>;
    setData :React.Dispatch<React.SetStateAction<TData[]>>
}

export interface SearchProps<TData> {
    table: Table<TData>;
    setData :React.Dispatch<React.SetStateAction<TData[]>>
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
