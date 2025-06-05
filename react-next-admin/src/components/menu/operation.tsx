import * as React from "react";
import {Payment} from "@/components/menu/columns";
import {SearchProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";

export default function Operation({table}: SearchProps<Payment>) {
    return (<>
            <Button onClick={() => {
                alert(table.getRowModel().rows.length)
            }}  variant="ghost" className="ml-2">新增</Button>
            <Button  variant="ghost" className="ml-2">删除</Button>
        </>
    );
}
