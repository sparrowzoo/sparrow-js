
import * as React from "react";
import {useState} from "react";
import {ProjectConfig} from "@/components/project-config/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {PagerResult} from "@/common/lib/protocol/Result";
import {Button} from "@/components/ui/button";
import ProjectConfigApi from "@/api/auto/project-config";
import {useTranslations} from "next-intl";
import SearchInput from "@/common/components/forms/search-input";
import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";


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


    return (
        <div className="admin-search-bar grid grid-cols-1 items-center gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_8rem_auto]">
            <label className="min-w-0 [&_input]:max-w-none">
                <span className="sr-only">{pageTranslate("name")}</span>
                <SearchInput value={projectConfigQuery?.name||""}
                             propertyName={"name"} pageTranslate={pageTranslate}
                             setSearchCondition={setProjectConfigQuery}/>
            </label>
            <label className="min-w-0 [&_input]:max-w-none">
                <span className="sr-only">{pageTranslate("frontendName")}</span>
                <SearchInput value={projectConfigQuery?.frontendName||""}
                             propertyName={"frontendName"} pageTranslate={pageTranslate}
                             setSearchCondition={setProjectConfigQuery}/>
            </label>
            <label className="min-w-0 [&_input]:max-w-none">
                <span className="sr-only">{pageTranslate("chineseName")}</span>
                <SearchInput value={projectConfigQuery?.chineseName||""}
                             propertyName={"chineseName"} pageTranslate={pageTranslate}
                             setSearchCondition={setProjectConfigQuery}/>
            </label>
            <label className="min-w-0 [&_button]:w-full">
                <span className="sr-only">{pageTranslate("status")}</span>
                <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setProjectConfigQuery} dictionary={(meta.result.data as PagerResult<ProjectConfig>).dictionary['status']}/>
            </label>
            <Button onClick={() => searchHandler()} className="gap-2 px-5">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}
