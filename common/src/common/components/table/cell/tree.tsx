import {ChevronDown, ChevronRight, Loader2, Minus} from "lucide-react";
import * as React from "react";
import {MyTableMeta} from "@/common/lib/table/DataTableProperty";

const TreeCell = (field: string) => {
    const Cell = ({row, table}) => {
        const depth = row.depth;
        const meta = table.options.meta as MyTableMeta<unknown>;
        const id = String(row.original.id);
        const isLoading = meta.isNodeLoading?.(id) ?? false;
        const canExpand = row.getCanExpand();
        const isExpanded = row.getIsExpanded();

        const handleToggle = () => {
            if (isLoading) return;
            const willExpand = !isExpanded;
            row.toggleExpanded(willExpand);
            if (willExpand) {
                meta.loadSubRowsInto?.(row.original);
            }
        };

        return (
            <div
                className="flex items-center w-full justify-start"
                style={{paddingLeft: `${depth * 16}px`}}
            >
                {canExpand ? (
                    <button
                        onClick={handleToggle}
                        style={{cursor: "pointer"}}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin"/>
                        ) : isExpanded ? (
                            <ChevronDown/>
                        ) : (
                            <ChevronRight/>
                        )}
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
    Cell.displayName = "TreeCell";
    return Cell;
}
export default TreeCell;
