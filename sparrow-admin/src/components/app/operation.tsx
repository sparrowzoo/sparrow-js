
import * as React from "react";
import {App} from "@/components/app/columns";
import {TableOperationProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import Result, {PagerResult} from "@/common/lib/protocol/Result";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import AddPage from "@/components/app/add";
import AppApi from "@/api/auto/app";
import toast from "react-hot-toast";
import TableUtils from "@/common/lib/table/TableUtils";
import {useTranslations} from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";



export default function Operation({table}: TableOperationProps<App>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("App.ErrorMessage")
    const [open, setOpen] = React.useState(false);
    const meta=table.options.meta as MyTableMeta<App>;
    const  Navigations=useNavigating();

    const initHandler=meta.initHandler;
    const setData=meta.setData;
    const result = meta.result as Result<PagerResult>;

    const callbackHandler = () => {
        setOpen(false);
        initHandler();
    }

    return (<div className="flex flex-wrap items-center justify-start gap-2">
            <Dialog onOpenChange={setOpen} open={open}>
                <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)}  variant="outline">{globalTranslate("add")}</Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl">
                     <AddPage table={table} callbackHandler={callbackHandler}/>
                </DialogContent>
            </Dialog>
            <Button onClick={() => {
                const selectedIds = TableUtils.getSelectedIds(table);
                if (selectedIds.length === 0) {
                                    toast(globalTranslate("no-record-checked"));
                                    return;
                }
                AppApi.batchDelete(selectedIds, errorTranslate,Navigations.redirectToLogin).then(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    (res) => {
                                            const datas= TableUtils.removeRowByPrimary(selectedIds,table);
                                            result.data.list=datas;
                                            result.data.recordTotal-=selectedIds.length;
                                            setData(TableUtils.cloneResult(result));
                        toast.success(globalTranslate("delete")+globalTranslate("operation-success"));
                    }
                )
            }} variant="outline">{globalTranslate("delete")}</Button>

            <Button onClick={() => {
                            const selectedIds = TableUtils.getSelectedIds(table);
                            if (selectedIds.length === 0) {
                                                toast(globalTranslate("no-record-checked"));
                                                return;
                            }
                            AppApi.enable(selectedIds, errorTranslate,Navigations.redirectToLogin).then(
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                (res) => {
                                   const datas= TableUtils.batchEnable(selectedIds,table,"status");
                                   result.data.list=datas;
                                   result.data.recordTotal-=selectedIds.length;
                                   setData(TableUtils.cloneResult(result));
                                   toast.success(globalTranslate("enable")+globalTranslate("operation-success"));
                                }
                            )
                        }} variant="outline">{globalTranslate("enable")}</Button>


                        <Button onClick={() => {
                                        const selectedIds = TableUtils.getSelectedIds(table);
                                        if (selectedIds.length === 0) {
                                                            toast(globalTranslate("no-record-checked"));
                                                            return;
                                        }
                                        AppApi.disable(selectedIds, errorTranslate,Navigations.redirectToLogin).then(
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            (res) => {
                                                 const datas= TableUtils.batchDisable(selectedIds,table,"status");
                                                 result.data.list=datas;
                                                 result.data.recordTotal-=selectedIds.length;
                                                 setData(TableUtils.cloneResult(result));
                                                toast.success(globalTranslate("disable")+globalTranslate("operation-success"));
                                            }
                                        )
                                    }} variant="outline">{globalTranslate("disable")}</Button>
        </div>
    );
}