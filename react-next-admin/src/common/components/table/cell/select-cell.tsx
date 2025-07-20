import * as React from "react";
import {useEffect, useState} from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useTranslations} from "next-intl";
import {MyTableMeta} from "@/common/lib/table/DataTableProperty";

const SelectCell = (field: string,width?: number) => {
    const className = width ? `w-${width}` : "w-fit";
    return ({row, cell}) => {
        debugger;
        const translator = useTranslations("Enums." + field)
        const fieldValue = row.getValue(field) || "";
        const meta = cell.getContext().table.options.meta as MyTableMeta<any>;
        const dictionary = meta.result.data.dictionary[field];
        const [value, setValue] = useState(fieldValue);
        useEffect(() => {
            setValue(fieldValue);
        }, [fieldValue]);

        return (
            <Select>
                <SelectTrigger className={className} onChange={(event) => {
                    row.original[field] = event.currentTarget.accessKey
                    setValue(event.currentTarget.accessKey);
                    console.log("log ", value);
                }}>
                    <SelectValue key={value}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        {
                            dictionary?.map((item) => {
                                return <SelectItem value={item.key as string}>{translator(item.value)}</SelectItem>
                            })
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        )
    }
}
export default SelectCell;
