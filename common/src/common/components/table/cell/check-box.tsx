import {Checkbox} from "@/components/ui/checkbox";
import * as React from "react";

const CheckBoxCell = ({row}) => (
    <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
    />
)
export default CheckBoxCell;
