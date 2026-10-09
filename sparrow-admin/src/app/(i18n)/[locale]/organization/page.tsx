"use client";

import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {columns, Organization} from "@/components/organization/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/organization/search";
import Operation from "@/components/organization/operation";

import AddPage from "@/components/organization/add";

import EditPage from "@/components/organization/edit";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import OrganizationApi from "@/api/auto/organization";
import {useTranslations} from "next-intl";
import toast from "react-hot-toast";
import Result from "@/common/lib/protocol/Result";
import useNavigating from "@/common/hook/NavigatingHook";




const pagination = {pageIndex: 0, pageSize: 10};

export default function Page() {
    const errorTranslate = useTranslations("Organization.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");
    const [dataState, setDataState] = useState<Result | undefined>();
    const  Navigations=useNavigating();
    const redirectToLoginRef = useRef(Navigations.redirectToLogin);
    const init = useCallback(() => {
        OrganizationApi.search({...pagination}, errorTranslate, redirectToLoginRef.current).then(
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
            OrganizationApi.delete(id, errorTranslate,Navigations.redirectToLogin).then(()=>{
                toast.success(globalTranslate("delete")+globalTranslate("operation-success"));
                init();
            }).catch(()=>{});
        }

        
        const childrenHandler = async (row) => {
                        const result = await OrganizationApi.search({parentId: row.id}, errorTranslate, Navigations.redirectToLogin);
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
                <DataTable<Organization>
                    SearchComponent={Search}
                    OperationComponent={Operation}
                    tableName={"Organization"}
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