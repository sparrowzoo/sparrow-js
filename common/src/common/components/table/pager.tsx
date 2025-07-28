import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext
} from "@/common/components/table/pagination";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {MyTableMeta, SimplePager, TableOperationProps} from "@/common/lib/table/DataTableProperty";

export default function Pager({table}: TableOperationProps<any>) {
    const meta = table.options.meta as MyTableMeta<any>;
    const pager = meta.pager;
    const setPager = meta.setPager;
    const searchHandler = (localPager: SimplePager) => {
        setPager(localPager)
        meta.searchHandler(localPager)
    }
    return <div>
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Button
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </Button>
                </PaginationItem>
                <PaginationItem>

                    <Button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </Button>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink onClick={() => searchHandler({pageNo: 2, pageSize: pager.pageSize})}
                                    href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        onClick={() => searchHandler({pageNo: pager.pageNo + 1, pageSize: pager.pageSize})}
                        href="#"/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    </div>
}
