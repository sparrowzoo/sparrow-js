import * as React from "react";
import {TableConfig} from "@/components/table-config/columns";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import TableConfigApi from "@/api/auto/table-config";
import toast from "react-hot-toast";
import TableUtils from "@/common/lib/table/TableUtils";
import {useTranslations} from "next-intl";
import CoderApi from "@/api/manual/coder";
import KeyValue from "@/common/lib/protocol/KeyValue";
import TableInit from "@/components/table-config/table-init";


export default function Operation({table}: TableOperationProps<TableConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const [open, setOpen] = React.useState(false);
    const meta = table.options.meta as MyTableMeta<TableConfig>;

    const initHandler = meta.initHandler;
    const setData = meta.setData;
    const result = meta.result;
    const parent = meta.parent as KeyValue;
    const projectId = parent.key;
    const callbackHandler = () => {
        setOpen(false);
        initHandler();
    }

    return (<div className="flex justify-between gap-4">
            <Dialog onOpenChange={setOpen} open={open}>
                <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)} variant="outline">{globalTranslate("add")}</Button>
                </DialogTrigger>
                <DialogContent className="w-[800px] sm:max-w-[625px]">
                    <TableInit table={table}/>
                </DialogContent>
            </Dialog>
            <Button onClick={() => {
                const selectedIds = TableUtils.getSelectedIds(table);
                if (selectedIds.length === 0) {
                    toast(globalTranslate("no-record-checked"));
                    return;
                }
                TableConfigApi.batchDelete(selectedIds, errorTranslate).then(
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
                TableConfigApi.enable(selectedIds, errorTranslate).then(
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
                TableConfigApi.disable(selectedIds, errorTranslate).then(
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

                CoderApi.generate(projectId, tableNames, errorTranslate).then(
                    (res) => {
                        toast.success(globalTranslate("generate-code") + globalTranslate("operation-success"));
                    }
                )
            }} variant="outline">{globalTranslate("generate-code")}</Button>
        </div>
    );
}
