import * as React from "react";
import {useState} from "react";
import {Position} from "@/components/position/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import PositionApi from "@/api/auto/position";
import {useTranslations} from "next-intl";

import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";
import {PagerResult} from "@/common/lib/protocol/Result";

interface PositionQuery extends SimplePager{
    status: number;
}

export default function Search({table}: TableOperationProps<Position>) {
    const meta = table.options.meta as MyTableMeta<Position>;
    const errorTranslate = useTranslations("Position.ErrorMessage")
    const pageTranslate = useTranslations("Position")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [positionQuery, setPositionQuery] = useState<PositionQuery>({} as PositionQuery)
    const  Navigations=useNavigating();
    
    const pagerResult = meta.result.data as PagerResult<Position>
    


    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            meta.removeExpansionKey();

            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            positionQuery.pageNo = page?.pageIndex;
            positionQuery.pageSize = page?.pageSize;
            PositionApi.search(positionQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="admin-search-bar flex flex-wrap items-center gap-3 rounded-lg bg-muted/40 p-3 [&>input]:w-full [&>input]:max-w-none sm:[&>input]:w-56">
            <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setPositionQuery} dictionary={pagerResult.dictionary['status']}/>
            <Button onClick={() => searchHandler()} className="w-full gap-2 px-5 sm:w-auto">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}