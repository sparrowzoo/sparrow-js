import * as React from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";

const InputCell = (field: string, type: string) => {

    return ({row}) => {
        const value = row.getValue(field);

        if (type === "checkbox") {
            return <Checkbox
                defaultValue={value}
                onCheckedChange={(value) => {
                    debugger;
                    row.original[field] = value;
                }}
                aria-label="Select row"
            />
        }
        return <Input onChange={(event) => {
            row.original[field] = event.target.value;
        }} className={"w-fit"} type={type} defaultValue={value}/>
    }
}
export default InputCell;
