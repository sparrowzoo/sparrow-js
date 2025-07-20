import {Input} from "@/components/ui/input";
import * as React from "react";
import {useState} from "react";
import {TableConfig} from "@/components/table-config/columns";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import TableConfigApi from "@/api/auto/table-config";
import {useTranslations} from "next-intl";

type TableConfigQuery = {
    tableName: string;
    tableClass: string;
}

export default function Search({table}: TableOperationProps<TableConfig>) {
    const meta = table.options.meta as MyTableMeta<TableConfig>;
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const setDataState = meta.setData;
    const [tableConfigQuery, setTableConfigQuery] = useState<TableConfigQuery>()

    if (setDataState == null) {
        return <>setDataState is not defined</>
    }

    const searchHandler = () => {
        meta.searchCondition = tableConfigQuery;
        TableConfigApi.search(tableConfigQuery, errorTranslate).then(
            (res) => {
                setDataState(res)
            }
        ).catch(() => {
        });
    };


    return (<>
            <Input value={tableConfigQuery?.tableName || ""} onChange={(e) => {
                setTableConfigQuery((prevState) => {
                    return {
                        ...prevState,
                        tableName: e.target.value
                    } as TableConfigQuery
                })
            }}
                   placeholder="tableName ..."
                   className="max-w-sm"
            />
            <Button onClick={() => searchHandler()} variant="ghost" className="ml-2">搜索</Button>
        </>
    );
}