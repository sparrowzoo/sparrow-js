import * as React from "react";

const NormalCell = (field: string, width?: number, handler: (value: any) => string = null) => {
    const widthClass = width ? `w-${width}` : "w-fit";
    return ({row}) => {
        let value = row.getValue(field);
        if (handler) {
            value = handler(value);
        }
        if (typeof value === "boolean") {
            const className = `uppercase ${widthClass}`;
            return <div className={className}>{value.toString()}</div>
        }
        return <div className={widthClass}>{value}</div>
    }
}
export default NormalCell;
