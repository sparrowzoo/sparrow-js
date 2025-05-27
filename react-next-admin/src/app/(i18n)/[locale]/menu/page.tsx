"use client";

import * as React from "react";
import { columns, Payment } from "@/components/menu/columns";
import { DataTable } from "@/components/table/data-table";
import Search from "@/components/menu/search";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
    depth: 1,
    subRows: [
      {
        id: "11",
        amount: 999,
        status: "success",
        email: "Abe45@example.com",
        depth: 2,
      },
      {
        id: "12",
        amount: 999,
        status: "success",
        email: "Abe45@example.com",
        depth: 2,
        subRows: [
          {
            id: "21",
            amount: 999,
            status: "success",
            email: "Abe45@example.com",
            depth: 3,
          },
          {
            id: "22",
            amount: 999,
            status: "success",
            email: "Abe45@example.com",
            depth: 3,
          },
          {
            id: "23",
            amount: 999,
            status: "success",
            email: "Abe45@example.com",
            depth: 3,
          },
        ],
      },
    ],
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
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
