import {Label} from "@/components/ui/label";
import KeyValue from "@/common/lib/protocol/KeyValue";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useTranslations} from "next-intl";
import {Utils} from "@/common/lib/Utils";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import ErrorMessage from "@/common/components/i18n/ErrorMessage";
import * as React from "react";

export interface FormHookSelectProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    pageTranslate?: (key: string) => string,
    fieldPropertyName: string,
    setValue: (propertyName: string, value: unknown) => void,
    setError?: (propertyName: string, error: { message?: string }) => void,
    defaultValue?: string,
    dictionary?: KeyValue[],
    errorMessage?: string,
    isSubmitted?: boolean
}

const ValidatableSelect = ({
                               pageTranslate,
                               fieldPropertyName,
                               dictionary,
                               defaultValue,
                               setValue,
                               setError,
                               className,
                               errorMessage,
                               isSubmitted,
                           }: FormHookSelectProps) => {

    const translator = useTranslations("KVS");

    let defaultValueStr = defaultValue?.toString();
    const hasDictionary = !!dictionary && dictionary.length > 0;

    let currentItem: KeyValue | undefined;
    if (hasDictionary) {
        currentItem = Utils.getValue(dictionary, defaultValue);
        if (!currentItem) {
            currentItem = dictionary![0];
            defaultValueStr = currentItem.key.toString();
        }
    }

    React.useEffect(() => {
        if (hasDictionary) {
            setValue(fieldPropertyName, defaultValueStr);
        }
        // setValue is intentionally excluded: react-hook-form recreates it each
        // render, so including it would re-run on every render and reset the value.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasDictionary, fieldPropertyName, defaultValueStr]);

    if (!hasDictionary) {
        return <ValidatableInput
            pageTranslate={pageTranslate}
            fieldPropertyName={fieldPropertyName}
            defaultValue={defaultValue}
            className={className}
            onChange={(e) => {
                setValue(fieldPropertyName, e.target.value);
            }}
        />
    }

    let displayText = currentItem!.value;
    const i18n = translator.has(fieldPropertyName);
    if (i18n) {
        displayText = translator(fieldPropertyName + "." + currentItem!.value);
    }

    return (

        <div className="flex flex-row justify-start items-center mb-4 gap-2">
            <Label
                className={"justify-end w-[8rem]"}>{pageTranslate ? pageTranslate(fieldPropertyName) : fieldPropertyName}</Label>
            <div className={"flex-1"}>


                <Select defaultValue={defaultValueStr} onValueChange={(value) => {
                    setValue(fieldPropertyName, value);
                    setError?.(fieldPropertyName, {message: undefined});
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
                <ErrorMessage messageClass={"text-sm text-red-500"}
                              submitted={isSubmitted as boolean}
                              message={errorMessage}
                />
            </div>
        </div>
    )
}
ValidatableSelect.displayName = "ValidatableSelect"
export {ValidatableSelect}
