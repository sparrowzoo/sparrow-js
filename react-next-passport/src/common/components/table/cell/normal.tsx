import * as React from "react";
import {MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";
import {Utils} from "@/common/lib/Utils";

const NormalCell = (field: string, width?: number, handler?: (value: any) => string) => {
    const widthClass = width ? `w-${width}` : "w-fit";
    return ({row, table}) => {
        let value = row.getValue(field);
        if (handler) {
            value = handler(value);
        }
        const meta = table.options.meta as MyTableMeta<any>;
        const dictionary = meta.result.data.dictionary[field];
        if (dictionary) {
            let currentItem = Utils.getValue(dictionary, value);
            const translator = useTranslations("KVS." + field);
            value = meta.i18n ? translator(currentItem.value) : currentItem.value;
        }
        if (typeof value === "boolean") {
            const className = `uppercase ${widthClass}`;
            return <div className={className}>{value.toString()}</div>
        }
        return <div className={widthClass}>{value}</div>
    }
}
export default NormalCell;
