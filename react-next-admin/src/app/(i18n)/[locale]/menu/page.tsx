"use client";
import * as React from "react";
import {useState} from "react";
import {columns, Payment} from "@/components/menu/columns";
import {DataTable} from "@/common/components/table/data-table";
import Search from "@/components/menu/search";
import Operation from "@/components/menu/operation";
import EditPage from "@/components/menu/edit";
import Result, {PagerResult} from "@/common/lib/protocol/Result";

const data: Payment[] = [
    {
        id: "1",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
        depth: 1,
        currency: "USD",
        subRows: [
            {
                id: "11",
                amount: 999,
                status: "success",
                email: "Abe45@example.com",
                depth: 2,
                currency: "USD",

            },
            {
                id: "12",
                amount: 999,
                status: "success",
                email: "Abe45@example.com",
                depth: 2,
                currency: "USD",

                subRows: [
                    {
                        id: "21",
                        amount: 999,
                        status: "success",
                        email: "Abe45@example.com",
                        depth: 3,
                        currency: "USD",

                    },
                    {
                        id: "22",
                        amount: 999,
                        status: "success",
                        email: "Abe45@example.com",
                        depth: 3,
                        currency: "USD",

                    },
                    {
                        id: "23",
                        amount: 999,
                        status: "success",
                        email: "Abe45@example.com",
                        depth: 3,
                        currency: "USD",

                    },
                ],
            },
        ],
    },
    {
        id: "2",
        amount: 242,
        status: "success",
        email: "Abe45@example.com",
        currency: "USD",

    },
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
const pageResult: PagerResult<Payment> = {
    list: data,
    recordTotal: data.length
};
const result = {
    code: "0",
    data: pageResult
} as Result<PagerResult<Payment>>;
export default function Page() {
    const [dataState, setDataState] = useState(result);
    return (
        <div className="w-full">
            <DataTable<Payment>
                hiddenColumns={{status: false}}
                SearchComponent={Search}
                OperationComponent={Operation}
                EditComponent={EditPage}
                primary={"id"}
                result={dataState}
                columns={columns}
                defaultPager={{pageIndex: 0, pageSize: -1}}
                setData={setDataState}
                i18n={true} initHandler={() => {
            }}></DataTable>
        </div>
    );
}
