import * as React from "react";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";

const InputCell = (field: string, type: string, width?: number) => {
    const className = width ? `w-${width}` : "w-fit";
    return ({row}) => {
        const fieldValue = row.getValue(field) || "";
        const [value, setValue] = useState(fieldValue);
        useEffect(() => {
            setValue(fieldValue);
        }, [fieldValue]);
        if (type === "checkbox") {
            return <Checkbox value={value}
                             onCheckedChange={(value) => {
                                 debugger;
                                 console.log("log ", value);
                                 setValue(value);
                                 row.original[field] = value;
                             }}
                             aria-label="Select row"
            />
        }

        return (<><Input onChange={(event) => {
            row.original[field] = event.target.value;
            setValue(event.target.value);
            console.log("log ", value);
        }} className={className} type={type} value={value}/>
        </>);
    }
}
export default InputCell;
