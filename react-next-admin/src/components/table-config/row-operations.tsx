'use client'
import {CellContextProps, MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {TableConfig} from "@/components/table-config/columns";
import {useRouter} from "@/common/i18n/navigation";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";

export default function RowOperations({cellContext}: CellContextProps<TableConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const meta = cellContext.table.options.meta as MyTableMeta<TableConfig>;
    const primary = meta.primary;
    const row = cellContext.row.original;
    const router = useRouter();
    //return <Button onClick={() => {
    //    router.push({pathname: "/****", query: {id: row[primary]}});
    //}
    //}>{globalTranslate("table")}</Button>
    return null;
}