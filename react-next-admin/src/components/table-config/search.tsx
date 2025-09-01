
import * as React from "react";
import {useState} from "react";
import {TableConfig} from "@/components/table-config/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import TableConfigApi from "@/api/auto/table-config";
import {useTranslations} from "next-intl";
import SearchInput from "@/common/components/forms/search-input";
import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import useNavigating from "@/common/hook/NavigatingHook";


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


    return (<div className="flex flex-row flex-wrap gap-4">
            <SearchInput value={tableConfigQuery?.tableName||""} 
propertyName={"tableName"} pageTranslate={pageTranslate} 
setSearchCondition={setTableConfigQuery}/>
<SearchInput value={tableConfigQuery?.className||""} 
propertyName={"className"} pageTranslate={pageTranslate} 
setSearchCondition={setTableConfigQuery}/>
<SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setTableConfigQuery} dictionary={meta.result.data.dictionary['status']}/>
            <Button onClick={() => searchHandler()} variant="ghost" className="ml-2">{globalTranslate('search')}</Button>
        </div>
    );
}