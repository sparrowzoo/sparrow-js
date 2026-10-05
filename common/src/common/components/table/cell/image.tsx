import * as React from "react";


const ImageCell = (field: string) => {
    const Cell = ({row}) => {
        const url = row.getValue(field);
        if (!url) {
            return null;
        }
        return <img
            src={url}
            alt={""}
            loading={"lazy"}
            className={"h-9 w-9 rounded object-cover border border-border bg-muted"}
        />;
    }
    Cell.displayName = 'ImageCell';
    return Cell;
}
export default ImageCell;
