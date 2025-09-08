import {
    Pagination,
    PaginationContent,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/common/components/table/pagination";
import * as React from "react";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {PaginationState} from "@tanstack/table-core/src/features/RowPagination";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";

export default function Pager({table}: TableOperationProps<any>) {
    const translate = useTranslations("GlobalForm.pagination")
    const meta = table.options.meta as MyTableMeta<any>;
    const pageCount = table.getPageCount();
    const pagination = table.getState().pagination;
    const firstPageIndex = pagination.pageIndex - 5 < 0 ? 0 : pagination.pageIndex - 5;
    const lastPageIndex = firstPageIndex + 10 > pageCount ? pageCount : firstPageIndex + 10;
    const pageNumbers = Array.from({length: lastPageIndex - firstPageIndex}, (_, i) => firstPageIndex + i);
    const searchHandler = (localPager: PaginationState) => {
        meta.searchHandler(localPager)
    }
    return <div className={"m-2"}>
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationFirst
                        onClick={() => {
                            table.firstPage();
                            searchHandler({
                                ...table.getState().pagination,
                                pageIndex: 1
                            });
                        }}
                        href="#"/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => {
                            if (!table.getCanPreviousPage()) {
                                toast.error(translate("previous-page-not-found"));
                                return;
                            }

                            table.previousPage();
                            searchHandler({
                                ...table.getState().pagination,
                                pageIndex: table.getState().pagination.pageIndex - 1
                            });
                        }}
                        href="#"/>
                </PaginationItem>
                <PaginationItem>
                    {pageNumbers.map(pageIndex => (
                        <PaginationLink key={pageIndex} isActive={table.getState().pagination.pageIndex === pageIndex}
                                        onClick={() => {
                                            table.setPageIndex(pageIndex);
                                            searchHandler({...table.getState().pagination, pageIndex: pageIndex + 1});
                                        }}
                                        href="#">{pageIndex + 1}</PaginationLink>
                    ))
                    }
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        onClick={() => {
                            if (!table.getCanNextPage()) {
                                toast.error(translate("next-page-not-found"));
                                return;
                            }
                            table.nextPage();
                            searchHandler({
                                ...table.getState().pagination,
                                pageIndex: table.getState().pagination.pageIndex + 1
                            });
                        }}
                        href="#"/>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLast
                        onClick={() => {
                            table.lastPage();
                            searchHandler({
                                ...table.getState().pagination,
                                pageIndex: table.getPageCount()
                            });
                        }}
                        href="#"/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    </div>
}
