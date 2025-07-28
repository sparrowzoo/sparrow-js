import {Input} from "@/components/ui/input";
import * as React from "react";
import {ProjectConfig} from "@/components/project-config/columns";
import {MyTableMeta, SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import ProjectConfigApi from "@/api/auto/project-config";
import {useTranslations} from "next-intl";

interface ProjectConfigQuery extends SimplePager {
    name: string;
    frontendName: string;
    chineseName: string;
}

export default function Search({table}: TableOperationProps<ProjectConfig>) {
    const meta = table.options.meta as MyTableMeta<ProjectConfig>;
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
    const setDataState = meta.setData;
    const pager = meta.pager;
    debugger;
    const [projectConfigQuery, setSearchCondition] = React.useState<ProjectConfigQuery>();
    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = ({pageNo, pageSize}: SimplePager) => {
        let localQuery = projectConfigQuery;
        if (!localQuery) {
            localQuery = {} as ProjectConfigQuery;
        }
        localQuery.pageNo = pageNo;
        localQuery.pageSize = pageSize;
        ProjectConfigApi.search(localQuery, errorTranslate).then(
            (res) => {
                setDataState(res)
            }
        ).catch(() => {
        });
    };
    meta.searchHandler = searchHandler;


    return (<>
            <Input value={projectConfigQuery?.name || ""} onChange={(e) => {
                setSearchCondition((prevState) => {
                    return {
                        ...prevState,
                        name: e.target.value
                    } as ProjectConfigQuery
                })
            }}
                   placeholder="tableName ..."
                   className="max-w-sm"
            />
            <Input value={projectConfigQuery?.chineseName || ""} onChange={(e) => {
                setSearchCondition((prevState) => {
                    return {
                        ...prevState,
                        chineseName: e.target.value
                    } as ProjectConfigQuery
                })
            }}
                   placeholder="tableName ..."
                   className="max-w-sm"
            />
            <Input value={projectConfigQuery?.frontendName || ""} onChange={(e) => {
                setSearchCondition((prevState) => {
                    return {
                        ...prevState,
                        frontendName: e.target.value
                    } as ProjectConfigQuery
                })
            }}
                   placeholder="tableName ..."
                   className="max-w-sm"
            />
            <Button onClick={() => searchHandler({pageNo: 1, pageSize: pager.pageSize})} variant="ghost"
                    className="ml-2">搜索</Button>
        </>
    );
}
