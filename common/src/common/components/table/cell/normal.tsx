import * as React from "react";
import {MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";
import {Utils} from "@/common/lib/Utils";
import {PagerResult} from "@/common/lib/protocol/Result";

const NormalCell = (field: string, width?: number, handler?: (value: unknown) => string) => {
    const widthClass = width ? `w-${width}` : "w-fit";
    const Cell= ({row, table}) => {
        const translator = useTranslations("KVS");
        let value = row.getValue(field);
        if (handler) {
            value = handler(value);
        }
        const meta = table.options.meta as MyTableMeta<unknown>;
        if ((meta.result.data as PagerResult).dictionary) {
            const dictionary = (meta.result.data as PagerResult).dictionary[field];
            if (dictionary) {
                const currentItem = Utils.getValue(dictionary, value);
                if (currentItem) {
                    if (meta.i18n && translator.has(field)) {
                        value = translator(field + "." + currentItem.value);
                    } else {
                        value = currentItem.value;
                    }
                }
            }
        }
        if (typeof value === "boolean") {
            const className = `uppercase ${widthClass}`;
            return <div className={className}>{value.toString()}</div>
        }
        return <div className={widthClass}>{value}</div>
    }
    Cell.displayName="NormalCell";
    return Cell;
}
export default NormalCell;
