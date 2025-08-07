
import * as React from "react";
import {useState} from "react";
import {TableConfig} from "@/components/table-config/columns";
import {MyTableMeta,SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import TableConfigApi from "@/api/auto/table-config";
import {useTranslations} from "next-intl";
import SearchInput from "@/common/components/forms/SearchInput";
import SearchSelect from "@/common/components/forms/search-select";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";


interface TableConfigQuery extends SimplePager{
    status: number;
}

export default function Search({table}: TableOperationProps<TableConfig>) {
    const meta = table.options.meta as MyTableMeta<TableConfig>;
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const pageTranslate = useTranslations("TableConfig")
    const globalTranslate = useTranslations("GlobalForm");
    const setDataState = meta.setData;
    const [tableConfigQuery, setTableConfigQuery] = useState<TableConfigQuery>({} as TableConfigQuery)

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
            TableConfigApi.search(tableConfigQuery, errorTranslate).then(
                (res) => {
                    setDataState(res)
                }
            ).catch(() => {
            });
        };
    meta.searchHandler=searchHandler;


    return (<div className="flex flex-row flex-wrap gap-4">
            <SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setTableConfigQuery} dictionary={meta.result.data.dictionary['status']}/>
            <Button onClick={() => searchHandler()} variant="ghost" className="ml-2">{globalTranslate('search')}</Button>
        </div>
    );
}