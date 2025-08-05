import * as React from "react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {useTranslations} from "next-intl";
import {SearchInputProps} from "@/common/lib/table/DataTableProperty";

export default function SearchSelect<T>({
                                            propertyName,
                                            pageTranslate,
                                            setSearchCondition,
                                            dictionary
                                        }: SearchInputProps<T>) {
    const className = "w-fit";
    const translator = useTranslations("KVS." + propertyName);
    const displayText = translator ? translator("all") : "all";
    return (
        <Select onValueChange={(value) => {
            setSearchCondition((prevState) => {
                return {
                    ...prevState,
                    [propertyName]: value
                } as T;
            })
        }
        }>
            <SelectTrigger className={className}>
                <SelectValue
                    placeholder={pageTranslate(propertyName)} key={"-1"}/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem key={-1}
                                value={"-1"}>{displayText}</SelectItem>
                    {

                        dictionary?.map((item) => {
                            return <SelectItem key={item.key}
                                               value={item.key as string}>{translator ? translator(item.value, {defaultValue: item.value}) : item.value}</SelectItem>
                        })
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
