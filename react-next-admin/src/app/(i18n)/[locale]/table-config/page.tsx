"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {columns, TableConfig} from "@/components/table-config/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/table-config/search";
import Operation from "@/components/table-config/operation";
import EditPage from "@/components/table-config/edit";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import TableConfigApi from "@/api/auto/table-config";
import {useTranslations} from "next-intl";


export default function Page() {
const  translate=useTranslations("TableConfig.ErrorMessage")
const [dataState, setDataState] = useState<TableConfig[] | undefined>();
    useEffect(() => {
        TableConfigApi.search({}, translate).then(
            (res) => {
                setDataState(res.data)
            }
        )
    }, [])
    if (!dataState) {
        return <ThreeDotLoading/>
    }
    return (
        <div className="w-full">
            <DataTable
                SearchComponent={Search}
                OperationComponent={Operation}
                EditComponent={EditPage}
                primary={"$primary_key"}
                data={dataState.list}
                columns={columns}
                setData={setDataState}
            ></DataTable>
        </div>
    );
}