import * as React from "react";
import {useState} from "react";
import {AdminUser} from "@/components/admin-user/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import AdminUserApi from "@/api/auto/admin-user";
import {useTranslations} from "next-intl";

import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";
import {PagerResult} from "@/common/lib/protocol/Result";

interface AdminUserQuery extends SimplePager{
    status: number;
}

export default function Search({table}: TableOperationProps<AdminUser>) {
    const meta = table.options.meta as MyTableMeta<AdminUser>;
    const errorTranslate = useTranslations("AdminUser.ErrorMessage")
    const pageTranslate = useTranslations("AdminUser")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [adminUserQuery, setAdminUserQuery] = useState<AdminUserQuery>({} as AdminUserQuery)
    const  Navigations=useNavigating();
    
    const pagerResult = meta.result.data as PagerResult<AdminUser>
    


    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            meta.removeExpansionKey();

            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            adminUserQuery.pageNo = page?.pageIndex;
            adminUserQuery.pageSize = page?.pageSize;
            AdminUserApi.search(adminUserQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="admin-search-bar flex flex-wrap items-center gap-3 rounded-lg bg-muted/40 p-3 [&>input]:w-full [&>input]:max-w-none sm:[&>input]:w-56">
            <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setAdminUserQuery} dictionary={pagerResult.dictionary['status']}/>
            <Button onClick={() => searchHandler()} className="w-full gap-2 px-5 sm:w-auto">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}