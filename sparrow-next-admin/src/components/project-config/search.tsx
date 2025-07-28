import {Input} from "@/components/ui/input";
import * as React from "react";
import {useState} from "react";
import {ProjectConfig} from "@/components/project-config/columns";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import ProjectConfigApi from "@/api/auto/project-config";
import {useTranslations} from "next-intl";

type TableConfigQuery = {
    tableName: string;
    tableClass: string;
}

export default function Search({table}: TableOperationProps<ProjectConfig>) {
    const meta = table.options.meta as MyTableMeta<ProjectConfig>;
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
    const setDataState = meta.setData;
    const [projectConfigQuery, setProjectConfigQuery] = useState<ProjectConfigQuery>()

    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = () => {
        meta.searchCondition = projectConfigQuery;
        ProjectConfigApi.search(projectConfigQuery, errorTranslate).then(
            (res) => {
                setDataState(res)
            }
        ).catch(() => {
        });
    };


    return (<>
            <Input value={projectConfigQuery?.tableName || ""} onChange={(e) => {
                setProjectConfigQuery((prevState) => {
                    return {
                        ...prevState,
                        tableName: e.target.value
                    } as TableConfigQuery
                })
            }}
                   placeholder="tableName ..."
                   className="max-w-sm"
            />
            <Button onClick={() => searchHandler()} variant="ghost" className="ml-2">搜索</Button>
        </>
    );
}