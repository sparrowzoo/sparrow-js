import ColumnOperation from "@/common/components/table/column-operation";
import * as React from "react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";

export const NormalHeader = ({showFilter, showSort, columnTitle}: ColumnOperationProps) => {
    return ({column}) => {
        return (<>
                <ColumnOperation columnTitle={columnTitle} showFilter={showFilter} showSort={showSort}
                                 column={column}/></>
        );
    }
};
