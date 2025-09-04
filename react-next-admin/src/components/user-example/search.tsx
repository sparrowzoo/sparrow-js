
import * as React from "react";
import {useState} from "react";
import {UserExample} from "@/components/user-example/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import UserExampleApi from "@/api/auto/user-example";
import {useTranslations} from "next-intl";
import SearchInput from "@/common/components/forms/search-input";
import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";


interface UserExampleQuery extends SimplePager{
    userName: string;
chineseName: string;
status: number;
}

export default function Search({table}: TableOperationProps<UserExample>) {
    const meta = table.options.meta as MyTableMeta<UserExample>;
    const errorTranslate = useTranslations("UserExample.ErrorMessage")
    const pageTranslate = useTranslations("UserExample")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [userExampleQuery, setUserExampleQuery] = useState<UserExampleQuery>({} as UserExampleQuery)
    const  Navigations=useNavigating();

    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            userExampleQuery.pageNo = page?.pageIndex;
            userExampleQuery.pageSize = page?.pageSize;
            UserExampleApi.search(userExampleQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="flex flex-row flex-wrap gap-4">
            <SearchInput value={userExampleQuery?.userName||""} 
propertyName={"userName"} pageTranslate={pageTranslate} 
setSearchCondition={setUserExampleQuery}/>
<SearchInput value={userExampleQuery?.chineseName||""} 
propertyName={"chineseName"} pageTranslate={pageTranslate} 
setSearchCondition={setUserExampleQuery}/>
<SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setUserExampleQuery} dictionary={meta.result.data.dictionary['status']}/>
            <Button onClick={() => searchHandler()} variant="ghost" className="ml-2">{globalTranslate('search')}</Button>
        </div>
    );
}