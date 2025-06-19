import {Input} from "@/components/ui/input";
import * as React from "react";
import {TableConfig} from "@/components/table-config/columns";
import {TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";

export default function Search({table, setData}: TableOperationProps<TableConfig>) {
    const data: TableConfig[] = [
        {
            id: "3",
            amount: 837,
            status: "processing",
            email: "Monserrat44@example.com",
            currency: "USD",
        },
        {
            id: "4",
            amount: 874,
            status: "success",
            email: "Silas22@example.com",
            currency: "USD",
        },
        {
            id: "5",
            amount: 721,
            status: "failed",
            email: "carmella@example.com",
            currency: "USD",

        },
    ];


    return (<>
            <Input
                placeholder="Filter emails..."
                className="max-w-sm"
            />
            <Input
                placeholder="Filter emails..."
                className="max-w-sm"
            />
            <Button onClick={() => setData(data)} variant="ghost" className="ml-2">搜索</Button>
        </>
    );
}