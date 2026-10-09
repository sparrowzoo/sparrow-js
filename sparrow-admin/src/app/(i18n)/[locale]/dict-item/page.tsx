"use client";

import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {columns, DictItem} from "@/components/dict-item/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/dict-item/search";
import Operation from "@/components/dict-item/operation";

import AddPage from "@/components/dict-item/add";

import EditPage from "@/components/dict-item/edit";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import DictItemApi from "@/api/auto/dict-item";
import {useTranslations} from "next-intl";
import toast from "react-hot-toast";
import Result from "@/common/lib/protocol/Result";
import useNavigating from "@/common/hook/NavigatingHook";




const pagination = {pageIndex: 0, pageSize: 10};

export default function Page() {
    const errorTranslate = useTranslations("DictItem.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");
    const [dataState, setDataState] = useState<Result | undefined>();
    const  Navigations=useNavigating();
    const redirectToLoginRef = useRef(Navigations.redirectToLogin);
    const init = useCallback(() => {
        DictItemApi.search({...pagination}, errorTranslate, redirectToLoginRef.current).then(
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
            DictItemApi.delete(id, errorTranslate,Navigations.redirectToLogin).then(()=>{
                toast.success(globalTranslate("delete")+globalTranslate("operation-success"));
                init();
            }).catch(()=>{});
        }

        
        const childrenHandler = async (row) => {
                        const result = await DictItemApi.search({parentId: row.id}, errorTranslate, Navigations.redirectToLogin);
                        return result.data.list;
                };
        
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
                <DataTable<DictItem>
                    SearchComponent={Search}
                    OperationComponent={Operation}
                    tableName={"DictItem"}
                    primary={"id"}
                    i18n={true}
                    result={dataState}
                    columns={columns}
                    setData={setDataState}
                    EditComponent={EditPage}
                    deleteHandler={deleteHandler}
                    initHandler={init}
                    loadSubRows={childrenHandler}
                    defaultPager={{pageIndex: 0, pageSize: -1}}
                    RowOperationComponents={[
                                            {
                                                component: AddPage,
                                                displayText: globalTranslate("add-child"),
                                                pop: true
                                             }
                                            ]}
                ></DataTable>
            </div>
        </div>
    );
}