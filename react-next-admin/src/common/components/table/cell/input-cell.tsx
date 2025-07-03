import * as React from "react";
import {Input} from "@/components/ui/input";

const InputCell = (field: string,type: string) => {
    return ({row}) => {
        const value = row.getValue(field);
        return <Input className="w-[100px]" type={type} defaultValue={value}/>
    }
}
export default InputCell;
