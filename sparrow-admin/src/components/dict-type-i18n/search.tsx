import * as React from "react";
import {useState} from "react";
import {DictTypeI18n} from "@/components/dict-type-i18n/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import DictTypeI18nApi from "@/api/auto/dict-type-i18n";
import {useTranslations} from "next-intl";

import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";
import {PagerResult} from "@/common/lib/protocol/Result";

interface DictTypeI18nQuery extends SimplePager{
    status: number;
}

export default function Search({table}: TableOperationProps<DictTypeI18n>) {
    const meta = table.options.meta as MyTableMeta<DictTypeI18n>;
    const errorTranslate = useTranslations("DictTypeI18n.ErrorMessage")
    const pageTranslate = useTranslations("DictTypeI18n")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [dictTypeI18nQuery, setDictTypeI18nQuery] = useState<DictTypeI18nQuery>({} as DictTypeI18nQuery)
    const  Navigations=useNavigating();
    
    const pagerResult = meta.result.data as PagerResult<DictTypeI18n>
    


    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            meta.removeExpansionKey();

            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            dictTypeI18nQuery.pageNo = page?.pageIndex;
            dictTypeI18nQuery.pageSize = page?.pageSize;
            DictTypeI18nApi.search(dictTypeI18nQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="admin-search-bar flex flex-wrap items-center gap-3 rounded-lg bg-muted/40 p-3 [&>input]:w-full [&>input]:max-w-none sm:[&>input]:w-56">
            <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setDictTypeI18nQuery} dictionary={pagerResult.dictionary['status']}/>
            <Button onClick={() => searchHandler()} className="w-full gap-2 px-5 sm:w-auto">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}