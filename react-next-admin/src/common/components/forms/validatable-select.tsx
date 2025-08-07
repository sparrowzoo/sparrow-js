import * as React from "react"
import {FieldValues} from "react-hook-form/dist/types/fields";
import {Label} from "@/components/ui/label";
import KeyValue from "@/common/lib/protocol/KeyValue";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useTranslations} from "next-intl";
import {Utils} from "@/common/lib/Utils";

export interface FormHookSelectProps<TFieldValues extends FieldValues>
    extends React.InputHTMLAttributes<HTMLInputElement> {
    pageTranslate?: (key: string) => string,
    fieldPropertyName: string,
    setValue: (propertyName: string, value: any) => void,
    defaultValue?: any,
    dictionary?: KeyValue[],
}

const ValidatableSelect = React.forwardRef<HTMLInputElement, FormHookSelectProps<FieldValues>>(
    ({
         pageTranslate,
         fieldPropertyName,
         dictionary,
         defaultValue,
         setValue,
         className,
     }, ref) => {
        if (!dictionary || dictionary.length == 0) {
            console.error("field is not found " + fieldPropertyName);
            return <></>
        }
        const translator = useTranslations("KVS." + fieldPropertyName);
        let currentItem = Utils.getValue(dictionary, defaultValue);
        if (!currentItem) {
            currentItem = dictionary[0];
        }
        const displayText = translator ? translator(currentItem?.value, {defaultValue: currentItem.value}) : currentItem.value;

        return (

            <div className="flex flex-row justify-start items-center mb-4 gap-2">
                <Label
                    className={"justify-end w-[8rem]"}>{pageTranslate ? pageTranslate(fieldPropertyName) : fieldPropertyName}</Label>
                <div className={"flex-1"}>


                    <Select defaultValue={defaultValue} onValueChange={(value) => {
                        setValue(fieldPropertyName, value);
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
                                        return <SelectItem key={item.key}
                                                           value={item.key + ""}>{translator ? translator(item.value, {defaultValue: item.value}) : item.value}</SelectItem>
                                    })
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className={"w-[10rem]"}>
                </div>
            </div>
        )
    }
)
ValidatableSelect.displayName = "ValidatableSelect"
export {ValidatableSelect}
