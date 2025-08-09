import * as React from "react"
import {useEffect} from "react"
import {FieldValues} from "react-hook-form/dist/types/fields";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {ChevronDownIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import dayjs from "dayjs";

export interface FormHookDateProps<TFieldValues extends FieldValues>
    extends React.InputHTMLAttributes<HTMLInputElement> {
    pageTranslate?: (key: string) => string,
    defaultValue?: string,
    format?: string,
    setValue: (propertyName: string, value: any) => void,
    fieldPropertyName: string,
    readonly?: boolean,
}

const ValidatableDate = React.forwardRef<HTMLInputElement, FormHookDateProps<FieldValues>>(
    ({
         pageTranslate,
         defaultValue,
         setValue,
         format,
         fieldPropertyName,
         type,
         className,
         readonly,
         ...props
     }, ref) => {
        const [open, setOpen] = React.useState(false);
        const dateFormat = format || "YYYY-MM-DD";
        let defaultDate = new Date();
        if (defaultValue) {
            defaultDate = new Date(defaultValue);
        } else {
            defaultValue = dayjs(defaultDate).format(dateFormat);
        }
        //受控组件需要加此条件
        useEffect(() => {
            setValue(fieldPropertyName, defaultValue);
        }, []);

        const [date, setDate] = React.useState<Date>(defaultDate);
        return (
            <div className="flex flex-row justify-start items-center mb-4 gap-2">
                <Label
                    className={"justify-end w-[8rem]"}>{pageTranslate?.(fieldPropertyName) || fieldPropertyName}</Label>
                <div className={"flex-1"}>
                    <Popover open={open}>
                        <PopoverTrigger asChild>
                            <Button onClick={(e) => {
                                setOpen(!open);
                                e.stopPropagation();
                            }}
                                    variant="outline"
                                    id="date"
                                    className="w-48 justify-between font-normal"
                            >
                                {dayjs(date).format(dateFormat)}
                                <ChevronDownIcon/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    const formattedDate = dayjs(date).format(dateFormat);
                                    setDate(date)
                                    setOpen(false);
                                    setValue(fieldPropertyName, formattedDate);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        )
    }
)
ValidatableDate.displayName = "ValidatableDate"
export {ValidatableDate}
