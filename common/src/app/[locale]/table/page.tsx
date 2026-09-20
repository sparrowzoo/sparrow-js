"use client";

import * as React from "react";
import {useCallback, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Link} from "@/common/i18n/navigation";
import {
    ArrowLeft,
    ChevronsLeftRight,
    Copy,
    Inbox,
    ListTree,
    Plus,
    RotateCcw,
    Search,
    Table2,
    Trash2,
} from "lucide-react";
import {ColumnDef, filterFns} from "@tanstack/react-table";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import toast, {Toaster} from "react-hot-toast";

import {DataTable} from "@/common/components/table/data-table";
import CheckBoxCell from "@/common/components/table/cell/check-box";
import NormalCell from "@/common/components/table/cell/normal";
import CurrencyCell from "@/common/components/table/cell/currency";
import InputCell from "@/common/components/table/cell/input-cell";
import SelectCell from "@/common/components/table/cell/select-cell";
import SortableCell from "@/common/components/table/cell/sortable";
import UnixTimestampCell from "@/common/components/table/cell/unix-timestamp";
import TreeCell from "@/common/components/table/cell/tree";
import CheckboxHeader from "@/common/components/table/header/check-box";
import NormalHeader from "@/common/components/table/header/normal";
import PlainTextHeader from "@/common/components/table/header/plain-text";
import ColumnFilter from "@/common/components/table/header/column-filter";
import EmptyHeader from "@/common/components/table/header/empty";
import {EmptyRow} from "@/common/components/table/empty-row";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/common/components/table/pagination";
import {
    BasicData,
    CellContextProps,
    ColumnOperationProps,
    MyTableMeta,
    TableOperationProps,
} from "@/common/lib/table/DataTableProperty";
import Result from "@/common/lib/protocol/Result";
import {IDENTITY} from "@/common/lib/protocol/Identity";
import TableUtils from "@/common/lib/table/TableUtils";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {DialogClose, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";

/* ------------------------------------------------------------------ */
/* 数据模型 & 字典                                                     */
/* ------------------------------------------------------------------ */

interface DemoRow extends BasicData<DemoRow> {
    id: number;
    name: string;
    email: string;
    status: string;
    gender: string;
    amount: number;
    currency: string;
    age: number;
    active: boolean;
    remark: string;
    sort: number;
    gmtCreate: number;
    gmtModified: number;
}

const TS = 1700000000000;

function createInitialRows(): DemoRow[] {
    return [
        {id: 1, name: "Alice", email: "alice@example.com", status: "ENABLE", gender: "FEMALE", amount: 1280.5, currency: "USD", age: 28, active: true, remark: "Senior engineer", sort: 1, gmtCreate: TS, gmtModified: TS + 1000},
        {id: 2, name: "Bob", email: "bob@example.com", status: "ENABLE", gender: "MALE", amount: 640, currency: "EUR", age: 35, active: true, remark: "Product manager", sort: 2, gmtCreate: TS + 2000, gmtModified: TS + 3000},
        {id: 3, name: "Carol", email: "carol@example.com", status: "DISABLE", gender: "FEMALE", amount: 3200, currency: "USD", age: 42, active: false, remark: "Designer", sort: 3, gmtCreate: TS + 4000, gmtModified: TS + 5000},
        {id: 4, name: "David", email: "david@example.com", status: "ENABLE", gender: "MALE", amount: 900, currency: "CNY", age: 31, active: true, remark: "QA", sort: 4, gmtCreate: TS + 6000, gmtModified: TS + 7000},
        {id: 5, name: "Eve", email: "eve@example.com", status: "DISABLE", gender: "FEMALE", amount: 1560, currency: "JPY", age: 26, active: true, remark: "Ops", sort: 5, gmtCreate: TS + 8000, gmtModified: TS + 9000},
        {id: 6, name: "Frank", email: "frank@example.com", status: "ENABLE", gender: "MALE", amount: 2200, currency: "USD", age: 45, active: false, remark: "Architect", sort: 6, gmtCreate: TS + 10000, gmtModified: TS + 11000},
        {id: 7, name: "Grace", email: "grace@example.com", status: "ENABLE", gender: "FEMALE", amount: 780, currency: "EUR", age: 24, active: true, remark: "Intern", sort: 7, gmtCreate: TS + 12000, gmtModified: TS + 13000},
        {id: 8, name: "Henry", email: "henry@example.com", status: "DISABLE", gender: "MALE", amount: 4100, currency: "USD", age: 38, active: true, remark: "Tech lead", sort: 8, gmtCreate: TS + 14000, gmtModified: TS + 15000},
        {id: 9, name: "Ivy", email: "ivy@example.com", status: "ENABLE", gender: "FEMALE", amount: 1250, currency: "CNY", age: 29, active: true, remark: "Data analyst", sort: 9, gmtCreate: TS + 16000, gmtModified: TS + 17000},
        {id: 10, name: "Jack", email: "jack@example.com", status: "ENABLE", gender: "MALE", amount: 980, currency: "JPY", age: 33, active: false, remark: "Support", sort: 10, gmtCreate: TS + 18000, gmtModified: TS + 19000},
        {id: 11, name: "Kate", email: "kate@example.com", status: "DISABLE", gender: "FEMALE", amount: 2750, currency: "EUR", age: 40, active: true, remark: "Finance", sort: 11, gmtCreate: TS + 20000, gmtModified: TS + 21000},
        {id: 12, name: "Leo", email: "leo@example.com", status: "ENABLE", gender: "MALE", amount: 1350, currency: "USD", age: 27, active: true, remark: "Mobile dev", sort: 12, gmtCreate: TS + 22000, gmtModified: TS + 23000},
    ];
}

const DICTIONARY = {
    status: [
        {key: "ENABLE", value: "ENABLE"},
        {key: "DISABLE", value: "DISABLE"},
    ],
    gender: [
        {key: "MALE", value: "MALE"},
        {key: "FEMALE", value: "FEMALE"},
    ],
};

const PAGE_SIZE = 5;

function buildResult(rows: DemoRow[], pageIndex: number, pageSize: number): Result {
    const start = pageIndex * pageSize;
    return {
        code: "0",
        data: {
            list: rows.slice(start, start + pageSize),
            recordTotal: rows.length,
            dictionary: DICTIONARY,
        },
    };
}

/* ------------------------------------------------------------------ */
/* 列定义                                                              */
/* ------------------------------------------------------------------ */

const mainColumns: ColumnDef<DemoRow>[] = [
    {id: "select", header: CheckboxHeader, cell: CheckBoxCell, enableHiding: false},
    {accessorKey: "id", header: PlainTextHeader({columnTitle: "ID"} as ColumnOperationProps), cell: NormalCell("id"), enableHiding: true},
    {accessorKey: "name", header: NormalHeader({showSort: true, showFilter: true, columnTitle: "Name"} as ColumnOperationProps), filterFn: filterFns.includesString, cell: NormalCell("name"), enableHiding: true},
    {accessorKey: "email", header: PlainTextHeader({columnTitle: "Email"} as ColumnOperationProps), cell: NormalCell("email"), enableHiding: true},
    {accessorKey: "status", header: NormalHeader({showSort: true, showFilter: true, columnTitle: "Status"} as ColumnOperationProps), filterFn: filterFns.includesString, cell: NormalCell("status"), enableHiding: true},
    {accessorKey: "gender", header: PlainTextHeader({columnTitle: "Gender"} as ColumnOperationProps), cell: SelectCell("gender", true), enableHiding: true},
    {accessorKey: "amount", header: NormalHeader({columnTitle: "Amount", showSort: true} as ColumnOperationProps), cell: CurrencyCell("amount", "currency"), enableHiding: true},
    {accessorKey: "currency", header: PlainTextHeader({columnTitle: "Currency"} as ColumnOperationProps), cell: NormalCell("currency"), enableHiding: true},
    {accessorKey: "age", header: PlainTextHeader({columnTitle: "Age"} as ColumnOperationProps), cell: NormalCell("age"), enableHiding: true},
    {accessorKey: "active", header: PlainTextHeader({columnTitle: "Active"} as ColumnOperationProps), cell: InputCell("active", "checkbox"), enableHiding: true},
    {accessorKey: "remark", header: PlainTextHeader({columnTitle: "Remark"} as ColumnOperationProps), cell: InputCell("remark", "text"), enableHiding: true},
    {accessorKey: "sort", header: PlainTextHeader({columnTitle: "Sort"} as ColumnOperationProps), cell: SortableCell("sort"), enableHiding: false},
    {accessorKey: "gmtCreate", header: PlainTextHeader({columnTitle: "Created"} as ColumnOperationProps), cell: UnixTimestampCell("gmtCreate"), enableHiding: true},
    {id: "actions", header: PlainTextHeader({columnTitle: "Actions"} as ColumnOperationProps), cell: "Actions", enableHiding: false},
    {id: "filter-column", header: ColumnFilter(), cell: "", enableHiding: false},
];

const treeRows: DemoRow[] = [
    {
        id: 100, name: "Engineering", email: "eng@example.com", status: "ENABLE", gender: "MALE",
        amount: 5000, currency: "USD", age: 0, active: true, remark: "", sort: 1, gmtCreate: TS, gmtModified: TS,
        subRows: [
            {id: 101, name: "Frontend", email: "fe@example.com", status: "ENABLE", gender: "MALE", amount: 2000, currency: "USD", age: 0, active: true, remark: "", sort: 1, gmtCreate: TS, gmtModified: TS},
            {id: 102, name: "Backend", email: "be@example.com", status: "DISABLE", gender: "FEMALE", amount: 3000, currency: "USD", age: 0, active: true, remark: "", sort: 2, gmtCreate: TS, gmtModified: TS},
        ],
    },
    {
        id: 200, name: "Marketing", email: "mkt@example.com", status: "ENABLE", gender: "FEMALE",
        amount: 1500, currency: "EUR", age: 0, active: true, remark: "", sort: 2, gmtCreate: TS, gmtModified: TS,
        subRows: [
            {id: 201, name: "Growth", email: "growth@example.com", status: "ENABLE", gender: "FEMALE", amount: 800, currency: "EUR", age: 0, active: true, remark: "", sort: 1, gmtCreate: TS, gmtModified: TS},
            {id: 202, name: "Brand", email: "brand@example.com", status: "ENABLE", gender: "MALE", amount: 700, currency: "EUR", age: 0, active: true, remark: "", sort: 2, gmtCreate: TS, gmtModified: TS},
        ],
    },
];

const treeColumns: ColumnDef<DemoRow>[] = [
    {id: "expander", enableHiding: false, header: EmptyHeader, cell: TreeCell("name")},
    {id: "select", header: CheckboxHeader, cell: CheckBoxCell, enableHiding: false},
    {accessorKey: "name", header: PlainTextHeader({columnTitle: "Name"} as ColumnOperationProps), cell: NormalCell("name"), enableHiding: true},
    {accessorKey: "email", header: PlainTextHeader({columnTitle: "Email"} as ColumnOperationProps), cell: NormalCell("email"), enableHiding: true},
    {accessorKey: "amount", header: NormalHeader({columnTitle: "Amount", showSort: true} as ColumnOperationProps), cell: CurrencyCell("amount", "currency"), enableHiding: true},
    {accessorKey: "status", header: PlainTextHeader({columnTitle: "Status"} as ColumnOperationProps), cell: NormalCell("status"), enableHiding: true},
    {id: "filter-column", header: ColumnFilter(), cell: "", enableHiding: false},
];

/* ------------------------------------------------------------------ */
/* 控制器 & 子组件                                                     */
/* ------------------------------------------------------------------ */

interface DemoController {
    searchHandler: (page?: PaginationState) => void;
    filterHandler: (keyword: string, status: string) => void;
    addHandler: () => void;
    clearHandler: () => void;
    resetHandler: () => void;
    batchDeleteHandler: (ids: IDENTITY[]) => void;
    copyHandler: (id: IDENTITY) => void;
}

function DemoSearch({table}: TableOperationProps<DemoRow>) {
    const meta = table.options.meta as MyTableMeta<DemoRow>;
    const controller = meta.parent as unknown as DemoController;
    meta.searchHandler = controller.searchHandler;

    const t = useTranslations("TableExample");
    const kvs = useTranslations("KVS");
    const gt = useTranslations("GlobalForm");
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("-1");

    return (
        <div className="flex flex-wrap items-center gap-3">
            <Input
                className="w-60"
                placeholder={t("search-name-placeholder")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder={t("status")}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="-1">{gt("all")}</SelectItem>
                    <SelectItem value="ENABLE">{kvs("status.ENABLE")}</SelectItem>
                    <SelectItem value="DISABLE">{kvs("status.DISABLE")}</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => controller.filterHandler(keyword, status)}>
                <Search className="h-4 w-4"/>
                {gt("search")}
            </Button>
        </div>
    );
}

function DemoOperation({table}: TableOperationProps<DemoRow>) {
    const meta = table.options.meta as MyTableMeta<DemoRow>;
    const controller = meta.parent as unknown as DemoController;
    const t = useTranslations("TableExample");
    const gt = useTranslations("GlobalForm");

    return (
        <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={controller.addHandler}>
                <Plus className="h-4 w-4"/>
                {gt("add")}
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => {
                    const ids = TableUtils.getSelectedIds(table);
                    if (ids.length === 0) {
                        toast.error(gt("no-record-checked"));
                        return;
                    }
                    controller.batchDeleteHandler(ids);
                    toast.success(gt("delete") + gt("operation-success"));
                }}
            >
                <Trash2 className="h-4 w-4"/>
                {gt("delete")}
            </Button>
            <Button size="sm" variant="outline" onClick={controller.clearHandler}>
                <Inbox className="h-4 w-4"/>
                {t("clear-all")}
            </Button>
            <Button size="sm" variant="outline" onClick={controller.resetHandler}>
                <RotateCcw className="h-4 w-4"/>
                {t("reset")}
            </Button>
        </div>
    );
}

