"use client";

import * as React from "react";
import {
    Cell,
    ColumnFiltersState,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import {Table, TableBody, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import DataTableProps, {BasicData, MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {PagerResult} from "@/common/lib/protocol/Result";
import {EmptyRow} from "@/common/components/table/empty-row";
import CellRenderer from "@/common/components/table/cell-render";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import Pager from "@/common/components/table/pager";

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
                                                              defaultPager,
                                                              loadSubRows
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

    const [loadingIds, setLoadingIds] = React.useState<Record<string, boolean>>({});
    // useState 的更新是异步的，闭包里捕获的 loadingIds 会滞后；用 ref 做同步守卫，
    // 在发起请求前立即标记，避免快速重复点击/重入导致同一节点重复加载。
    const loadingIdsRef = React.useRef<Record<string, boolean>>({});

    // 展开状态持久化：key 用数据 id（见下方 getRowId），存 localStorage 以便刷新后恢复
    const expansionKey = `data-table.expanded.${tableName ?? primary ?? "default"}`;
    const [expanded, setExpanded] = React.useState<ExpandedState>(() => {
        if (typeof window === "undefined") return {}; // SSR 阶段无 window，返回空对象
        try {
            const raw = window.localStorage.getItem(expansionKey);
            return raw ? (JSON.parse(raw) as ExpandedState) : {};
        } catch {
            return {};
        }
    });

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.setItem(expansionKey, JSON.stringify(expanded));
        } catch {
            // 存储失败（隐私模式/配额）不阻塞功能
        }
    }, [expanded, expansionKey]);

    const removeExpansionKey = () => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.removeItem(expansionKey);
        } catch {
            // 存储失败（隐私模式/配额）不阻塞功能
        } finally {
            setExpanded({});
        }
    }

    // loadSubRowsInto：把懒加载到的子节点「写进」该节点的 subRows 字段并触发重渲染。
    // 命名里 Into 对应其职责——区别于只返回结果的 loadSubRows，这里会把结果落到行上。
    const loadSubRowsInto = async (row: TData) => {
        const id = String(row.id);
        // 无加载器 / 已在加载 / 已加载过（subRows 已存在）都直接跳过，避免重复请求
        if (!loadSubRows || loadingIdsRef.current[id] || row.subRows !== undefined) {
            return;
        }
        loadingIdsRef.current[id] = true;
        setLoadingIds((prev) => ({...prev, [id]: true}));
        try {
            const children = await loadSubRows(row);
            row.subRows = children; // 就地写入，getSubRows 直接读这里
            const pager = result.data as PagerResult<TData>;
            // 只浅拷贝 list 换掉数组引用（节点对象仍是原引用），让 React/TanStack 感知到变化
            setData({
                ...result,
                data: {...pager, list: [...pager.list]},
            });
        } finally {
            delete loadingIdsRef.current[id];
            setLoadingIds((prev) => {
                const next = {...prev};
                delete next[id];
                return next;
            });
        }
    };

    // 刷新后按持久化的展开 id，自顶向下（BFS）递归懒加载子行，恢复展开视图。
    // restoredRef 保证只在首次拿到数据后执行一次，避免内部 setData 触发 effect 再次进入。
    const restoredRef = React.useRef(false);
    React.useEffect(() => {
        if (restoredRef.current || !loadSubRows) return;
        const list = (result.data as PagerResult<TData>)?.list;
        if (!list || list.length === 0) return;
        restoredRef.current = true;

        const expandedMap: Record<string, boolean> =
            expanded === true ? {} : (expanded ?? {});
        const expandedIds = new Set(
            Object.entries(expandedMap)
                .filter(([, value]) => value)
                .map(([key]) => key)
        );
        if (expandedIds.size === 0) return;

        (async () => {
            let changed = false;
            const queue: TData[] = [...list];
            while (queue.length) {
                const node = queue.shift()!;
                if (!expandedIds.has(String(node.id))) continue;
                if (node.subRows === undefined) { // 已加载过的节点不重复请求
                    try {
                        node.subRows = await loadSubRows(node);
                        changed = true;
                    } catch {
                        continue; // 单节点失败不中断其余节点恢复
                    }
                }
                // 展开节点入队其子节点，继续向下恢复更深层级
                queue.push(...(node.subRows || []));
            }
            if (changed) {
                const pager = result.data as PagerResult<TData>;
                setData({...result, data: {...pager, list: [...list]}});
            }
        })();
    }, [result, expanded, loadSubRows]);

    const table = useReactTable({
        onStateChange(): void {
        },
        renderFallbackValue: undefined,
        data: (result.data as PagerResult<TData>).list,
        enableSubRowSelection: true,
        getSubRows: (row) => row.subRows || [],
        // 树形表用数据 id 作为行 id，展开状态 key 才能稳定并跨刷新持久化；平级表回退默认 index id
        getRowId: loadSubRows ? (row) => String(row.id) : undefined,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: (result.data as PagerResult<TData>).recordTotal,
        onPaginationChange: setPagination,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onExpandedChange: setExpanded,
        getRowCanExpand: (row) => {
            return row.original.hasChildren || row.subRows?.length > 0;
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
            removeExpansionKey: removeExpansionKey,
            loadSubRowsInto: loadSubRowsInto,
            isNodeLoading: (id: string) => !!loadingIds[id],
        } as MyTableMeta<TData>,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
            expanded
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
