import * as React from "react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";


export const PlainTextHeader = ({columnTitle}: ColumnOperationProps) => {
    return ({column, table}) => {
        const tableName = table?.options.meta?.tableName;
        const i18n = table?.options.meta.i18n;
        if (i18n) {
            const t = useTranslations(tableName);
            if (t.has(column.id)) {
                columnTitle = t(column.id);
            }
        }
        return (<strong>{columnTitle}</strong>
        );
    }
};
export default PlainTextHeader;

