'use client'
import {CellContextProps, MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {ProjectConfig} from "@/components/project-config/columns";
import {useRouter} from "@/common/i18n/navigation";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";

export default function InitScaffold({cellContext}: CellContextProps<ProjectConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const meta = cellContext.table.options.meta as MyTableMeta<ProjectConfig>;
    const primary = meta.primary;
    const row = cellContext.row.original;
    const router = useRouter();
    return <Button onClick={() => {
        router.push({pathname: "/", query: {projectId: row[primary]}});
    }
    }>{globalTranslate("init-scaffold")}</Button>
}
