import * as React from "react";
import {useEffect, useState} from "react";
import {CellContext} from "@tanstack/table-core";
import {Input} from "@/components/ui/input";
import {getOriginalData} from "@/common/lib/table/TableUtils";
import {MyTableMeta} from "@/common/lib/table/DataTableProperty";

const SortableCell = (field: string) => {
    return ({row, table}: CellContext<any, any>) => {
        const meta = table.options.meta as MyTableMeta<any, any>;
        const setData = meta.setData;
        const fieldValue = row.getValue<number | string>(field);
        const [value, setValue] = useState(fieldValue);
        useEffect(() => {
            setValue(fieldValue);
        }, [fieldValue]);
        return <Input onBlur={() => {
            const originalData = getOriginalData(table);
            setData(originalData.sort((a, b) => a.sort - b.sort));
        }
        } onChange={(e) => {
            row.original[field] = e.target.value;
            if (e.target.value) {
                setValue(parseInt(e.target.value, 10));
            } else {
                setValue("");
            }
        }
        } className={"w-16"} min={0} max={99} type={"number"} value={value}/>
    }
}
export default SortableCell;
