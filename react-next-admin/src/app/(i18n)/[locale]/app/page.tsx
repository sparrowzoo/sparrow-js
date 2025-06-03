"use client";

import * as React from "react";
import {App, columns} from "@/components/app/columns";
import {DataTable} from "@/components/table/data-table";
import Search from "@/components/app/search";

const data: App[] = [
    {
        id: "m5gr84i9",
        code: "316",
        status: "success",
        name: "ken99@example.com",
        logo: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",


    },
    {
        id: "3u1reuv4",
        status: "success",
        code: "Abe45@example.com",
        name: "ken99@example.com",
        logo: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
    },
    {
        id: "derv1ws0",
        status: "processing",
        code: "837",
        name: "processing",
        logo: "Monserrat44@example.com",
    }
];

export default function DataTableDemo() {
    return (
        <div className="w-full">
            <div className="rounded-md border">
                <DataTable
                    SearchComponent={Search}
                    data={data}
                    columns={columns}
                    filterColumn={true}
                ></DataTable>
            </div>
        </div>
    );
}
