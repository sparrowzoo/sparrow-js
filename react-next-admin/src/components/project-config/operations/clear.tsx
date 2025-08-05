'use client'
import {CellContextProps, MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {ProjectConfig} from "@/components/project-config/columns";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import CoderApi from "@/api/manual/coder";
import toast from "react-hot-toast";

export default function ClearScaffold({cellContext}: CellContextProps<ProjectConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")

    const meta = cellContext.table.options.meta as MyTableMeta<ProjectConfig>;
    const primary = meta.primary;
    const row = cellContext.row.original;
    return <Button onClick={() => {
        CoderApi.clearScaffold(row[primary], errorTranslate).then(() => {
                toast.success(globalTranslate("clear-scaffold") + globalTranslate("operation-success"));
            }
        ).catch(() => {
        });
    }
    }>{globalTranslate("clear-scaffold")}</Button>
}
