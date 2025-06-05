import * as React from "react";

const NormalCell = (field: string) => {
    return ({row}) => <div className="lowercase">{row.getValue(field)}</div>
}
export default NormalCell;
