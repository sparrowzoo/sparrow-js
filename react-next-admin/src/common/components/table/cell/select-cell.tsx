import * as React from "react";
import {useEffect, useState} from "react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {useTranslations} from "next-intl";
import {MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {Utils} from "@/common/lib/Utils";

const SelectCell = (field: string, i18n?: boolean) => {
    const className = "w-fit";
    return ({row, cell}) => {
        debugger;
        const translator = i18n ? useTranslations("KVS." + field) : null;
        const fieldValue = row.original[field] || "";
        const meta = cell.getContext().table.options.meta as MyTableMeta<any>;
        const dictionary = meta.result.data.dictionary[field];
        const [value, setValue] = useState(fieldValue);
        useEffect(() => {
            setValue(fieldValue);
        }, [fieldValue]);

        let currentItem = Utils.getValue(dictionary, value);
        if (!currentItem) {
            try {
                currentItem = dictionary[0];
                if (!currentItem) {
                    debugger;
                    console.error("Dictionary item not found for field " + field + " with value " + value)
                }
            } catch (e) {
                debugger;
                console.error("Dictionary item not found for field " + field + " with value " + value)
            }
        }
        const displayText = translator ? translator(currentItem.value, {defaultValue: currentItem.value}) : currentItem.value;

        return (
            <Select onValueChange={((value) => {
                debugger;
                row.original[field] = value;
                setValue(value);
                console.log("log ", value);
            })}>
                <SelectTrigger className={className}>
                    <SelectValue
                        placeholder={displayText} key={value}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {/*<SelectLabel>{translator(dictionary[value].value)}</SelectLabel>*/}
                        {
                            dictionary?.map((item) => {
                                return <SelectItem key={item.key} accessKey={item.key}
                                                   value={item.key as string}>{translator ? translator(item.value, {defaultValue: item.value}) : item.value}</SelectItem>
                            })
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        )
    }
}
export default SelectCell;
