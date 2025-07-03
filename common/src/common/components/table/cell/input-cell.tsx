import * as React from "react";

const InputCell = (field: string,type: string) => {
    return ({row}) => {
        const value = row.getValue(field);
        return <input type={type} defaultValue={value}/>
    }
}
export default InputCell;
