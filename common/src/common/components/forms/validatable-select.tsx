import {Label} from "@/components/ui/label";
import KeyValue from "@/common/lib/protocol/KeyValue";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useTranslations} from "next-intl";
import {Utils} from "@/common/lib/Utils";

export interface FormHookSelectProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    pageTranslate?: (key: string) => string,
    fieldPropertyName: string,
    setValue: (propertyName: string, value: unknown) => void,
    defaultValue?: string,
    dictionary?: KeyValue[],
}

const ValidatableSelect = ({
         pageTranslate,
         fieldPropertyName,
         dictionary,
         defaultValue,
         setValue,
         className,
     }: FormHookSelectProps) => {

        const translator = useTranslations("KVS");

        let defaultValueStr = defaultValue?.toString();
        if (!dictionary || dictionary.length == 0) {
            console.error("field is not found " + fieldPropertyName);
            return <></>
        }

        let currentItem = Utils.getValue(dictionary, defaultValue);
        if (!currentItem) {
            currentItem = dictionary[0];
            defaultValueStr = currentItem.key.toString();
        }
        let displayText = currentItem.value;
        const i18n = translator.has(fieldPropertyName);
        if (i18n) {
            displayText = translator(fieldPropertyName + "." + currentItem.value);
        }

        setValue(fieldPropertyName, defaultValueStr);

        return (

            <div className="flex flex-row justify-start items-center mb-4 gap-2">
                <Label
                    className={"justify-end w-[8rem]"}>{pageTranslate ? pageTranslate(fieldPropertyName) : fieldPropertyName}</Label>
                <div className={"flex-1"}>


                    <Select defaultValue={defaultValueStr} onValueChange={(value) => {
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
                                        let displayText = item.value;
                                        if (i18n) {
                                            displayText = translator(fieldPropertyName + "." + item.value);
                                        }
                                        return <SelectItem key={item.key}
                                                           value={item.key.toString()}>{displayText}</SelectItem>
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
ValidatableSelect.displayName = "ValidatableSelect"
export {ValidatableSelect}
