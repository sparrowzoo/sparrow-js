import * as React from "react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";


export const PlainTextHeader = ({columnTitle, i18nPrefix}: ColumnOperationProps) => {
    return ({column}) => {
        const t = useTranslations(i18nPrefix);
        const localTitle = i18nPrefix ? t(column.id) : columnTitle;
        return (<strong>{localTitle}</strong>
        );
    }
};
export default PlainTextHeader;