function DemoEdit({cellContext, callbackHandler}: CellContextProps<DemoRow>) {
    const t = useTranslations("TableExample");
    const gt = useTranslations("GlobalForm");
    const original = cellContext.row.original;
    const [name, setName] = useState(original.name);
    const [email, setEmail] = useState(original.email);

    return (
        <div className="flex w-[400px] flex-col gap-4 p-4">
            <DialogHeader>
                <DialogTitle>{gt("edit")}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm">
                    {t("name")}
                    <Input value={name} onChange={(e) => setName(e.target.value)}/>
                </label>
                <label className="flex flex-col gap-1 text-sm">
                    {t("email")}
                    <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
                </label>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">{gt("cancel")}</Button>
                </DialogClose>
                <Button
                    onClick={() => {
                        original.name = name;
                        original.email = email;
                        callbackHandler?.();
                    }}
                >
                    {gt("save")}
                </Button>
            </DialogFooter>
        </div>
    );
}

function CopyRowOperation({cellContext}: CellContextProps<DemoRow>) {
    const t = useTranslations("TableExample");
    const meta = cellContext.table.options.meta as MyTableMeta<DemoRow>;
    const controller = meta.parent as unknown as DemoController;
    return (
        <Button
            variant="ghost"
            className="h-8 w-full justify-start px-2"
            onClick={(e) => {
                e.stopPropagation();
                controller.copyHandler(cellContext.row.original.id);
            }}
        >
            <Copy className="h-4 w-4"/>
            {t("copy")}
        </Button>
    );
}

