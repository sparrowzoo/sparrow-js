"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {columns, ProjectConfig} from "@/components/project-config/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/project-config/search";
import Operation from "@/components/project-config/operation";
import EditPage from "@/components/project-config/edit";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import ProjectConfigApi from "@/api/auto/project-config";
import {useTranslations} from "next-intl";


export default function Page() {
    const translate = useTranslations("ProjectConfig.ErrorMessage")
    const [dataState, setDataState] = useState<ProjectConfig[] | undefined>();
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
                primary={"id"}
                data={dataState.list}
                columns={columns}
                setData={setDataState}
            ></DataTable>
        </div>
    );
}