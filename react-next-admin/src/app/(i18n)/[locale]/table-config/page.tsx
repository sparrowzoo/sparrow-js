
"use client";

import * as React from "react";
import {Suspense, useCallback, useEffect, useState} from "react";
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



const pagination = {pageIndex: 0, pageSize: -1};

export default function Page() {
    return (
        <Suspense fallback={<ThreeDotLoading/>}>
            <TableConfigContent/>
        </Suspense>
    );
}

function TableConfigContent() {
    const errorTranslate = useTranslations("TableConfig.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");
    const [dataState, setDataState] = useState<Result | undefined>();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    const  Navigations=useNavigating();

    const init = useCallback(() => {
                TableConfigApi.search({...pagination}, errorTranslate,Navigations.redirectToLogin).then(
                    (res) => {
                        setDataState(res)
                    }
                ).catch(() => {
                });
            }, [errorTranslate, Navigations.redirectToLogin]);
            useEffect(() => {
                if (projectId != null) {
                    init();
                }
            }, [projectId, init]);

    if (projectId == null) {
        return <div>Project Not Found !</div>
    }


      const deleteHandler= (id: number) => {
            TableConfigApi.delete(id, errorTranslate,Navigations.redirectToLogin).then(()=>{
                toast.success(globalTranslate("delete")+globalTranslate("operation-success"));
            }).catch(()=>{});
        }

    if (!dataState) {
        return <ThreeDotLoading/>
    }
    const projectDictionaries = (dataState.data as PagerResult<TableConfig>).dictionary["projectId"] as KeyValue[];
    const parent = projectDictionaries.find((e) => {
        return e.key == projectId;
    })
    return (<>
            <h1 className="text-3xl font-bold mb-4">项目 - {parent?.value}</h1>
            <div className="w-full">
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
        </>
    );
}
