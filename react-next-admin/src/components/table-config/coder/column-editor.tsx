"use client";

import * as React from "react";
import {useState} from "react";
import {ColumnConfig, columns} from "@/components/table-config/coder/columns";
import {DataTable} from "@/common/components/table/data-table";
// import CoderApi from "@/api/auto/coder-config";
import {Button} from "@/components/ui/button";
import {CellContextProps, MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import TableUtils from "@/common/lib/table/TableUtils";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import {TableConfig} from "@/components/table-config/columns";
import TableConfigApi from "@/api/auto/table-config";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";


function SaveButton({table}: TableOperationProps<ColumnConfig>) {
    const meta = table.options.meta as MyTableMeta<ColumnConfig>
    const setData = meta.setData;
    const parent = meta.parent as TableConfig;
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const globalTranslate = useTranslations("GlobalForm");

    return (<div><Button onClick={() => {
            const originalData = TableUtils.getOriginalData(table);
            parent.columnConfigs = JSON.stringify(originalData);
            TableConfigApi.save(parent, errorTranslate).then(
                (res) => {
                    toast.success(globalTranslate("save") + globalTranslate("operation-success"));
                }
            ).catch(() => {
            });

        }}>{globalTranslate("save")}</Button></div>
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
    const [data, setData] = useState(columnResult);
    return (
        <div className="h-[calc(100vh-80px)] w-[calc(100vw-80px)] overflow-auto">
            <DataTable<ColumnConfig>
                initHandler={() => {
                }}
                setData={setData}
                tableName={"ColumnConfig"}
                primary={"id"}
                i18n={true}
                result={data}
                columns={columns}
                OperationComponent={SaveButton}
                parent={original}
                defaultPager={{pageIndex: 0, pageSize: -1}}
            ></DataTable>
        </div>
    );
}
