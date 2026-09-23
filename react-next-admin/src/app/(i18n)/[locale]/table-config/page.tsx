
"use client";

import * as React from "react";
import {Suspense, useCallback, useEffect, useRef, useState} from "react";
import {columns, TableConfig} from "@/components/table-config/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/table-config/search";
import Operation from "@/components/table-config/operation";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import TableConfigApi from "@/api/auto/table-config";
import {useTranslations} from "next-intl";
import toast from "react-hot-toast";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import {useSearchParams} from "next/navigation";
import KeyValue from "@/common/lib/protocol/KeyValue";
import TableEdit from "@/components/table-config/table-edit";
import useNavigating from "@/common/hook/NavigatingHook";
import {FolderCog} from "lucide-react";



const pagination = {pageIndex: 0, pageSize: -1};

export default function Page() {
    return (
        <Suspense fallback={<ThreeDotLoading/>}>
            <TableConfigContent/>
        </Suspense>
    );
}

function TableConfigContent() {
    const pageTranslate = useTranslations("TableConfig");
    const errorTranslate = useTranslations("TableConfig.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");
    const [dataState, setDataState] = useState<Result | undefined>();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    const  Navigations=useNavigating();
    const redirectToLoginRef = useRef(Navigations.redirectToLogin);

    const init = useCallback(() => {
        TableConfigApi.search({...pagination}, errorTranslate, redirectToLoginRef.current).then(
            (res) => {
                setDataState(res)
            }
        ).catch(() => {
        });
    }, [errorTranslate]);
    useEffect(() => {
        if (projectId != null) {
            init();
        }
    }, [projectId, init]);

    if (projectId == null) {
        return (
            <div className="admin-page admin-data-page space-y-3">
                <div className="flex min-h-72 flex-col items-center justify-center gap-5 rounded-xl border border-dashed bg-card p-8 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                        <FolderCog className="size-7" strokeWidth={1.5} aria-hidden="true"/>
                    </div>
                    <p className="text-sm text-muted-foreground">Project Not Found !</p>
                </div>
            </div>
        );
    }


      const deleteHandler= (id: number) => {
            TableConfigApi.delete(id, errorTranslate,Navigations.redirectToLogin).then(()=>{
                toast.success(globalTranslate("delete")+globalTranslate("operation-success"));
            }).catch(()=>{});
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
    const projectDictionaries = (dataState.data as PagerResult<TableConfig>).dictionary["projectId"] as KeyValue[];
    const parent = projectDictionaries.find((e) => {
        return e.key == projectId;
    })
    return (
        <div className="admin-page admin-data-page space-y-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 px-1 pb-1 pt-1">
                <FolderCog className="size-[18px] shrink-0 text-primary" strokeWidth={1.7} aria-hidden="true"/>
                <span className="text-sm text-muted-foreground">{pageTranslate("projectId")}</span>
                <span className="break-all text-base font-semibold tracking-tight text-foreground">{parent?.value}</span>
            </div>
            <div className="admin-table-panel min-w-0">
                <DataTable<TableConfig>
                    SearchComponent={Search}
                    OperationComponent={Operation}
                    tableName={"TableConfig"}
                    primary={"id"}
                    i18n={true}
                    result={dataState}
                    columns={columns}
                    setData={setDataState}
                    EditComponent={TableEdit}
                    deleteHandler={deleteHandler}
                    initHandler={init}
                    parent={parent}
                    defaultPager={pagination}
                    RowOperationComponents={[]}
                ></DataTable>
            </div>
        </div>
    );
}
