import ColumnOperation from "@/common/components/table/column-operation";
import * as React from "react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";

const NormalHeader = ({showFilter, showSort, columnTitle}: ColumnOperationProps) => {
    return ({column, table}) => {
        const tableName = table?.options.meta?.tableName;
        const i18n = table?.options.meta.i18n;
        const t = useTranslations(tableName);
        const title = i18n ? t(column.id) : columnTitle;

        return (<>
                <ColumnOperation columnTitle={title} showFilter={showFilter} showSort={showSort}
                                 column={column}/></>
        );
    }
};
export default NormalHeader;

