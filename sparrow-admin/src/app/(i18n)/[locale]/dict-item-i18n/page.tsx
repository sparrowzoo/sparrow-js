"use client";

import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {columns, DictItemI18n} from "@/components/dict-item-i18n/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/dict-item-i18n/search";
import Operation from "@/components/dict-item-i18n/operation";

import EditPage from "@/components/dict-item-i18n/edit";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import DictItemI18nApi from "@/api/auto/dict-item-i18n";
import {useTranslations} from "next-intl";
import toast from "react-hot-toast";
import Result from "@/common/lib/protocol/Result";
import useNavigating from "@/common/hook/NavigatingHook";




const pagination = {pageIndex: 0, pageSize: 10};

export default function Page() {
    const errorTranslate = useTranslations("DictItemI18n.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");
    const [dataState, setDataState] = useState<Result | undefined>();
    const  Navigations=useNavigating();
    const redirectToLoginRef = useRef(Navigations.redirectToLogin);
    const init = useCallback(() => {
        DictItemI18nApi.search({...pagination}, errorTranslate, redirectToLoginRef.current).then(
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
            DictItemI18nApi.delete(id, errorTranslate,Navigations.redirectToLogin).then(()=>{
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
                <DataTable<DictItemI18n>
                    SearchComponent={Search}
                    OperationComponent={Operation}
                    tableName={"DictItemI18n"}
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