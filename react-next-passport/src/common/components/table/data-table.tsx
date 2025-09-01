"use client";

import * as React from "react";
import {
    Cell,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
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
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import Pager from "@/common/components/table/pager";

function PaginationNext(props: { onClick: () => void, href: string }) {
    return null;
}

export function DataTable<TData extends BasicData<TData>>({
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
                                                              initHandler,
                                                              RowOperationComponents,
                                                              parent,
                                                              defaultPager
                                                          }: DataTableProps<TData>) {

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>(hiddenColumns as VisibilityState);
    const [rowSelection, setRowSelection] = React.useState({});

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: defaultPager ? defaultPager.pageIndex : 0,
        pageSize: defaultPager ? defaultPager.pageSize : 10,
    });
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
        manualPagination: true,
        rowCount: result.data.recordTotal,
        onPaginationChange: setPagination,
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
            initHandler: initHandler,
            EditComponent: EditComponent,
            result: result,
            RowOperationComponents: RowOperationComponents,
            parent: parent,
        } as MyTableMeta<TData>,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination
        },
    });
    //会导致排序过滤失效
    // table.getPrePaginationRowModel = () => {
    //     return table.getCoreRowModel();
    // };
    return (
        <div className="w-full">
            {SearchComponent && <SearchComponent table={table}/>}
            <div className="flex items-center h-fit mt-2 mb-2">
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
                                    {row.getVisibleCells().map((cell: Cell<TData, string>) => (
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

            {table.getState().pagination.pageSize > 0 && <Pager table={table}/>}
        </div>
    );
}
