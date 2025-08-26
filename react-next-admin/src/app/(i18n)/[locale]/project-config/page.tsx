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
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import TableConfigs from "@/components/project-config/operations/table-configs";
import ClearScaffold from "@/components/project-config/operations/clear";
import InitScaffold from "@/components/project-config/operations/init";
import useNavigating from "@/common/hook/NavigatingHook";


export default function Page() {
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage");
    const globalTranslate = useTranslations("GlobalForm");
    const  Navigations=useNavigating();
    const [dataState, setDataState] = useState<Result<PagerResult<ProjectConfig>> | undefined>();
    const init = () => {
        ProjectConfigApi.search({}, errorTranslate,Navigations.redirectToLogin).then(
            (res) => {
                setDataState(res);
            }
        ).catch(() => {
        });
    };
    useEffect(() => {
        init();
    }, []);


    const deleteHandler = (id: number) => {
        ProjectConfigApi.delete(id, errorTranslate).then(() => {
            toast.success(globalTranslate("delete") + globalTranslate("operation-success"));
        }).catch(() => {
        });
    }

    if (!dataState) {
        return <ThreeDotLoading/>
    }
    return (
        <div className="w-full p-2">
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
                RowOperationComponents={[TableConfigs, ClearScaffold, InitScaffold]}
            ></DataTable>
        </div>
    );
}
