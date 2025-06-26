import ColumnOperation from "@/common/components/table/column-operation";
import * as React from "react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";

const NormalHeader = ({showFilter, showSort, columnTitle, i18nPrefix}: ColumnOperationProps) => {
    return ({column}) => {
        const t = useTranslations(i18nPrefix);
        const title = i18nPrefix ? t(column.id) : columnTitle;

        return (<>
                <ColumnOperation columnTitle={title} showFilter={showFilter} showSort={showSort}
                                 column={column}/></>
        );
    }
};
export default NormalHeader;

