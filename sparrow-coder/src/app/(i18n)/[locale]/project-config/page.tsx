"use client";

import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {columns, ProjectConfig} from "@/components/project-config/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/project-config/search";
import Operation from "@/components/project-config/operation";
import EditPage from "@/components/project-config/edit";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import ProjectConfigApi from "@/api/auto/project-config";
import {useTranslations} from "next-intl";
import toast from "react-hot-toast";
import Result from "@/common/lib/protocol/Result";
import useNavigating from "@/common/hook/NavigatingHook";
import TableConfigs from "@/components/project-config/operations/table-configs";
import ClearScaffold from "@/components/project-config/operations/clear";
import InitScaffold from "@/components/project-config/operations/init";
import DownloadScaffold from "@/components/project-config/operations/download";


const pagination = {pageIndex: 0, pageSize: 10};

export default function Page() {
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");
    const [dataState, setDataState] = useState<Result | undefined>();
    const Navigations = useNavigating();
    const redirectToLoginRef = useRef(Navigations.redirectToLogin);
    const init = useCallback(() => {
        ProjectConfigApi.search({...pagination}, errorTranslate, redirectToLoginRef.current).then(
            (res) => {
                setDataState(res)
            }
        ).catch(() => {
        });
    }, [errorTranslate]);
    useEffect(() => {
        init();
    }, [init]);


    const deleteHandler = (id: number) => {
        ProjectConfigApi.delete(id, errorTranslate, Navigations.redirectToLogin).then(() => {
            toast.success(globalTranslate("delete") + globalTranslate("operation-success"));
        }).catch(() => {
        });
    }

    if (!dataState) {
        return (
            <div className="admin-page admin-data-page space-y-3">
                <div className="flex min-h-72 items-center justify-center rounded-xl border bg-card">
                    <ThreeDotLoading/>
                </div>
            </div>
        );
    }
    return (
        <div className="admin-page admin-data-page space-y-3">
            <div className="admin-table-panel min-w-0">
                <DataTable<ProjectConfig>
                    SearchComponent={Search}
                    OperationComponent={Operation}
                    tableName={"ProjectConfig"}
                    primary={"id"}
                    i18n={true}
                    result={dataState}
                    columns={columns}
                    setData={setDataState}
                    EditComponent={EditPage}
                    deleteHandler={deleteHandler}
                    initHandler={init}
                    defaultPager={{pageIndex: 0, pageSize: -1}}
                    RowOperationComponents={[TableConfigs, ClearScaffold, InitScaffold, DownloadScaffold]}
                ></DataTable>
            </div>
        </div>
    );
}
