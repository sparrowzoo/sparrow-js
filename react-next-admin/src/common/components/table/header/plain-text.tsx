import * as React from "react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";


export const PlainTextHeader = ({columnTitle}: ColumnOperationProps) => {
    const Cell = ({column, table}) => {
        const tableName = table?.options.meta?.tableName;
        const i18n = table?.options.meta.i18n;
        const t = useTranslations(tableName);
        if (i18n && t.has(column.id)) {
            columnTitle = t(column.id);
        }
        return (<strong>{columnTitle}</strong>
        );
    };
    Cell.displayName = "PlainTextHeader";
    return Cell;
};
export default PlainTextHeader;

