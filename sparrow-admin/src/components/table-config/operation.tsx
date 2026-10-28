import * as React from "react";
import {TableConfig} from "@/components/table-config/columns";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import TableConfigApi from "@/api/auto/table-config";
import toast from "react-hot-toast";
import TableUtils from "@/common/lib/table/TableUtils";
import {useTranslations} from "next-intl";
import CoderApi, {CreateTableResult} from "@/api/manual/coder";
import KeyValue from "@/common/lib/protocol/KeyValue";
import TableInit from "@/components/table-config/table-init";
import useNavigating from "@/common/hook/NavigatingHook";


export default function Operation({table}: TableOperationProps<TableConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const [open, setOpen] = React.useState(false);
    const [ddlPending, setDdlPending] = React.useState(false);
    const ddlPendingRef = React.useRef(false);
    const [createResults, setCreateResults] = React.useState<CreateTableResult[]>([]);
    const meta = table.options.meta as MyTableMeta<TableConfig>;
    const setData = meta.setData;
    const result = meta.result as Result<PagerResult>;
    const parent = meta.parent as KeyValue;
    const projectId = parent.key;
    const Navigations = useNavigating();

    const callbackHandler = () => {
        setOpen(false);
        meta.initHandler();
    }

    const handleDdlOperation = async (operation: "generate" | "create") => {
        if (ddlPendingRef.current) {
            return;
        }
        const tableNames = TableUtils.getSelectedFields(table, "tableName");
        if (tableNames.length === 0) {
            toast(globalTranslate("no-record-checked"));
            return;
        }
        ddlPendingRef.current = true;
        setDdlPending(true);
        setCreateResults([]);
        const toastId = toast.loading(globalTranslate("loading"));
        try {
            if (operation === "generate") {
                await CoderApi.generateDDL(projectId, tableNames, errorTranslate, Navigations.redirectToLogin);
                toast.success(globalTranslate("generate-ddl") + globalTranslate("operation-success"));
            } else {
                const response = await CoderApi.createTables(projectId, tableNames, errorTranslate, Navigations.redirectToLogin);
                if (!Array.isArray(response.data) || response.data.length === 0) {
                    toast.error(globalTranslate("create-tables-invalid-response"));
                    return;
                }
                setCreateResults(response.data);
                if (response.data.some(item => item.status === "FAILED")) {
                    toast.error(globalTranslate("create-tables-partial-failure"));
                } else {
                    toast.success(globalTranslate("create-tables-complete"));
                }
            }
        } catch (error) {
            // Fetcher already displays server errors; network failures need a local message.
            if (error instanceof TypeError) {
                toast.error(globalTranslate("ddl-network-error"));
            }
        } finally {
            toast.dismiss(toastId);
            ddlPendingRef.current = false;
            setDdlPending(false);
        }
    };

    const createResultMessage = (message: string) => {
        switch (message) {
            case "CREATED": return globalTranslate("create-table-created");
            case "ALREADY_EXISTS": return globalTranslate("create-table-skipped");
            case "DDL_NOT_FOUND": return globalTranslate("create-table-ddl-not-found");
            case "INVALID_DDL": return globalTranslate("create-table-invalid-ddl");
            case "TABLE_NOT_IN_PROJECT": return globalTranslate("create-table-not-in-project");
            default: return globalTranslate("create-table-failed");
        }
    };

    return (<div className="space-y-4">
        <div className="flex flex-wrap justify-between gap-4">
            <Dialog onOpenChange={setOpen} open={open}>
                <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)} variant="outline">{globalTranslate("add")}</Button>
                </DialogTrigger>
                <DialogContent className="w-[800px] sm:max-w-[625px]">
                    <TableInit callbackHandler={callbackHandler} table={table}/>
                </DialogContent>
            </Dialog>
            <Button onClick={() => {
                const selectedIds = TableUtils.getSelectedIds(table);
                if (selectedIds.length === 0) {
                    toast(globalTranslate("no-record-checked"));
                    return;
                }
                TableConfigApi.batchDelete(selectedIds, errorTranslate, Navigations.redirectToLogin).then(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    (res) => {
                        const datas = TableUtils.removeRowByPrimary(selectedIds, table);
                        result.data.list = datas;
                        result.data.recordTotal -= selectedIds.length;
                        setData(TableUtils.cloneResult(result));
                        toast.success(globalTranslate("delete") + globalTranslate("operation-success"));
                    }
                )
            }} variant="outline">{globalTranslate("delete")}</Button>

            <Button onClick={() => {
                const selectedIds = TableUtils.getSelectedIds(table);
                if (selectedIds.length === 0) {
                    toast(globalTranslate("no-record-checked"));
                    return;
                }
                TableConfigApi.enable(selectedIds, errorTranslate, Navigations.redirectToLogin).then(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    (res) => {
                        const datas = TableUtils.batchEnable(selectedIds, table, "status");
                        result.data.list = datas;
                        result.data.recordTotal -= selectedIds.length;
                        setData(TableUtils.cloneResult(result));
                        toast.success(globalTranslate("enable") + globalTranslate("operation-success"));
                    }
                )
            }} variant="outline">{globalTranslate("enable")}</Button>

            <Button onClick={() => {
                const selectedIds = TableUtils.getSelectedIds(table);
                if (selectedIds.length === 0) {
                    toast(globalTranslate("no-record-checked"));
                    return;
                }
                TableConfigApi.disable(selectedIds, errorTranslate, Navigations.redirectToLogin).then(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    (res) => {
                        const datas = TableUtils.batchDisable(selectedIds, table, "status");
                        result.data.list = datas;
                        result.data.recordTotal -= selectedIds.length;
                        setData(TableUtils.cloneResult(result));
                        toast.success(globalTranslate("disable") + globalTranslate("operation-success"));
                    }
                )
            }} variant="outline">{globalTranslate("disable")}</Button>


            <Button onClick={() => {
                const selectedIds = TableUtils.getSelectedIds(table);
                if (selectedIds.length === 0) {
                    toast(globalTranslate("no-record-checked"));
                    return;
                }
                const tableNames = TableUtils.getSelectedFields(table, "tableName");

                CoderApi.generate(projectId, tableNames, errorTranslate, Navigations.redirectToLogin).then(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    (res) => {
                        toast.success(globalTranslate("generate-code") + globalTranslate("operation-success"));
                    }
                )
            }} variant="outline">{globalTranslate("generate-code")}</Button>

            <Button onClick={() => void handleDdlOperation("generate")} disabled={ddlPending} variant="outline">
                {globalTranslate("generate-ddl")}
            </Button>
            <Button onClick={() => void handleDdlOperation("create")} disabled={ddlPending} variant="outline">
                {globalTranslate("create-tables")}
            </Button>

            <Button onClick={() => {
                const tableNames = TableUtils.getSelectedFields(table, "tableName");

                const toastId = toast.loading(globalTranslate("loading"));
                CoderApi.zipDownload(projectId, tableNames, errorTranslate, Navigations.redirectToLogin).then(
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
            }} variant="outline">{globalTranslate("zip-download")}</Button>
        </div>
        {createResults.length > 0 && <div className="space-y-2 rounded-md border p-4" role="status" aria-live="polite">
            <p className="font-medium">{globalTranslate("create-tables-results")}</p>
            {createResults.map(item => <p key={item.tableName} className={item.status === "FAILED" ? "text-destructive" : "text-sm"}>
                <span className="font-mono">{item.tableName}</span>: {createResultMessage(item.message)}
            </p>)}
        </div>}
        </div>
    );
}
