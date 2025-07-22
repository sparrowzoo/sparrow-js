"use client";

import * as React from "react";
import {ColumnConfig, columns} from "@/components/table-config/coder/columns";
import {DataTable} from "@/common/components/table/data-table";
// import CoderApi from "@/api/auto/coder-config";
import {Button} from "@/components/ui/button";
import {CellContextProps, MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import TableUtils from "@/common/lib/table/TableUtils";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import {TableConfig} from "@/components/table-config/columns";


function SaveButton({table}: TableOperationProps<ColumnConfig>) {
    const meta = table.options.meta as MyTableMeta<ColumnConfig>
    const setData = meta.setData;
    return (<div className={"border-1 border-red-700"}><Button onClick={() => {
            const originalData = TableUtils.getOriginalData(table);
            console.log(JSON.stringify(originalData));
        }}>保存</Button>
            <Button onClick={() => {
                const originalData = TableUtils.getOriginalData(table);
                //setData(originalData.sort((a, b) => a.sort - b.sort));
            }}>sort</Button></div>
    )
}

export default function ColumnEditor({cellContext}: CellContextProps<TableConfig>) {
    const meta = cellContext.table.options.meta as MyTableMeta<ColumnConfig>;
    const result = meta.result;
    const original = cellContext.row.original;
    let dataState = JSON.parse(original.columnConfigs) as ColumnConfig[];
    const filteringIds = ['check-box', 'actions', 'filter', 'createUserName', 'createUserId', 'modifiedUserId', 'modifiedUserName', 'gmtCreate', 'gmtModified', 'deleted', 'status'];
    dataState = dataState.filter((item) => {
        return filteringIds.indexOf(item.propertyName) < 0
    })
    const pagerResult: PagerResult<ColumnConfig> = {
        list: dataState,
        recordTotal: dataState.length,
        dictionary: result.data.dictionary
    };
    const columnResult = {
        code: "0",
        data: pagerResult
    } as Result<PagerResult<ColumnConfig>>;
    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
            <DataTable<ColumnConfig>
                initHandler={() => {
                }}
                setData={(data) => {
                }}
                tableName={"ColumnConfig"}
                primary={"id"}
                i18n={true}
                result={columnResult}
                columns={columns}
                OperationComponent={SaveButton}
                paginationParam={{pageIndex: 0, pageSize: columnResult.data.list.length}}
            ></DataTable>
        </div>
    );
}
