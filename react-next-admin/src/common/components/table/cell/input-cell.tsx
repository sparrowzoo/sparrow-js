import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";

const InputCell = (field: string, type: string) => {

    return ({row}) => {
        const [value, setValue] = useState(row.original[field]);
        useEffect(() => {
            setValue(row.original[field]);
        }, [row.original[field]]);
        if (type === "checkbox") {
            return <Checkbox
                defaultValue={value}
                onCheckedChange={(value) => {
                    setValue(value);
                    row.original[field] = value;
                }}
                aria-label="Select row"
            />
        }

        return (<><input onChange={(event) => {
            row.original[field] = event.target.value;
            setValue(event.target.value);
        }} className={"w-fit"} type={type} value={value}/>
        </>);
    }
}
export default InputCell;
