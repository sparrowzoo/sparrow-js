"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {columns, TableConfig} from "@/components/table-config/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/table-config/search";
import Operation from "@/components/table-config/operation";
import EditPage from "@/components/table-config/edit";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import TableConfigApi from "@/api/auto/table-config";
import {useTranslations} from "next-intl";
import toast from "react-hot-toast";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import RowOperations from "@/components/table-config/row-operations";




export default function Page() {
    const errorTranslate = useTranslations("TableConfig.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");

    const [dataState, setDataState] = useState<Result<PagerResult<TableConfig>> | undefined>();
    useEffect(() => {
        TableConfigApi.search({}, errorTranslate).then(
                                              (res) => {
                                                  setDataState(res)
                                              }
                                           ).catch(()=>{});

    }, []);


      const deleteHandler= (id: number) => {
            TableConfigApi.delete(id, errorTranslate).then(()=>{
                toast.success(globalTranslate("delete")+globalTranslate("operation-success"));
            }).catch(()=>{});
        }

    if (!dataState) {
        return <ThreeDotLoading/>
    }
    return (
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
                EditComponent={EditPage}
                deleteHandler={deleteHandler}
                RowOperationComponents={[RowOperations]}
            ></DataTable>
        </div>
    );
}