function TreeSearch({table}: TableOperationProps<DemoRow>) {
    const meta = table.options.meta as MyTableMeta<DemoRow>;
    // 树形示例为单页静态数据，仅需挂载 searchHandler 让 Pager 可正常工作
    meta.searchHandler = () => {
    };
    return null;
}

function StandalonePaginationDemo() {
    const [page, setPage] = useState(1);
    const total = 8;
    const go = (p: number) => setPage(Math.min(Math.max(1, p), total));
    const pages = [1, 2, 3, 4, 5];
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationFirst href="#" onClick={(e) => {e.preventDefault(); go(1);}}/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); go(page - 1);}}/>
                </PaginationItem>
                {pages.map((p) => (
                    <PaginationItem key={p}>
                        <PaginationLink href="#" isActive={p === page} onClick={(e) => {e.preventDefault(); go(p);}}>
                            {p}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationEllipsis/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => {e.preventDefault(); go(page + 1);}}/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLast href="#" onClick={(e) => {e.preventDefault(); go(total);}}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

/* ------------------------------------------------------------------ */
/* 文档                                                                */
/* ------------------------------------------------------------------ */

const docZh = `# 表格组件（components/table）使用说明

## 概述

\`src/common/components/table/\` 基于 **@tanstack/react-table** + **shadcn/ui** 封装了一套通用表格体系，核心是 \`DataTable\`，配合表头（\`header/\`）、单元格（\`cell/\`）、分页（\`pagination\`/\`pager\`）等子组件。

\`DataTable\` 通过 \`useReactTable\` 开启：排序、过滤、列显隐、行选择、展开（树形）、**手动分页**（\`manualPagination: true\`，数据需由外部按页切好，\`recordTotal\` 表示总数）。

## DataTable —— 核心表格

\`\`\`tsx
import {DataTable} from "@/common/components/table/data-table";

<DataTable<T>
  columns={columns}
  result={result}
  setData={setResult}
  tableName="UserExample"
  primary="id"
  i18n={true}
  initHandler={init}
  deleteHandler={deleteHandler}
  EditComponent={EditPage}
  RowOperationComponents={[]}
  SearchComponent={Search}
  OperationComponent={Operation}
  defaultPager={{pageIndex: 0, pageSize: 10}}
/>
\`\`\`

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| columns | \`ColumnDef<T,string>[]\` | 是 | 列定义 |
| result | \`Result\` | 是 | 数据源；\`result.data = { list, recordTotal, dictionary }\` |
| setData | \`Dispatch<SetStateAction<Result>>\` | 是 | 更新 \`result\` 的 setState |
| initHandler | \`() => void\` | 是 | 重新加载（重置到第一页），行编辑/删除后回调 |
| primary | string | 否 | 主键字段名（\`deleteHandler\` 取 \`original[primary]\`） |
| tableName | string | 否 | i18n 命名空间，表头用 \`useTranslations(tableName)\` 翻译 |
| i18n | boolean | 否 | 是否翻译表头（\`t.has(column.id)\`）与单元格字典（\`KVS.<field>.<value>\`） |
| hiddenColumns | \`VisibilityState\` | 否 | 初始隐藏列 |
| SearchComponent | \`ComponentType<TableOperationProps>\` | 否 | 搜索栏，需设置 \`meta.searchHandler\` |
| OperationComponent | \`ComponentType<TableOperationProps>\` | 否 | 工具栏（批量操作） |
| EditComponent | \`ComponentType<CellContextProps>\` | 否 | 行编辑弹窗内容（由 \`PopItem\` 包裹在 Dialog 中） |
| deleteHandler | \`(id) => void\` | 否 | 行删除回调 |
| RowOperationComponents | \`ComponentType<CellContextProps>[]\` | 否 | 操作菜单中追加的自定义行操作 |
| parent | \`{}\` | 否 | 透传自定义上下文（示例用 \`parent\` 传递控制器） |
| defaultPager | \`PaginationState\` | 否 | 默认分页 |

> 注意：因为 \`manualPagination\` 为 true，\`result.data.list\` 必须是**当前页**的数据；排序/过滤仍为客户端行为，只作用于当前页。

## 单元格（cell/）

单元格工厂均返回一个「渲染函数组件」，直接赋给列的 \`cell\`。

- **NormalCell(field, width?, handler?)** —— 普通文本；若 \`result.data.dictionary[field]\` 存在则按字典映射，\`i18n\` 时用 \`KVS.<field>.<value>\` 翻译。
- **CheckBoxCell** —— 行选择框，配合 \`CheckboxHeader\`；通过 \`TableUtils.getSelectedIds(table)\` 取已选主键。
- **CurrencyCell(field, currencyField)** —— 用 \`Intl.NumberFormat\` 按币种字段格式化金额。
- **InputCell(field, type, width?)** —— 行内编辑；\`type="checkbox"\` 渲染勾选框，其余渲染 \`<Input type=...>\`，改动直接写回 \`row.original[field]\`。
- **SelectCell(field, i18n?, readOnly?)** —— 行内下拉框，字典取自 \`result.data.dictionary[field]\`；\`readOnly\` 时仅显示文本。
- **SortableCell(field)** —— 数字输入框，\`onBlur\` 时按 \`sort\` 对**当前页**重新排序并 \`setData\`。
- **UnixTimestampCell(field, category?)** —— 用 \`dayjs\` 格式化为 \`YYYY-MM-DD HH:mm:ss\`。
- **TreeCell(field)** —— 树形展开按钮 + 缩进，展示 \`field\` 值；数据需提供 \`subRows\`。
- **OperationCell**（内部）—— 当列的 \`cell\` 为字符串 \`"Actions"\` 时由 \`CellRenderer\` 触发：编辑（\`EditComponent\` 弹窗）、删除（\`deleteHandler\`）、自定义行操作（\`RowOperationComponents\`）。

## 表头（header/）

- **PlainTextHeader({columnTitle})** —— 纯文本表头；\`i18n\` 时用 \`t(column.id)\` 覆盖。
- **NormalHeader({showFilter, showSort, columnTitle})** —— 内含 \`ColumnOperation\`，可加排序按钮与过滤输入框。
- **CheckboxHeader** —— 全选/半选（\`indeterminate\`）。
- **ColumnFilter()** —— 列显隐下拉框，列出 \`getCanHide()\` 为 true 的列。
- **EmptyHeader** —— 空白表头（常用于树形展开列）。

## 其它

- **ColumnOperation({columnTitle, showFilter, showSort, column})** —— 表头内的排序/过滤操作组合。
- **Pager({table})** —— 分页条，配合 \`DataTable\` 使用，翻页时调用 \`meta.searchHandler\`。
- **Pagination 系列** —— 可独立使用的分页原子组件（\`Pagination\`/\`PaginationContent\`/\`PaginationItem\`/\`PaginationLink\`/\`PaginationPrevious\`/\`PaginationNext\`/\`PaginationFirst\`/\`PaginationLast\`/\`PaginationEllipsis\`）。
- **EmptyRow({columnSize})** —— 无数据占位行，由 \`DataTable\` 在无行时自动渲染。
- **CellRenderer** —— 单元格分发器（内部），判断 \`cell === "Actions"\` 走操作单元格，否则 \`flexRender\`。
`;

const docEn = `# Table Components (components/table) Usage Guide

## Overview

\`src/common/components/table/\` is a table system built on **@tanstack/react-table** + **shadcn/ui**. The core is \`DataTable\`, working with headers (\`header/\`), cells (\`cell/\`) and pagination (\`pagination\`/\`pager\`).

\`DataTable\` enables via \`useReactTable\`: sorting, filtering, column visibility, row selection, expanding (tree) and **manual pagination** (\`manualPagination: true\` — you slice the page yourself, \`recordTotal\` is the total count).

## DataTable — the core table

\`\`\`tsx
import {DataTable} from "@/common/components/table/data-table";

<DataTable<T>
  columns={columns}
  result={result}
  setData={setResult}
  tableName="UserExample"
  primary="id"
  i18n={true}
  initHandler={init}
  deleteHandler={deleteHandler}
  EditComponent={EditPage}
  RowOperationComponents={[]}
  SearchComponent={Search}
  OperationComponent={Operation}
  defaultPager={{pageIndex: 0, pageSize: 10}}
/>
\`\`\`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| columns | \`ColumnDef<T,string>[]\` | Yes | Column definitions |
| result | \`Result\` | Yes | Data source; \`result.data = { list, recordTotal, dictionary }\` |
| setData | \`Dispatch<SetStateAction<Result>>\` | Yes | setState used to update \`result\` |
| initHandler | \`() => void\` | Yes | Reload (reset to page 1); called after row edit/delete |
| primary | string | No | Primary-key field name (used by \`deleteHandler\`) |
| tableName | string | No | i18n namespace; headers translate via \`useTranslations(tableName)\` |
| i18n | boolean | No | Translate headers (\`t.has(column.id)\`) and cell dictionaries (\`KVS.<field>.<value>\`) |
| hiddenColumns | \`VisibilityState\` | No | Initially hidden columns |
| SearchComponent | \`ComponentType<TableOperationProps>\` | No | Search bar; must assign \`meta.searchHandler\` |
| OperationComponent | \`ComponentType<TableOperationProps>\` | No | Toolbar (batch actions) |
| EditComponent | \`ComponentType<CellContextProps>\` | No | Row edit dialog content (wrapped in a Dialog by \`PopItem\`) |
| deleteHandler | \`(id) => void\` | No | Row delete callback |
| RowOperationComponents | \`ComponentType<CellContextProps>[]\` | No | Extra custom row actions in the action menu |
| parent | \`{}\` | No | Arbitrary context (the demo passes a controller via \`parent\`) |
| defaultPager | \`PaginationState\` | No | Default pagination |

> Because \`manualPagination\` is true, \`result.data.list\` must already be the **current page**; sorting/filtering stay client-side over the current page.

## Cells (cell/)

Each cell factory returns a render component that you assign to a column's \`cell\`.

- **NormalCell(field, width?, handler?)** — plain text; maps through \`result.data.dictionary[field]\` and translates via \`KVS.<field>.<value>\` when i18n is on.
- **CheckBoxCell** — row selection; pair with \`CheckboxHeader\`; get selected ids via \`TableUtils.getSelectedIds(table)\`.
- **CurrencyCell(field, currencyField)** — formats the amount with \`Intl.NumberFormat\` using the currency field.
- **InputCell(field, type, width?)** — inline edit; \`type="checkbox"\` renders a checkbox, otherwise an \`<Input>\`; writes back to \`row.original[field]\`.
- **SelectCell(field, i18n?, readOnly?)** — inline select from \`result.data.dictionary[field]\`; \`readOnly\` renders text only.
- **SortableCell(field)** — number input; on blur it re-sorts the **current page** by \`sort\` and calls \`setData\`.
- **UnixTimestampCell(field, category?)** — formats via \`dayjs\` to \`YYYY-MM-DD HH:mm:ss\`.
- **TreeCell(field)** — expand/collapse button + indent, showing \`field\`; data must provide \`subRows\`.
- **OperationCell** (internal) — triggered when a column's \`cell\` is the string \`"Actions"\`: edit (\`EditComponent\` dialog), delete (\`deleteHandler\`), custom row actions (\`RowOperationComponents\`).

## Headers (header/)

- **PlainTextHeader({columnTitle})** — plain text header; \`i18n\` overrides with \`t(column.id)\`.
- **NormalHeader({showFilter, showSort, columnTitle})** — wraps \`ColumnOperation\` to add sort + filter.
- **CheckboxHeader** — select-all / indeterminate.
- **ColumnFilter()** — column visibility dropdown listing columns where \`getCanHide()\` is true.
- **EmptyHeader** — blank header (used for the tree expander column).

## Others

- **ColumnOperation({columnTitle, showFilter, showSort, column})** — sort/filter controls inside a header.
- **Pager({table})** — pagination bar for \`DataTable\`; calls \`meta.searchHandler\` on page change.
- **Pagination family** — standalone pagination atoms (\`Pagination\`/\`PaginationContent\`/\`PaginationItem\`/\`PaginationLink\`/\`PaginationPrevious\`/\`PaginationNext\`/\`PaginationFirst\`/\`PaginationLast\`/\`PaginationEllipsis\`).
- **EmptyRow({columnSize})** — no-data placeholder, rendered automatically by \`DataTable\`.
- **CellRenderer** — cell dispatcher (internal); routes \`cell === "Actions"\` to \`OperationCell\`, otherwise \`flexRender\`.
`;

/* ------------------------------------------------------------------ */
/* 页面                                                                */
/* ------------------------------------------------------------------ */

export default function TableExamplePage() {
    const t = useTranslations("TableExample");
    const locale = useLocale();
    const doc = locale === "zh" ? docZh : docEn;

    const masterRef = useRef<DemoRow[]>(createInitialRows());
    const viewRef = useRef<DemoRow[]>(createInitialRows());
    const [result, setResult] = useState<Result>(() => buildResult(viewRef.current, 0, PAGE_SIZE));

    const refresh = useCallback((page?: PaginationState) => {
        setResult(buildResult(viewRef.current, page?.pageIndex ?? 0, page?.pageSize ?? PAGE_SIZE));
    }, []);

    const controller: DemoController = {
        searchHandler: refresh,
        filterHandler: (keyword, status) => {
            const kw = keyword.trim().toLowerCase();
            viewRef.current = masterRef.current.filter((r) => {
                const matchKw = !kw || r.name.toLowerCase().includes(kw) || r.email.toLowerCase().includes(kw);
                const matchStatus = status === "-1" || r.status === status;
                return matchKw && matchStatus;
            });
            refresh();
        },
        addHandler: () => {
            const rows = masterRef.current;
            const maxId = rows.reduce((m, r) => Math.max(m, Number(r.id)), 0);
            const now = Date.now();
            rows.push({
                id: maxId + 1,
                name: `User ${maxId + 1}`,
                email: `user${maxId + 1}@example.com`,
                status: "ENABLE",
                gender: "MALE",
                amount: 0,
                currency: "USD",
                age: 20,
                active: true,
                remark: "New",
                sort: rows.length + 1,
                gmtCreate: now,
                gmtModified: now,
            });
            viewRef.current = [...masterRef.current];
            refresh();
        },
        clearHandler: () => {
            viewRef.current = [];
            refresh();
        },
        resetHandler: () => {
            viewRef.current = [...masterRef.current];
            refresh();
        },
        batchDeleteHandler: (ids) => {
            masterRef.current = masterRef.current.filter((r) => !ids.includes(r.id));
            viewRef.current = [...masterRef.current];
            refresh();
        },
        copyHandler: (id) => {
            const rows = masterRef.current;
            const idx = rows.findIndex((r) => r.id === id);
            if (idx >= 0) {
                const maxId = rows.reduce((m, r) => Math.max(m, Number(r.id)), 0);
                rows.push({...rows[idx], id: maxId + 1, name: rows[idx].name + " (copy)", sort: rows.length + 1});
                viewRef.current = [...masterRef.current];
                refresh();
            }
        },
    };

    const initHandler = useCallback(() => refresh(), [refresh]);
    const deleteHandler = useCallback((id: IDENTITY) => {
        masterRef.current = masterRef.current.filter((r) => r.id !== id);
        viewRef.current = [...masterRef.current];
        refresh();
    }, [refresh]);

    const [treeResult] = useState<Result>(() => ({
        code: "0",
        data: {list: treeRows, recordTotal: treeRows.length, dictionary: DICTIONARY},
    }));

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <Toaster position="top-center"/>
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="absolute -top-40 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/15 via-cyan-400/15 to-fuchsia-500/15 blur-[120px]"/>
            </div>

            <main className="mx-auto max-w-5xl px-6 py-16">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <ArrowLeft className="h-4 w-4"/>
                    {t("back")}
                </Link>

                <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
                <p className="mt-3 text-muted-foreground">{t("desc")}</p>

                {/* 综合 DataTable */}
                <section className="mt-10 rounded-2xl border border-border bg-card p-6">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <Table2 className="h-5 w-5 text-violet-500"/>
                        {t("main-title")}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("main-desc")}</p>

                    <div className="mt-5">
                        <DataTable<DemoRow>
                            columns={mainColumns}
                            result={result}
                            setData={setResult}
                            tableName="TableExample"
                            primary="id"
                            i18n={true}
                            initHandler={initHandler}
                            deleteHandler={deleteHandler}
                            EditComponent={DemoEdit}
                            RowOperationComponents={[CopyRowOperation]}
                            SearchComponent={DemoSearch}
                            OperationComponent={DemoOperation}
                            parent={controller}
                            defaultPager={{pageIndex: 0, pageSize: PAGE_SIZE}}
                        />
                    </div>
                </section>

                {/* 树形表格 */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <ListTree className="h-5 w-5 text-cyan-500"/>
                        {t("tree-title")}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("tree-desc")}</p>

                    <div className="mt-5">
                        <DataTable<DemoRow>
                            columns={treeColumns}
                            result={treeResult}
                            setData={() => {
                            }}
                            tableName="TableExample"
                            primary="id"
                            i18n={true}
                            initHandler={() => {
                            }}
                            SearchComponent={TreeSearch}
                            defaultPager={{pageIndex: 0, pageSize: 10}}
                        />
                    </div>
                </section>

                {/* 分页基础组件 */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <ChevronsLeftRight className="h-5 w-5 text-fuchsia-500"/>
                        {t("pagination-title")}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("pagination-desc")}</p>

                    <div className="mt-5">
                        <StandalonePaginationDemo/>
                    </div>
                </section>

                {/* 空数据状态 */}
                <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <Inbox className="h-5 w-5 text-cyan-500"/>
                        {t("empty-title")}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("empty-desc")}</p>

                    <div className="mt-5 overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("name")}</TableHead>
                                    <TableHead>{t("email")}</TableHead>
                                    <TableHead>{t("status")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <EmptyRow columnSize={3}/>
                            </TableBody>
                        </Table>
                    </div>
                </section>

                <div className="prose-doc mt-12">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
