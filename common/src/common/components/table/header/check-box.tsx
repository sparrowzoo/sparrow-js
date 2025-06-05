import {Checkbox} from "@/components/ui/checkbox";
import * as React from "react";

const CheckboxHeader = ({table}) => (
    <Checkbox
        checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
    />
);

export default CheckboxHeader;
