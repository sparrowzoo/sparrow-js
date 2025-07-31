
import * as React from "react";
import {useState} from "react";
import {TableConfig} from "@/components/table-config/columns";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import TableConfigApi from "@/api/auto/table-config";
import {useTranslations} from "next-intl";
import SearchInput from "@/common/components/forms/SearchInput";
import SearchSelect from "@/common/components/forms/search-select";



type TableConfigQuery = {
    projectId: number;
primaryKey: string;
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
    const [tableConfigQuery, setTableConfigQuery] = useState<TableConfigQuery>()

    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = () => {
        TableConfigApi.search(tableConfigQuery, errorTranslate).then(
            (res) => {
                setDataState(res)
            }
        ).catch(() => {
        });
    };


    return (<>
            <SearchInput value={tableConfigQuery?.projectId||""} 
propertyName={"projectId"} pageTranslate={pageTranslate} 
setSearchCondition={setTableConfigQuery}/>
<SearchInput value={tableConfigQuery?.primaryKey||""} 
propertyName={"primaryKey"} pageTranslate={pageTranslate} 
setSearchCondition={setTableConfigQuery}/>
<SearchInput value={tableConfigQuery?.tableName||""} 
propertyName={"tableName"} pageTranslate={pageTranslate} 
setSearchCondition={setTableConfigQuery}/>
<SearchInput value={tableConfigQuery?.className||""} 
propertyName={"className"} pageTranslate={pageTranslate} 
setSearchCondition={setTableConfigQuery}/>
<SearchSelect propertyName={"status"} pageTranslate={pageTranslate} setSearchCondition={setTableConfigQuery} dictionary={meta.result.data.dictionary['status']}/>
            <Button onClick={() => searchHandler()} variant="ghost" className="ml-2">{globalTranslate('search')}</Button>
        </>
    );
}