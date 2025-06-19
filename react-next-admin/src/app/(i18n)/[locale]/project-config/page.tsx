"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {columns} from "@/components/project-config/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/project-config/search";
import Operation from "@/components/project-config/operation";
import EditPage from "@/components/project-config/edit";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import ProjectConfigApi from "@/api/auto/project-config";

const translate = (key: string) => {
    return "zhangsan";
}
export default function Page() {

    const [dataState, setDataState] = useState<any>();

    useEffect(() => {
        ProjectConfigApi.search({}, translate).then(
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
                data={dataState?.list}
                columns={columns}
                filterColumn={true}
                setData={setDataState}
            ></DataTable>
        </div>
    );
}
