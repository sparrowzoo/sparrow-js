"use client";

import * as React from "react";
import {
    Cell,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    TableState,
    Updater,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {Table, TableBody, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import DataTableProps, {BasicData, MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {EmptyRow} from "@/common/components/table/empty-row";
import CellRenderer from "@/common/components/table/cell-render";

export function DataTable<TData extends BasicData<TData>, TValue>({
                                                                      columns,
                                                                      result,
                                                                      setData,
                                                                      hiddenColumns,
                                                                      primary,
                                                                      tableName,
                                                                      i18n,
                                                                      SearchComponent,
                                                                      OperationComponent,
                                                                      EditComponent,
                                                                      deleteHandler,
                                                                      editorWidth
                                                                  }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>(hiddenColumns as VisibilityState);
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        onStateChange(updater: Updater<TableState>): void {
        },
        renderFallbackValue: undefined,
        data: result.data.list,
        enableSubRowSelection: true,
        getSubRows: (row) => row.subRows || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getRowCanExpand: (row) => {
            return row.subRows?.length > 0;
        },
        getExpandedRowModel: getExpandedRowModel(),
        meta: {
            primary: primary as string,
            tableName: tableName as string,
            i18n: i18n,
            setData: setData,
            deleteHandler: deleteHandler,
            EditComponent: EditComponent,
            editorWidth: editorWidth,
            result: result,
        } as MyTableMeta<TData, TValue>,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                {SearchComponent && <SearchComponent table={table}/>}
            </div>

            <div className="flex items-center py-4">
                {OperationComponent && <OperationComponent table={table}/>}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell: Cell<TData, TValue>) => (
                                        <CellRenderer key={cell.id} cellContext={cell.getContext()}/>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <EmptyRow columnSize={columns.length}/>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
