import * as React from "react";
import {CellContext} from "@tanstack/table-core";
import {Input} from "@/components/ui/input";

const SortableCell = (field: string) => {
    return ({row}: CellContext<any, any>, setData: any) => {
        const value = row.getValue<number>(field);
        <Input type={"number"} defaultValue={value}/>
    }
}
export default SortableCell;
