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
    TData extends BasicData<TData>,
    TValue
> {
    columns: ColumnDef<TData, TValue>[];
    result: Result<PagerResult<TData>>;
    primary?: string;
    tableName?: string;
    i18n: boolean;
    hiddenColumns?: VisibilityState | (() => VisibilityState);
    setData?: React.Dispatch<React.SetStateAction<TData[]>>;
    SearchComponent?: React.ComponentType<TableOperationProps<TData>>;
    OperationComponent?: React.ComponentType<TableOperationProps<TData>>;
    EditComponent?: React.ComponentType<CellContextProps<TData, TValue>>;
    editorWidth?: number;
    deleteHandler?: (id: IDENTITY) => void;
}

export interface TableOperationProps<TData> {
    table: Table<TData>;
}

export interface CellContextProps<TData, TValue> {
    cellContext: CellContext<TData, TValue>;
}

export interface MyTableMeta<TData, TValue> extends TableMeta<TData> {
    primary: string,
    tableName: string,
    i18n: boolean,
    setData?: React.Dispatch<React.SetStateAction<TData[]>>;
    SearchComponent?: React.ComponentType<TableOperationProps<TData>>;
    OperationComponent?: React.ComponentType<TableOperationProps<TData>>;
    EditComponent?: React.ComponentType<CellContextProps<TData, TValue>>;
    editorWidth: number,
    deleteHandler?: (id: IDENTITY) => void;
    result: Result<PagerResult<TData>>;
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

