
import * as React from "react";
import {useState} from "react";
import {ProjectConfig} from "@/components/project-config/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import ProjectConfigApi from "@/api/auto/project-config";
import {useTranslations} from "next-intl";
import SearchInput from "@/common/components/forms/search-input";
import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";


interface ProjectConfigQuery extends SimplePager{
    name: string;
frontendName: string;
chineseName: string;
status: number;
}

export default function Search({table}: TableOperationProps<ProjectConfig>) {
    const meta = table.options.meta as MyTableMeta<ProjectConfig>;
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
    const pageTranslate = useTranslations("ProjectConfig")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [projectConfigQuery, setProjectConfigQuery] = useState<ProjectConfigQuery>({} as ProjectConfigQuery)
    const  Navigations=useNavigating();

    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            projectConfigQuery.pageNo = page?.pageIndex;
            projectConfigQuery.pageSize = page?.pageSize;
            ProjectConfigApi.search(projectConfigQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="flex flex-row flex-wrap gap-4">
            <SearchInput value={projectConfigQuery?.name||""} 
propertyName={"name"} pageTranslate={pageTranslate} 
setSearchCondition={setProjectConfigQuery}/>
<SearchInput value={projectConfigQuery?.frontendName||""} 
propertyName={"frontendName"} pageTranslate={pageTranslate} 
setSearchCondition={setProjectConfigQuery}/>
<SearchInput value={projectConfigQuery?.chineseName||""} 
propertyName={"chineseName"} pageTranslate={pageTranslate} 
setSearchCondition={setProjectConfigQuery}/>
<SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setProjectConfigQuery} dictionary={meta.result.data.dictionary['status']}/>
            <Button onClick={() => searchHandler()} variant="ghost" className="ml-2">{globalTranslate('search')}</Button>
        </div>
    );
}