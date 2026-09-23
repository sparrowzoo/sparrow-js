'use client'
import {CellContextProps, MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {ProjectConfig} from "@/components/project-config/columns";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";
import CoderApi from "@/api/manual/coder";
import toast from "react-hot-toast";
import useNavigating from "@/common/hook/NavigatingHook";

export default function DownloadScaffold({cellContext}: CellContextProps<ProjectConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
    const Navigations = useNavigating();

    const meta = cellContext.table.options.meta as MyTableMeta<ProjectConfig>;
    const primary = meta.primary;
    const row = cellContext.row.original;
    return <Button onClick={() => {
        const toastId = toast.loading(globalTranslate("loading"));
        CoderApi.zipDownload(row[primary], [], errorTranslate, Navigations.redirectToLogin).then(
            ({blob, filename}) => {
                toast.dismiss(toastId);
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 0);
                toast.success(globalTranslate("zip-download") + globalTranslate("operation-success"));
            }
        ).catch(() => {
            toast.dismiss(toastId);
        });
    }
    }>{globalTranslate("zip-download")}</Button>
}
