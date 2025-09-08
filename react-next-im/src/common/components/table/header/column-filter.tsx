import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Columns3Cog} from "lucide-react";
import {useTranslations} from "next-intl";


const ColumnFilter = () => {
    return ({table, column}) => {
        const tableName = table?.options.meta?.tableName;
        const i18n = table?.options.meta.i18n;
        const t = useTranslations(tableName);

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
                                    {i18n && t.has(column.id) ? t(column.id) : column.id}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
};
export default ColumnFilter;

