import * as React from "react";

const NormalCell = (field: string) => {
    return ({row}) => {
        const value = row.getValue(field);
        if (typeof value === "boolean") {
            return <div className="uppercase">{value.toString()}</div>
        }
        return <div className="lowercase">{row.getValue(field)}</div>
    }
}
export default NormalCell;
