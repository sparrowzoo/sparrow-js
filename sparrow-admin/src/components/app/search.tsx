import * as React from "react";
import {useState} from "react";
import {App} from "@/components/app/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import AppApi from "@/api/auto/app";
import {useTranslations} from "next-intl";
import SearchInput from "@/common/components/forms/search-input";
import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";
import {PagerResult} from "@/common/lib/protocol/Result";

interface AppQuery extends SimplePager{
    code: string;
name: string;
status: number;
}

export default function Search({table}: TableOperationProps<App>) {
    const meta = table.options.meta as MyTableMeta<App>;
    const errorTranslate = useTranslations("App.ErrorMessage")
    const pageTranslate = useTranslations("App")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [appQuery, setAppQuery] = useState<AppQuery>({} as AppQuery)
    const  Navigations=useNavigating();
    
    const pagerResult = meta.result.data as PagerResult<App>
    


    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            meta.removeExpansionKey();

            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            appQuery.pageNo = page?.pageIndex;
            appQuery.pageSize = page?.pageSize;
            AppApi.search(appQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="admin-search-bar flex flex-wrap items-center gap-3 rounded-lg bg-muted/40 p-3 [&>input]:w-full [&>input]:max-w-none sm:[&>input]:w-56">
            <SearchInput value={appQuery?.code||""} 
propertyName={"code"} pageTranslate={pageTranslate} 
setSearchCondition={setAppQuery}/>
<SearchInput value={appQuery?.name||""} 
propertyName={"name"} pageTranslate={pageTranslate} 
setSearchCondition={setAppQuery}/>
<SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setAppQuery} dictionary={pagerResult.dictionary['status']}/>
            <Button onClick={() => searchHandler()} className="w-full gap-2 px-5 sm:w-auto">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}