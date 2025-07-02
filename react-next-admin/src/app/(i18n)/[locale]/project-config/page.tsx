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
import toast from "react-hot-toast";



export default function Page() {
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");

    const [dataState, setDataState] = useState<ProjectConfig[] | undefined>();
    useEffect(() => {
        ProjectConfigApi.search({}, errorTranslate).then(
                                              (res) => {
                                                  setDataState(res.data)
                                              }
                                           ).catch(()=>{});

    }, []);


      const deleteHandler= (id: number) => {
            ProjectConfigApi.delete(id, errorTranslate).then(()=>{
                toast.success(globalTranslate("delete")+globalTranslate("operation-success"));
            }).catch(()=>{});
        }

    if (!dataState) {
        return <ThreeDotLoading/>
    }
    return (
        <div className="w-full">
            <DataTable
                SearchComponent={Search}
                OperationComponent={Operation}
                tableName={"ProjectConfig"}
                primary={"id"}
                i18n={true}
                data={dataState.list}
                columns={columns}
                setData={setDataState}
                EditComponent={EditPage}
                deleteHandler={deleteHandler}
            ></DataTable>
        </div>
    );
}