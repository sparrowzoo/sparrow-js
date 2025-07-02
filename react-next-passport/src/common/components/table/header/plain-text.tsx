import * as React from "react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";


export const PlainTextHeader = ({columnTitle}: ColumnOperationProps) => {
    return ({column, table}) => {
        const tableName = table?.options.meta?.tableName;
        const i18n = table?.options.meta.i18n;
        const t = useTranslations(tableName);
        const localTitle = i18n ? t(column.id) : columnTitle;
        return (<strong>{localTitle}</strong>
        );
    }
};
export default PlainTextHeader;

