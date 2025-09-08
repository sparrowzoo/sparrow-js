import ColumnOperation from "@/common/components/table/column-operation";
import * as React from "react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";

const NormalHeader = ({showFilter, showSort, columnTitle, column}: ColumnOperationProps) => {
    return ({column, table}) => {
        const tableName = table?.options.meta?.tableName;
        const i18n = table?.options.meta.i18n;
        if (i18n) {
            const t = useTranslations(tableName);
            if (t.has(column.id)) {
                columnTitle = t(column.id)
            }
        }

        return (<>
                <ColumnOperation column={column} columnTitle={columnTitle} showFilter={showFilter}
                                 showSort={showSort}/></>
        );
    }
};
export default NormalHeader;

