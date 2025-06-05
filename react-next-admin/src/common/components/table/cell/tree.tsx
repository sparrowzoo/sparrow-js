import {ChevronDown, ChevronRight, Minus} from "lucide-react";
import * as React from "react";

const TreeCell = (field: string) => {
    return ({row}) => {
        const depth = row.depth;
        const className = `flex items-center w-full justify-start  pl-${
            depth * 4
        }`;
        return (
            <div className={className}>
                {row.subRows.length > 0 ? (
                    <button
                        {...{
                            onClick: row.getToggleExpandedHandler(),
                            style: {cursor: "pointer"},
                        }}
                    >
                        {row.getIsExpanded() ? <ChevronDown/> : <ChevronRight/>}
                    </button>
                ) : (
                    <>
                        <Minus className={"text-background"}/>
                    </>
                )}
                {row.getValue(field)}
            </div>
        );
    }
}
export default TreeCell;

