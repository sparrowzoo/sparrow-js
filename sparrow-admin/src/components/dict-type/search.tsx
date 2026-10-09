import * as React from "react";
import {useState} from "react";
import {DictType} from "@/components/dict-type/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import DictTypeApi from "@/api/auto/dict-type";
import {useTranslations} from "next-intl";

import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";
import {PagerResult} from "@/common/lib/protocol/Result";

interface DictTypeQuery extends SimplePager{
    status: number;
}

export default function Search({table}: TableOperationProps<DictType>) {
    const meta = table.options.meta as MyTableMeta<DictType>;
    const errorTranslate = useTranslations("DictType.ErrorMessage")
    const pageTranslate = useTranslations("DictType")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [dictTypeQuery, setDictTypeQuery] = useState<DictTypeQuery>({} as DictTypeQuery)
    const  Navigations=useNavigating();
    
    const pagerResult = meta.result.data as PagerResult<DictType>
    


    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            meta.removeExpansionKey();

            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            dictTypeQuery.pageNo = page?.pageIndex;
            dictTypeQuery.pageSize = page?.pageSize;
            DictTypeApi.search(dictTypeQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="admin-search-bar flex flex-wrap items-center gap-3 rounded-lg bg-muted/40 p-3 [&>input]:w-full [&>input]:max-w-none sm:[&>input]:w-56">
            <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setDictTypeQuery} dictionary={pagerResult.dictionary['status']}/>
            <Button onClick={() => searchHandler()} className="w-full gap-2 px-5 sm:w-auto">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}