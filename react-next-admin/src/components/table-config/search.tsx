
import * as React from "react";
import {useState} from "react";
import {TableConfig} from "@/components/table-config/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {PagerResult} from "@/common/lib/protocol/Result";
import {Button} from "@/components/ui/button";
import TableConfigApi from "@/api/auto/table-config";
import {useTranslations} from "next-intl";
import SearchInput from "@/common/components/forms/search-input";
import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";
import {Search as SearchIcon} from "lucide-react";


interface TableConfigQuery extends SimplePager{
    tableName: string;
className: string;
status: number;
}

export default function Search({table}: TableOperationProps<TableConfig>) {
    const meta = table.options.meta as MyTableMeta<TableConfig>;
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const pageTranslate = useTranslations("TableConfig")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [tableConfigQuery, setTableConfigQuery] = useState<TableConfigQuery>({} as TableConfigQuery)
    const  Navigations=useNavigating();

    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = (page?: PaginationState) => {
            if (!page) {
                page = {pageIndex: 0, pageSize: table.getState().pagination.pageSize}
                table.setPagination(page);
            }
            tableConfigQuery.pageNo = page?.pageIndex;
            tableConfigQuery.pageSize = page?.pageSize;
            TableConfigApi.search(tableConfigQuery, errorTranslate,Navigations.redirectToLogin).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (
        <div className="admin-search-bar grid grid-cols-1 items-center gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem_auto]">
            <label className="min-w-0 [&_input]:max-w-none">
                <span className="sr-only">{pageTranslate("tableName")}</span>
                <SearchInput value={tableConfigQuery?.tableName||""}
                             propertyName={"tableName"} pageTranslate={pageTranslate}
                             setSearchCondition={setTableConfigQuery}/>
            </label>
            <label className="min-w-0 [&_input]:max-w-none">
                <span className="sr-only">{pageTranslate("className")}</span>
                <SearchInput value={tableConfigQuery?.className||""}
                             propertyName={"className"} pageTranslate={pageTranslate}
                             setSearchCondition={setTableConfigQuery}/>
            </label>
            <label className="min-w-0 [&_button]:w-full">
                <span className="sr-only">{pageTranslate("status")}</span>
                <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setTableConfigQuery} dictionary={(meta.result.data as PagerResult<TableConfig>).dictionary['status']}/>
            </label>
            <Button onClick={() => searchHandler()} className="gap-2 px-5">
                <SearchIcon className="size-4" aria-hidden="true"/>
                {globalTranslate('search')}
            </Button>
        </div>
    );
}
