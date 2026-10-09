"use client";

import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {columns, MicroService} from "@/components/micro-service/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/micro-service/search";
import Operation from "@/components/micro-service/operation";

import EditPage from "@/components/micro-service/edit";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import MicroServiceApi from "@/api/auto/micro-service";
import {useTranslations} from "next-intl";
import toast from "react-hot-toast";
import Result from "@/common/lib/protocol/Result";
import useNavigating from "@/common/hook/NavigatingHook";




const pagination = {pageIndex: 0, pageSize: 10};

export default function Page() {
    const errorTranslate = useTranslations("MicroService.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");
    const [dataState, setDataState] = useState<Result | undefined>();
    const  Navigations=useNavigating();
    const redirectToLoginRef = useRef(Navigations.redirectToLogin);
    const init = useCallback(() => {
        MicroServiceApi.search({...pagination}, errorTranslate, redirectToLoginRef.current).then(
            (res) => {
                setDataState(res)
            }
        ).catch(() => {
        });
    }, [errorTranslate]);
    useEffect(() => {
        init();
    }, [init]);


      const deleteHandler= (id: number) => {
            MicroServiceApi.delete(id, errorTranslate,Navigations.redirectToLogin).then(()=>{
                toast.success(globalTranslate("delete")+globalTranslate("operation-success"));
                init();
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
    return (
        <div className="admin-page admin-data-page space-y-3">
            <div className="admin-table-panel min-w-0">
                <DataTable<MicroService>
                    SearchComponent={Search}
                    OperationComponent={Operation}
                    tableName={"MicroService"}
                    primary={"id"}
                    i18n={true}
                    result={dataState}
                    columns={columns}
                    setData={setDataState}
                    EditComponent={EditPage}
                    deleteHandler={deleteHandler}
                    initHandler={init}
                    
                    defaultPager={{pageIndex: 0, pageSize: -1}}
                    RowOperationComponents={[]}
                ></DataTable>
            </div>
        </div>
    );
}