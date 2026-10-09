import * as React from "react";
import {useState} from "react";
import {Permission} from "@/components/permission/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import PermissionApi from "@/api/auto/permission";
import {useTranslations} from "next-intl";

import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";
import {PagerResult} from "@/common/lib/protocol/Result";

interface PermissionQuery extends SimplePager{
    status: number;
}

export default function Search({table}: TableOperationProps<Permission>) {
    const meta = table.options.meta as MyTableMeta<Permission>;
    const errorTranslate = useTranslations("Permission.ErrorMessage")
    const pageTranslate = useTranslations("Permission")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [permissionQuery, setPermissionQuery] = useState<PermissionQuery>({} as PermissionQuery)
    const  Navigations=useNavigating();
    
    const pagerResult = meta.result.data as PagerResult<Permission>
    


    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            meta.removeExpansionKey();

            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            permissionQuery.pageNo = page?.pageIndex;
            permissionQuery.pageSize = page?.pageSize;
            PermissionApi.search(permissionQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="admin-search-bar flex flex-wrap items-center gap-3 rounded-lg bg-muted/40 p-3 [&>input]:w-full [&>input]:max-w-none sm:[&>input]:w-56">
            <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setPermissionQuery} dictionary={pagerResult.dictionary['status']}/>
            <Button onClick={() => searchHandler()} className="w-full gap-2 px-5 sm:w-auto">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}