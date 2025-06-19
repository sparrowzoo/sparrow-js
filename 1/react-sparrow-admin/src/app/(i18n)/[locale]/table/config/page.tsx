"use client";

import * as React from "react";
import {TableConfig, columns} from "@/components/tableConfig/columns";
import {DataTable} from "@/common/components/table/data-table";

export default function Page() {
    return (
        <div className="w-full">
            <div className="rounded-md border">
                <DataTable
                    data={data}
                    columns={columns}
                    filterColumn={true}
                ></DataTable>
            </div>
        </div>
    );
}