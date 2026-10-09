import * as React from "react";
import {useState} from "react";
import {DictItemI18n} from "@/components/dict-item-i18n/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import DictItemI18nApi from "@/api/auto/dict-item-i18n";
import {useTranslations} from "next-intl";

import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";
import {PagerResult} from "@/common/lib/protocol/Result";

interface DictItemI18nQuery extends SimplePager{
    status: number;
}

export default function Search({table}: TableOperationProps<DictItemI18n>) {
    const meta = table.options.meta as MyTableMeta<DictItemI18n>;
    const errorTranslate = useTranslations("DictItemI18n.ErrorMessage")
    const pageTranslate = useTranslations("DictItemI18n")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [dictItemI18nQuery, setDictItemI18nQuery] = useState<DictItemI18nQuery>({} as DictItemI18nQuery)
    const  Navigations=useNavigating();
    
    const pagerResult = meta.result.data as PagerResult<DictItemI18n>
    


    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            meta.removeExpansionKey();

            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            dictItemI18nQuery.pageNo = page?.pageIndex;
            dictItemI18nQuery.pageSize = page?.pageSize;
            DictItemI18nApi.search(dictItemI18nQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="admin-search-bar flex flex-wrap items-center gap-3 rounded-lg bg-muted/40 p-3 [&>input]:w-full [&>input]:max-w-none sm:[&>input]:w-56">
            <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setDictItemI18nQuery} dictionary={pagerResult.dictionary['status']}/>
            <Button onClick={() => searchHandler()} className="w-full gap-2 px-5 sm:w-auto">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}