import * as React from "react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {Utils} from "@/common/lib/Utils";
import {useTranslations} from "next-intl";
import {PagerResult} from "@/common/lib/protocol/Result";

const SelectCell = (field: string, i18n?: boolean, readOnly: boolean = false) => {
    const className = "w-fit";
    const Cell = ({row, cell}) => {
        const translator = useTranslations("KVS");
        const fieldValue = row.original[field] || "";
        const meta = cell.getContext().table.options.meta as MyTableMeta<unknown>;
        const dictionary = (meta.result.data as PagerResult).dictionary[field];

        let currentItem = Utils.getValue(dictionary, fieldValue);
        if (!currentItem) {
            if (dictionary.length == 0) {
                console.error("field is not found " + field);
                return <></>;
            }
            currentItem = dictionary[0];
        }

        let displayText = currentItem.value;
        if (i18n) {
            if (translator.has(field)) {
                displayText = translator(field + "." + currentItem.value);
            }
        }

        if (readOnly) {
            return <div>{displayText}</div>
        }
        return (
            <Select defaultValue={fieldValue.toString()} onValueChange={(value) => {
                row.original[field] = value;
            }
            }>
                <SelectTrigger className={className}>
                    <SelectValue
                        placeholder={displayText}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {
                            dictionary?.map((item) => {
                                let displayText = item.value;
                                if (i18n && translator.has(field)) {
                                    displayText = translator(field + "." + item.value);
                                }
                                return <SelectItem key={item.key}
                                                   value={item.key.toString()}>{displayText}</SelectItem>
                            })
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        )
    }
    Cell.displayName = "SelectCell";
    return Cell;
}
export default SelectCell;
