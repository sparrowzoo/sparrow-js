import * as React from "react"

import {cn} from "@/lib/utils"
import {FieldValues} from "react-hook-form/dist/types/fields";
import {Label} from "@/components/ui/label";
import ErrorMessage from "@/common/components/i18n/ErrorMessage";
import KeyValue from "@/common/lib/protocol/KeyValue";

export interface FormHookInputProps<TFieldValues extends FieldValues>
    extends React.InputHTMLAttributes<HTMLInputElement> {
    pageTranslate?: (key: string) => string,
    validateTranslate?: (key: string) => string,
    fieldPropertyName: string,
    errorMessage?: string,
    isSubmitted?: boolean,
    keyValues?: KeyValue[],
    readonly?: boolean,
}

const ValidatableInput = React.forwardRef<HTMLInputElement, FormHookInputProps<FieldValues>>(
    ({
         errorMessage,
         validateTranslate,
         pageTranslate,
         fieldPropertyName,
         isSubmitted,
         type,
         className,
         readonly,
         ...props
     }, ref) => {
        if (type === "hidden") {
            return <input
                type={type}
                ref={ref}
                {...props}
            />
        }
        const isTextInput = type === "text" || type === "password" || type === "email" || type === "number";
        const defaultClazz = isTextInput ? "flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" : "";

        return (

            <div className="flex flex-row justify-start items-center mb-4 gap-2">
                <Label
                    className={"justify-end w-[8rem]"}>{pageTranslate?.(fieldPropertyName) || fieldPropertyName}</Label>
                <div className={"flex-1"}>
                    <input onKeyDown={(e) => {
                        e.stopPropagation();
                    }
                    }
                           name={fieldPropertyName}
                           type={type}
                           className={cn(
                               defaultClazz,
                               className
                           )}
                           readOnly={readonly}
                           ref={ref}
                           {...props}
                    />
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
)
ValidatableInput.displayName = "ValidatableInput"
export {ValidatableInput}
