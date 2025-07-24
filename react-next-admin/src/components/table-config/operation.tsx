import * as React from "react";
import {TableConfig} from "@/components/table-config/columns";
import {MyTableMeta, TableOperationProps} from "@/common/lib/table/DataTableProperty";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import AddPage from "@/components/table-config/add";
import TableConfigApi from "@/api/auto/table-config";
import toast from "react-hot-toast";
import TableUtils from "@/common/lib/table/TableUtils";
import {useTranslations} from "next-intl";
import CoderApi from "@/api/manual/coder";
import KeyValue from "@/common/lib/protocol/KeyValue";


export default function Operation({table}: TableOperationProps<TableConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const meta = table.options.meta as MyTableMeta<TableConfig>;
    const parent = meta?.parent as KeyValue;
    return (<div className="flex justify-between gap-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">{globalTranslate("add")}</Button>
                </DialogTrigger>
                <DialogContent className="w-[800px] sm:max-w-[625px]">
                    <AddPage/>
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
                        toast.success(globalTranslate("disable") + globalTranslate("operation-success"));
                    }
                )
            }} variant="outline">{globalTranslate("disable")}</Button>

            <Button onClick={() => {
                debugger;
                const selectedIds = TableUtils.getSelectedFields(table, 'tableName');
                if (selectedIds.length === 0) {
                    toast(globalTranslate("no-record-checked"));
                    return;
                }
                debugger;
                CoderApi.generate(parent.key, selectedIds, errorTranslate).then(
                    (res) => {
                        toast.success(globalTranslate("generate-code") + globalTranslate("operation-success"));
                    }
                )
            }} variant="outline">{globalTranslate("generate-code")}</Button>
        </div>
    );
}
