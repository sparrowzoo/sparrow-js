import * as React from "react";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {MyTableMeta} from "@/common/lib/table/DataTableProperty";
import TableUtils from "@/common/lib/table/TableUtils";
import {PagerResult} from "@/common/lib/protocol/Result";

const SortableCell = (field: string) => {
    const Cell = ({row, table}) => {
        const meta = table.options.meta as MyTableMeta<unknown>;
        const result = meta.result;
        const setData = meta.setData;
        const fieldValue = row.getValue(field);
        const [value, setValue] = useState(fieldValue);
        useEffect(() => {
            setValue(fieldValue);
        }, [fieldValue]);
        return <Input onBlur={() => {
            const originalData = TableUtils.getOriginalData(table);
            (result.data as PagerResult).list = originalData.sort((a, b) => Number(a.sort) - Number(b.sort));
            setData(TableUtils.cloneResult(result));
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
    Cell.displayName = "SortableCell";
    return Cell;
}
export default SortableCell;
