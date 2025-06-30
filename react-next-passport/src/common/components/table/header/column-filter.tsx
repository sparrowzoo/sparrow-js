import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Columns3Cog} from "lucide-react";
import {ColumnOperationProps} from "@/common/lib/table/DataTableProperty";
import {useTranslations} from "next-intl";


const ColumnFilter = ({i18nPrefix}: ColumnOperationProps) => {
    return ({table, column}) => {
        const t = useTranslations(i18nPrefix);
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="link">
                        <Columns3Cog/>{" "}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                            debugger;
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {i18nPrefix ? t(column.id) : column.id}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
};
export default ColumnFilter;

