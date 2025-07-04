import * as React from "react";
import {CellContext} from "@tanstack/table-core";
import {Input} from "@/components/ui/input";

const SortableCell = (field: string) => {
    return ({cell, row}: CellContext<any, any>) => {
        const table = cell.getContext()?.table;
        const original = cell.getContext().row.original;
        const setData = table.options.meta?.setData;

        const value = row.getValue<number>(field);
        return <Input onChange={(e) => {
            original[field] = e.target.value;
        }} className={"w-fit"} type={"number"} defaultValue={original[field]}/>
    }
}
export default SortableCell;
