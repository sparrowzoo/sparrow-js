"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {columns, ProjectConfig} from "@/components/coder/columns";
import {DataTable} from "@/common/components/table/data-table";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
// import CoderApi from "@/api/auto/coder-config";
import {useTranslations} from "next-intl";
import toast from "react-hot-toast";



export default function Page() {
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");

    const [dataState, setDataState] = useState<ProjectConfig[] | undefined>();
    useEffect(() => {
        // ProjectConfigApi.search({}, errorTranslate).then(
        //     (res) => {
        //         setDataState(res.data)
        //     }
        // ).catch(()=>{});
    }, []);

    if (!dataState) {
        return <ThreeDotLoading/>
    }
    return (
        <div className="w-full">
            <DataTable
                tableName={"ProjectConfig"}
                primary={"id"}
                i18n={true}
                data={dataState.list}
                columns={columns}
                setData={setDataState}
            ></DataTable>
        </div>
    );
}