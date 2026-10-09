import * as React from "react";
import {useState} from "react";
import {Role} from "@/components/role/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import RoleApi from "@/api/auto/role";
import {useTranslations} from "next-intl";

import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";
import {PagerResult} from "@/common/lib/protocol/Result";

interface RoleQuery extends SimplePager{
    status: number;
}

export default function Search({table}: TableOperationProps<Role>) {
    const meta = table.options.meta as MyTableMeta<Role>;
    const errorTranslate = useTranslations("Role.ErrorMessage")
    const pageTranslate = useTranslations("Role")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [roleQuery, setRoleQuery] = useState<RoleQuery>({} as RoleQuery)
    const  Navigations=useNavigating();
    
    const pagerResult = meta.result.data as PagerResult<Role>
    


    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            meta.removeExpansionKey();

            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            roleQuery.pageNo = page?.pageIndex;
            roleQuery.pageSize = page?.pageSize;
            RoleApi.search(roleQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="admin-search-bar flex flex-wrap items-center gap-3 rounded-lg bg-muted/40 p-3 [&>input]:w-full [&>input]:max-w-none sm:[&>input]:w-56">
            <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setRoleQuery} dictionary={pagerResult.dictionary['status']}/>
            <Button onClick={() => searchHandler()} className="w-full gap-2 px-5 sm:w-auto">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}