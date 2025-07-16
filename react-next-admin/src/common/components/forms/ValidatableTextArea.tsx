import * as React from "react"
import {Label} from "@/components/ui/label";
import ErrorMessage from "@/common/components/i18n/ErrorMessage";
import KeyValue from "@/common/lib/protocol/KeyValue";
import {Textarea} from "@/components/ui/textarea";

export interface FormHookInputProps
    extends React.InputHTMLAttributes<HTMLTextAreaElement> {
    pageTranslate?: (key: string) => string,
    validateTranslate?: (key: string) => string,
    fieldPropertyName: string,
    errorMessage?: string,
    isSubmitted?: boolean,
    keyValues?: KeyValue[],
    readonly?: boolean,
}

const ValidatableTextArea = React.forwardRef<HTMLTextAreaElement, FormHookInputProps>(
    ({
         errorMessage,
         validateTranslate,
         pageTranslate,
         fieldPropertyName,
         isSubmitted,
         className,
         readonly,
         ...props
     }, ref) => {

        return (

            <div className="flex flex-row justify-start items-center mb-4 gap-2">
                <Label
                    className={"justify-end w-[8rem]"}>{pageTranslate?.(fieldPropertyName) || fieldPropertyName}</Label>
                <div className={"flex-1 flex flex-col"}>
                    <Textarea onKeyDown={(e) => {
                        e.stopPropagation();
                    }
                    }
                              name={fieldPropertyName}
                              className={className}
                              readOnly={readonly}
                              ref={ref}
                              {...props}
                    /><ErrorMessage messageClass={"text-sm text-red-500 w-[10rem]"}
                                    submitted={isSubmitted as boolean}
                                    message={errorMessage}
                />
                </div>
            </div>
        )
    }
)
ValidatableTextArea.displayName = "ValidatableTextArea"
export {ValidatableTextArea}
